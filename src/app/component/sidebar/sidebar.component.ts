import { Component, HostListener, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartLine, faUserFriends, faChevronDown, faChevronUp, faFileCirclePlus, faUser, faUserEdit, faGear } from '@fortawesome/free-solid-svg-icons';
import { JwtDecoderService } from '../../service/jwt-decoder/jwt-decoder.service';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../modules/user/user.model';
import { TogglePostService } from '../../service/share-service/toggle-post.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [FontAwesomeModule, RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements OnInit {

  // FontAwesome icons for navigation and UI elements
  feed = faChartLine;
  users = faUserFriends;
  profile = faUser;
  settings = faGear;
  editUser = faUserEdit;
  createPost = faFileCirclePlus;
  chevronUp = faChevronUp;
  chevronDown = faChevronDown;  

  // Variables for user authentication and data
  userId: string | null = null;
  currentUser: User | null = null;

  isFeedMenuOpen: boolean = false;
  isScrolled: boolean = false;

  // Injecting necessary services for various functionalities
  private jwtDecoderService = inject(JwtDecoderService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private togglePostService = inject(TogglePostService);

  ngOnInit(): void {
    
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      const decodedToken = this.jwtDecoderService.decodeToken(authToken);
      this.userId = decodedToken?.userID || null;

      this.authService.getCurrentUser().subscribe({
        next: (user: User | null) => {
          this.currentUser = user;
          this.userId = this.currentUser?.userID || decodedToken?.userID || null;
        },
        error: err => console.error("Failed to fetch current user:", err)
      });

      // Fetch user details if userId is defined
      if (this.userId) {
        this.fetchUserDetails(this.userId);
      }
      
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.isFeedMenuOpen = this.router.url === '/feed'; // Update feed menu open state
        }
      });
    }
  }

  fetchUserDetails(userId: string): void {
    this.userService.getUserDetails(userId).subscribe({
      next: (data: { success: boolean; user: User }) => {
        if (data.success) {
          this.currentUser = data.user;
        } else {
          console.error('Failed to fetch user details.');
        }
      },
      error: err => console.error('Error fetching user details:', err)
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 217;
  }
  
  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  toggleCreatePost(): void {
    this.togglePostService.toggleCreatePost();
  }
}