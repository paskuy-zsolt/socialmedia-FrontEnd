import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, Post } from '../../modules/post/post.model';
import { User } from '../../modules/user/user.model';
import { CommentService } from '../../service/comment/comment.service';
import { TimePassedPipe } from '../../pipe/time-passed.pipe';
import { forkJoin, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { CommentEventService } from '../../service/comment/event/comment-event.service';
import { GlobalLoaderComponent } from '../loader/global-loader/global-loader.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, TimePassedPipe, GlobalLoaderComponent, RouterLink, FormsModule, FontAwesomeModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  private commentService = inject(CommentService);
  private commentEventService = inject(CommentEventService);

  // Input properties
  @Input() comments: Comment[] = [];
  @Input() post: Post = {} as Post;
  @Input() user: User | null = null;
  @Input() postId!: string;

  // Component State
  isLoading: boolean = true;
  comment_value: string = '';
  
  // Icons
  deleteIcon = faTrashCan;

  ngOnInit(): void {
    if (this.postId) {
      this.fetchComments(this.postId);
    }
  }

  fetchComments(postId: string): void {
    this.isLoading = true;

    this.commentService.getCommentsForPost(postId).subscribe({
      next: (data: { success: boolean; comments: { user: string; _id: string; content: string; createdAt: string; }[] }) => {
        if (data.success) {
          if (data.comments.length > 0) {
            const tempComments: Comment[] = data.comments.map(comment => ({
              _id: comment._id,
              content: comment.content,
              createdAt: comment.createdAt,
              user: { userID: comment.user, name: '', email: '' }, // Initialize with userID as string
              post: {} as Post
            }));
  
            // Create an array of observables to fetch user data for each comment
            const userFetchObservables = tempComments.map(comment =>
              this.commentService.getUserForComments(comment.user.userID).pipe(
                map(userData => {
                  comment.user.name = userData.name;  // Set the user's name
                  comment.user.email = userData.email; // Set the user's email
                  return comment; // Return the updated comment
                })
              )
            );
  
            // Use forkJoin to wait for all user fetch requests to complete
            forkJoin(userFetchObservables).subscribe({
              next: (updatedComments) => {
                this.comments = updatedComments; // Assign updated comments after fetching user data
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Error fetching user data:', err);
                this.isLoading = false;
              }
            });
          } else {
            this.comments = []; // No comments case
            this.isLoading = false;
          }
        } else {
          console.error('Failed to fetch comments');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
        this.isLoading = false;
      }
    });
  }

  addComment(): void {
    if (!this.comment_value.trim()) {
      return;
    }
  
    if (!this.user) {
      console.error('User data is missing.');
      return;
    }

    const newComment = {
      postId: this.postId,
      userId: this.user.userID,
      content: this.comment_value
    };
  
    this.commentService.addComment(newComment.postId, newComment.userId, newComment.content).subscribe({
      next: (response: any) => {
        console.log(response);

        if (response.success) {
          // Assuming the backend returns the full comment with user info
          const addedComment: Comment = {
            _id: response.comment._id,
            content: response.comment.content,
            createdAt: response.comment.createdAt,
            user: {
              userID: this.user!.userID,
              name: this.user!.name
            },
            post: this.post
          };

          // Push the new comment to the comments array and update UI
          this.comments.push(addedComment);

          // Clear input field
          this.comment_value = '';

          // Emit the updated comment count
          this.commentEventService.emitCommentCountChange(this.postId, this.comments.length);
        }
      },
      error: (error) => {
        console.error('Error adding comment:', error);
      }
    });
  }

  confirmDeleteComment(commentId: string): void {
    const confirmDeletion = confirm('Are you sure you want to delete this comment?');
    
    if (confirmDeletion) {
      this.commentService.deleteComment(this.postId, commentId).subscribe({
        next: (response) => {
          if (response.success) {
            // Remove the comment from the comments array
            this.comments = this.comments.filter(comment => comment._id !== commentId);

            // Emit the new comment count
            this.commentEventService.emitCommentCountChange(this.postId, this.comments.length);
          } else {
            console.error('Failed to delete comment');
          }
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
        }
      });
    }
  }
}