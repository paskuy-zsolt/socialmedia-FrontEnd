import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { FeedService } from '../../service/feed/feed.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../service/post/post.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TimePassedPipe } from '../../pipe/time-passed.pipe';
import { PostComponent } from '../post/post.component';
import { JwtDecoderService } from '../../service/jwt-decoder/jwt-decoder.service';
import { AuthService } from '../../service/auth/auth.service';
import { Post, PostsResponse } from '../../modules/post/post.model';
import { LoaderService } from '../../service/loader/loader.service';
import { User } from '../../modules/user/user.model';
import { TogglePostService } from '../../service/share-service/toggle-post.service';
import { CreatePostComponent } from '../post/create-post/create-post.component';
import { PostLoaderComponent } from '../loader/post-loader/post-loader.component';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, TimePassedPipe, PostComponent, PostLoaderComponent, CreatePostComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})


export class FeedComponent implements OnInit {

  currentPage: number = 1;
  limit: number = 10;

  loading: boolean = false;
  allPostsLoaded: boolean = false;
  isCreatePostVisible: boolean = false;

  user: User | null = null;

  private feedService = inject(FeedService);
  private postService = inject(PostService);
  private jwtDecoderService = inject(JwtDecoderService);
  private authService = inject(AuthService);
  private loaderService = inject(LoaderService);
  private togglePostService = inject(TogglePostService);

  // Input properties
  @Input() posts: Post[] = [];

  ngOnInit(): void {

    this.loaderService.show('postLoader');
    this.initializeUser();
    this.loadPosts();
    
    // Subscribe to the toggle event from the service
    this.togglePostService.isCreatePostVisible$.subscribe(visible => {
      this.isCreatePostVisible = visible;
    });
  }

  private initializeUser(): void {
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      const decodedToken = this.jwtDecoderService.decodeToken(authToken);
      
      // Ensure decodedToken is not null before accessing userID
      if (decodedToken && decodedToken.userID) {
        this.user = { userID: decodedToken.userID } as User;
      } else {
        this.user = null;
        return
      }
    };
  }

  loadPosts(): void {
    if (this.loading || this.allPostsLoaded) return;
  
    this.loading = true;
    this.feedService.getPosts(this.currentPage, this.limit).subscribe({
      next: (response: PostsResponse) => {
        this.handlePostResponse(response);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
        this.loaderService.hide('postLoader');
      }
    });
  }

  private handlePostResponse(response: PostsResponse): void {
    const newPosts: Post[] = response.posts;

    // Check if we've reached the total number of pages
    if (this.currentPage >= response.totalPages) {
        this.allPostsLoaded = true; // No more posts to load
    }

    // Always push new posts if they exist
    if (newPosts.length > 0) {
        this.posts = [...this.posts, ...newPosts];
        this.currentPage++; // Increment the page after fetching posts

        this.extractAuthorIds(newPosts); // Fetch authors for new posts
      } else {
        console.log('No new posts available in this request.');
    }

    this.loading = false;
    this.loaderService.hide('postLoader');
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Calculate the threshold for loading more posts
    const threshold = 500; // 500 pixels from the bottom
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - threshold);
  
    // Check if we're near the bottom of the page and not currently loading or have all posts loaded
    if (nearBottom && !this.loading && !this.allPostsLoaded) {
      this.loadPosts();
    }
  }

  private extractAuthorIds(posts: Post[]): void {
    posts.forEach(post => {
      this.postService.getAuthorFromPost(post.authorId).subscribe({
        next: (data: any) => {
          post.authorName = data.post.name;
        },
        error: (error) => {
          console.log('Error fetching authors:', error);
        }
      });
    });
  }
}