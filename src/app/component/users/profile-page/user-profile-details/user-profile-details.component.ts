import { Component, OnInit, OnDestroy, inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBorderAll, faBookmark, faImage, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of, Subscription } from 'rxjs';
import { Post } from '../../../../modules/post/post.model';
import { User } from '../../../../modules/user/user.model';
import { UserProfileLoaderComponent } from '../../../loader/user-profile-loader/user-profile-loader.component';
import { LoaderService } from '../../../../service/loader/loader.service';
import { GlobalLoaderComponent } from '../../../loader/global-loader/global-loader.component';
import { UserService } from '../../../../service/user/user.service';
import { PostService } from '../../../../service/post/post.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { SuccessMessageService } from '../../../../service/message/success/success-message.service';

@Component({
  selector: 'app-user-profile-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, UserProfileLoaderComponent, GlobalLoaderComponent, FormsModule, RouterLink],
  templateUrl: './user-profile-details.component.html',
  styleUrl: './user-profile-details.component.css',
  providers: [SuccessMessageService]
})
export class UserProfileDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('updatePostSection') updatePostSection!: ElementRef;

  icon_posts = faBorderAll;
  icon_saved = faBookmark;
  icon_image = faImage;
  icon_edit = faPencil;
  icon_trash = faTrash;

  user!: User;
  posts: Post[] = [];
  savedItems: any[] = [];

  userLoaded: boolean = false;
  postsLoaded: boolean = false;
  savedItemsLoaded: boolean = false;
  isCurrentUserProfile: boolean = false;

  currentPage: number = 1;
  postsPerPage: number = 6;
  savedItemsPerPage: number = 6;

  // Track selected post to edit
  selectedPost: { _id: string; title: string; content: string } | null = null;

  // Map for countdowns for each post
  countdowns: Map<string, number> = new Map<string, number>();

  // Deletion timers for cleanup
  deletionTimers: Map<string, ReturnType<typeof setInterval>> = new Map<string, ReturnType<typeof setInterval>>();

  fallbackImage: string = 'https://connect-hub-images.s3.eu-central-1.amazonaws.com/profile/blank_user.jpg';

  selectedCategory: string = 'posts';

  successPostIds: Set<string> = new Set();

  private userId: string | null = null;
  private routeSub!: Subscription;

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private postService = inject(PostService);
  private loaderService = inject(LoaderService);
  private authService = inject(AuthService);
  private successMessageService = inject(SuccessMessageService);

  ngOnInit() {

    this.loaderService.show('userProfileLoader');
    this.loaderService.show('globalLoader');

    // Listen for route changes
    this.routeSub = this.route.paramMap.subscribe(params => {
      const newUserId = params.get('id');

      if (!newUserId) {
        this.isCurrentUserProfile = true;
        this.loadCurrentUserProfile();
      } else {
        this.isCurrentUserProfile = false;
        this.userId = newUserId; 
        this.loadUserProfile(newUserId);
      }
    });
  }

  private loadCurrentUserProfile(): void {
    // Get the current user ID from the token (AuthService)
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (currentUser && currentUser.userID) {
          this.userId = currentUser.userID;
          this.userService.getUserDetails(this.userId).subscribe({
            next: (userData) => {
              if (userData.success) {
                this.user = userData.user;
                this.userLoaded = true;
                this.fetchPosts(this.user.posts || []);
              }
            },
            error: (error) => {
              console.error('Error fetching current user details:', error);
              this.userLoaded = true;
            },
            complete: () => {
              this.loaderService.hide('userProfileLoader');
            },
          });
        } else {
          console.error('No current user found!');
        }
      },
      error: (error) => {
        console.error('Error fetching current user details:', error);
        this.loaderService.hide('userProfileLoader');
      },
    });
  }

  private loadUserProfile(userId: string): void {
    this.user = {} as User;
    this.posts = [];
    this.userLoaded = false;
    this.postsLoaded = false;

    // Fetch user details for another user
    this.userService.getUserDetails(userId).subscribe({
      next: (userData) => {
        if (userData.success) {
          this.user = userData.user;
          this.userLoaded = true;
          this.fetchPosts(this.user.posts || []);
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.userLoaded = true;
      },
      complete: () => {
        this.loaderService.hide('userProfileLoader');
      },
    });
  }

  private fetchPosts(postIds: string[]): void {
    if (!postIds || postIds.length === 0) {
      this.postsLoaded = true;
      return;
    }

    this.loaderService.show('globalLoader');

    const fetchPostObservables = postIds.map(postId =>
      this.postService.getPost(postId).pipe(
        catchError(error => {
          console.error('Error fetching post:', error);
          return of(null);
        })
      )
    );

    forkJoin(fetchPostObservables).subscribe({
      next: (postDataArray) => {
        this.posts = postDataArray
          .filter((postData) => postData !== null)
          .map((postData) => postData ? postData.post : null)
          .filter((post) => post !== null) as Post[];

        this.postsLoaded = true;
      },
      error: (error) => {
        console.error('Error fetching posts:', error);
        this.postsLoaded = true;
      },
      complete: () => {
        this.loaderService.hide('globalLoader');
      }
    });
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getPagesArray(): number[] {
    const totalItems = this.selectedCategory === 'posts' ? this.posts.length : this.savedItems.length;
    const pageCount = Math.ceil(totalItems / (this.selectedCategory === 'posts' ? this.postsPerPage : this.savedItemsPerPage));
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  deletePost(postId: string): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }
  
    const postElement = document.getElementById(postId);
  
    if (postElement) {
      const titleElement = postElement.querySelector('.title');
      const actionsElement = postElement.querySelector('.actions');
  
      if (titleElement) {
        titleElement.classList.add('hide');
      }
  
      if (actionsElement) {
        actionsElement.classList.add('hide');
      }

      this.countdowns.set(postId, 3);
      this.successPostIds.add(postId);
  
      this.successMessageService.ShowMultipleSuccessMessages(postId);

      // Start countdown for deletion
      this.startCountdown(postId);
    }
  }

  private startCountdown(postId: string): void {
    const intervalId = setInterval(() => {
      const currentCountdown = this.countdowns.get(postId) ?? 0;
      if (currentCountdown > 0) {
        this.countdowns.set(postId, currentCountdown - 1);
      } else {
        clearInterval(intervalId);
        this.deletionTimers.delete(postId);
        this.deletePostAfterCountdown(postId);
      }
    }, 1000);
  
    // Store the timer ID for cleanup if needed
    this.deletionTimers.set(postId, intervalId);
  }

  private deletePostAfterCountdown(postId: string): void {
    this.postService.deletePost(postId).subscribe({
        next: () => {
            // Remove the post from the list
            this.posts = this.posts.filter(post => post._id !== postId);

            // Clear countdown and success state for this post
            this.countdowns.delete(postId);

            // Remove post ID from successPostIds to hide success message
            this.successPostIds.delete(postId);

            if (this.successPostIds.size === 0) {
              this.successMessageService.hideSuccessMessage();
            }
        },
        error: (error) => {
            console.error(`Error deleting post ${postId}:`, error);

            // Show actions and title again if deletion fails
            const postElement = document.getElementById(postId);
            if (postElement) {
                const titleElement = postElement.querySelector('.title');
                const actionsElement = postElement.querySelector('.actions');

                if (titleElement) {
                    titleElement.classList.remove('hide');
                }

                if (actionsElement) {
                    actionsElement.classList.remove('hide');
                }
            }

            // Clean up state
            this.countdowns.delete(postId);
            this.deletionTimers.delete(postId);
        }
    });
  }

  openUpdatePost(post: { _id: string; title: string; content: string }): void {
    this.selectedPost = { ...post }; // Create a copy to avoid two-way binding issues
  }

  submitUpdatedPost(): void {
    if (this.selectedPost) {
      const updatedPost = {
        title: this.selectedPost.title,
        content: this.selectedPost.content,
      };
  
      // Call service to update post
      this.postService.updatePost(this.selectedPost._id, updatedPost).subscribe({
        next: (response) => {
          if (response.success) {
            // Update the post in the UI
            const index = this.posts.findIndex(post => post._id === this.selectedPost?._id);
            if (index !== -1) {
              this.posts[index] = { ...this.posts[index], ...updatedPost };
            }
  
            // Clear selected post and close form
            this.selectedPost = null;
          }
        },
        error: (error) => {
          console.error('Error updating post:', error);
        },
      });
    }
  }
  
  cancelUpdate(): void {
    this.selectedPost = null;
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }
}