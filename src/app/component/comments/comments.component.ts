import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment, Post } from '../../modules/post/post.model';
import { User } from '../../modules/user/user.model';
import { CommentService } from '../../service/comment/comment.service';
import { TimePassedPipe } from '../../pipe/time/time-passed.pipe';
import { forkJoin, map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { CommentEventService } from '../../service/comment/event/comment-event.service';
import { GlobalLoaderComponent } from '../loader/global-loader/global-loader.component';
import { UserService } from '../../service/user/user.service';

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
  private userService = inject(UserService);  

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
              user: { userID: comment.user, name: '', email: '' },
              post: {} as Post
            }));
  
            // Create an array of observables to fetch user data for each comment
            const userFetchObservables = tempComments.map(comment =>
              this.commentService.getUserForComments(comment.user.userID).pipe(
                map(userData => {
                  comment.user.name = userData.name;
                  comment.user.email = userData.email;
            
                  // Fetch user profile separately
                  this.userService.getUserProfile(comment.user.userID).subscribe({
                    next: (profileData) => {
                      if (profileData) {
                        comment.user.avatar = profileData.userProfile.avatar;
                      }
                    },
                    error: (error) => console.error('Error fetching user profile:', error)
                  });
            
                  return comment;
                })
              )
            );
  
            // Use forkJoin to wait for all user fetch requests to complete
            forkJoin(userFetchObservables).subscribe({
              next: (updatedComments) => {
                this.comments = updatedComments;
                this.isLoading = false;
              },
              error: (err) => {
                console.error('Error fetching user data:', err);
                this.isLoading = false;
              }
            });
          } else {
            this.comments = [];
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
        if (response.success) {
          // Assuming the backend returns the full comment with user info
          const addedComment: Comment = {
            _id: response.comment._id,
            content: response.comment.content,
            createdAt: response.comment.createdAt,
            user: {
              userID: this.user!.userID,
              name: this.user!.name,
              avatar: this.user!.avatar || '' // Use an empty string as fallback
            },
            post: this.post
          };
        
          // If avatar is missing, fetch it
          if (addedComment.user.avatar === '') {
            this.userService.getUserProfile(newComment.userId).subscribe({
              next: (profileData) => {
                if (profileData && profileData.userProfile.avatar) {
                  addedComment.user.avatar = profileData.userProfile.avatar;
                  
                  // Trigger Angular's change detection to reflect the update
                  this.comments = [...this.comments]; // Create a new array reference to force re-render
                }
              },
              error: (error) => console.error('Error fetching user profile:', error)
            });
          }
          
          this.comments.push(addedComment);
          this.comment_value = '';
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