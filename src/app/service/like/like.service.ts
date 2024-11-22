import { inject, Injectable } from '@angular/core';
import { User } from '../../modules/user/user.model';
import { Post } from '../../modules/post/post.model';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class LikeService {

  public isLiked = false;
  public usersLiked: User[] = [];

  // Service injections
  private postService = inject(PostService);
  private userService = inject(UserService);

  // Toggle like/unlike status
  toggleLike(post: Post, currentUser: User): void {

    if (!post?._id || !currentUser?.userID) {
      console.error('Post or User data is incomplete');
      return;
    }

    // Check if the post is already liked by the user
    this.isLiked = post.likes?.includes(currentUser.userID) ?? false;

    // Call the like/unlike service method
    this.postService.likedPost(post._id, currentUser.userID).subscribe({
      next: () => {
        this.handleLikeResponse(post, currentUser.userID);
      },
      error: (error: any) => {
        console.error(this.isLiked ? 'Error unliking post:' : 'Error liking post:', error);
      }
    });
  }

  // Handle the like/unlike response and update UI
  private handleLikeResponse(post: Post, userId: string): void {
    if (this.isLiked) {
      this.unlikePost(post, userId);
    } else {
      this.likePost(post, userId);
    }
    this.isLiked = !this.isLiked; // Toggle the like status
  }

  // Unlike post logic
  private unlikePost(post: Post, userId: string): void {
    post.likes = post.likes?.filter(id => id !== userId) || [];
    this.usersLiked = this.usersLiked.filter(user => user.userID !== userId);
    post.likesCount = Math.max((post.likesCount || 0) - 1, 0); // Ensure likesCount doesn't go below 0
  }

  // Like post logic
  private likePost(post: Post, userId: string): void {
    post.likes = post.likes || [];
    post.likes.push(userId);

    // Fetch user details of the current liker and update `usersLiked`
    this.userService.getUserDetails(userId).subscribe({
      next: (data: { user: User }) => {
        if (data?.user) {
          // Make sure to check the properties are defined
          this.usersLiked.push({
            userID: data.user.userID,
            name: data.user.name,
            email: data.user.email
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching user details:', error);
      }
    });

    post.likesCount += 1;
  }
}
