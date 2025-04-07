import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../service/auth/auth.service';
import { UserService } from '../../service/user/user.service';
import { User } from '../../modules/user/user.model';
import { SidebarService } from '../../service/sidebar/sidebar.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  
  currentUser: User | null = null;
  
  leave = faDoorOpen;

  public authService = inject(AuthService);
  public userService = inject(UserService);
  public sidebarService = inject(SidebarService);
  
  currentUser$ = this.authService.getCurrentUser();

  ngOnInit(): void {
    // Fetch current user details when the component initializes
    this.authService.getCurrentUser().subscribe(user => {

      this.currentUser = user;

      if (user && user.userID) {
        this.fetchUserDetails(user.userID);
      }
    });
  }

  // Fetch user details by user ID
  private fetchUserDetails(userId: string): void {
    this.userService.getUserDetails(userId).subscribe({
      next: (data: { success: boolean; user: User }) => {
        if (data.success && data.user) {
          if (this.currentUser) {
            this.currentUser.name = data.user.name;
          }
        } else {
          console.error('Failed to fetch user details');
        }
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      }
    });
  }

  onLogout() {
    this.userService.logout().subscribe(() => {
      this.authService.clearAuthToken();
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }
}