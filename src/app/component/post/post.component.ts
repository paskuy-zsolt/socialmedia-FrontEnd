import { Component, inject, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimePassedPipe } from '../../pipe/time/time-passed.pipe';
import { LinkifyPipe } from '../../pipe/linkify/linkify.pipe';
import { CommentsComponent } from '../comments/comments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { PostService } from '../../service/post/post.service';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Post } from '../../modules/post/post.model';
import { User, userProfile } from '../../modules/user/user.model';
import { LikeService } from '../../service/like/like.service';
import { Subscription } from 'rxjs';
import { CommentEventService } from '../../service/comment/event/comment-event.service';
import { LinkPreviewService } from '../../service/link-preview/link-preview.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [LinkifyPipe, FontAwesomeModule, TimePassedPipe, CommentsComponent, CommonModule, RouterLink, RouterModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit, OnDestroy {

  // Component state
  usersLiked: User[] = [];
  commentsCount: number = 0;

  private commentCountSubscription: Subscription | null = null;

  // UI flags
  showUsersLiked: boolean = false;
  isLiked: boolean = false;
  showComments: boolean = false;
  showLikedMessage: boolean = false;
  showFullContent: boolean = false;

  // Icons
  closeIcon = faCircleXmark;

  // Service injections
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private likeService = inject(LikeService);
  private commentEventService = inject(CommentEventService);
  private linkPreviewService = inject(LinkPreviewService);

  // Input properties
  @Input() post: Post = {} as Post;
  currentUser: User | null = null;
  linkPreviews: { [key: string]: any } = {};

  // Lifecycle hook
  ngOnInit() {
    if (!this.post || !this.post._id) {
      this.fetchPostDetails();
    } else {
      this.userDetails();
    }
  
    // Subscribe to comment count and initialize like status
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.initializeLikeStatus();
    });

    // Subscribe to the comment count changes
    this.commentCountSubscription = this.commentEventService.commentCountChanged$.subscribe(
      ({ postId, newCount }) => {
        if (this.post._id === postId) {
          this.post.comments.length = newCount;
        }
      }
    );

    if (this.post?.content) {
      this.extractLinks(this.post.content);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.commentCountSubscription) {
      this.commentCountSubscription.unsubscribe();
    }
  }

  // Fetch post details if the post is not fully populated
  private fetchPostDetails(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.postService.getPost(postId).subscribe({
        next: (data: { post: Post }) => {
          this.post = data.post;

          if (this.post?.authorId) {
            this.userDetails();
          }
          
          this.initializeLikeStatus();
        },
        error: (error) => {
          console.error('Error fetching post:', error);
        }
      });
    }
  }
  
  private userDetails(): void {    
    const userId = this.post?.authorId;

    if (!userId) {
      return;
    }

    this.userService.getUserProfile(userId).subscribe({
      next: (data: { userProfile: userProfile }) => {
        this.post.authorName = data.userProfile.name
        this.post.authorPicture = data.userProfile.avatar
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }


  // Like status initialization
  private initializeLikeStatus(): void {
    if (this.post.likes && this.currentUser?.userID) {
      this.isLiked = this.post.likes.includes(this.currentUser.userID);
    }
  }

  getExcerpt(content: string | undefined): string {

    if (!content) {
      return '';
    }

    return content.length > 350 ? content.substring(0, 350) + '' : content;
  }

  toggleContentVisibility(): void {
    this.showFullContent = !this.showFullContent;
  }

  fetchUsersLiked(): void {
    this.usersLiked = []; // Reset before fetching
    if (this.post?.likes?.length) {
      this.post.likes.forEach((userId: string) => {
        this.userService.getUserDetails(userId).subscribe({
          next: (data: { user: User }) => {
            if (data?.user) {
              const fetchedUser = {
                userID: data.user._id || 'Unknown ID',
                name: data.user.name || 'Anonymous',
                email: data.user.email || 'No Email Provided'
              };
              this.usersLiked.push(fetchedUser);
            }
          },
          error: (error: any) => {
            console.error('Error fetching user details:', error);
          }
        });
      });
    }
  }

  // Toggle the display of users who liked the post
  toggleUsersLiked(show: boolean): void {
    if (show) {
      this.fetchUsersLiked();
    }
    this.showUsersLiked = show;
  }

  toggleLike(): void {
    if (this.currentUser) {
      this.likeService.toggleLike(this.post, this.currentUser);

      this.isLiked = !this.isLiked;
      this.showLikedMessage = true;
      
      setTimeout(() => { this.showLikedMessage = false; }, 1500);
    } else {
      console.error('User must be logged in to like posts');
    }
  }

  // Toggle comments visibility
  toggleComments(): void {
    this.showComments = !this.showComments;
  }

  // Get CSS class for comments button
  getCommentsButtonClass(): string {
    return this.showComments ? 'comments open' : 'comments';
  }

  get previewKeys(): string[] {
    return Object.keys(this.linkPreviews || {});
  }

  extractLinks(content: string | undefined) {
    if (!content) {
      return;
    }

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex) || [];

    urls.forEach(url => {
      this.linkPreviewService.fetchPreview(url).subscribe({
        next: (preview) => {
          if (preview) {
            this.linkPreviews = { ...this.linkPreviews, [url]: preview };
          }
        },
        error: (err) => console.error('Error fetching preview:', err)
      });
    });
  }
}