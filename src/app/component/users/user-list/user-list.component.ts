import { Component, Input, OnInit, inject } from '@angular/core';
import { UserService } from '../../../service/user/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoaderService } from '../../../service/loader/loader.service';
import { User, userProfile, UserResponse } from '../../../modules/user/user.model';
import { UsersLoaderComponent } from '../../loader/users-loader/users-loader.component';
import { AuthService } from '../../../service/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UsersLoaderComponent, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];
  filteredUsers: User[] = [];

  currentUser: User | null = null;
  error: string | null = null;
  loading: boolean = true;
  searchTerm: string = '';
  
  // FontAwesome icons for navigation and UI elements
  search = faMagnifyingGlass;

  private userService = inject(UserService);
  private loaderService = inject(LoaderService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.loaderService.show('usersLoader');

    this.loadCurrentUser(() => {
      this.loadUsers();
    });
  }

  private loadCurrentUser(callback: () => void): void {
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      this.authService.getCurrentUser().subscribe({
        next: (user: User | null) => {
          this.currentUser = user;
          // console.log('Current user:', this.currentUser);
          callback();
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          callback();
        },
      });
    } else {
      console.error('No valid authentication token.');
      return
    }
  }

  // Load all users and filter
  private loadUsers(): void {

    if (!this.currentUser) {
      this.error = 'You must be logged in to view users.';
      this.loaderService.hide('usersLoader');
      this.loading = false;
      return;
    }

    this.userService.getUsers().subscribe({
      next: (data: UserResponse) => {
        if (data.success) {
          this.users = data.users;
      
          this.users.forEach(user => {
            this.userService.getUserProfile(user._id!).subscribe({
              next: (data: { userProfile: userProfile }) => {
                user.avatar = data.userProfile.avatar
              },
              error: (error) => {
                console.error('Error fetching user details:', error);
              }
            });
          })

          this.filterUsers();
        } else {
          this.error = 'Failed to fetch users. Please try again later.';
        }
        this.loading = false;
        this.loaderService.hide('usersLoader');
      },
      error: (error) => {
        this.error = 'Error fetching users.';
        this.loading = false;
        this.loaderService.hide('usersLoader');
        console.error('Error fetching users:', error);
      },
    });
  }

  // Filter out the current user
  private filterUsers(): void {
    if (this.currentUser) {
      this.filteredUsers = this.users
        .filter((user: User) => user._id !== this.currentUser!.userID)
        .filter((user: User) => user.name) // Ensure name is defined
        .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0)); // Sort safely
    }
  }

  onSearchChange(): void {
    this.filteredUsers = this.users
    .filter((user: User) => 
      user._id !== this.currentUser!.userID &&
      user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) // Optional chaining
    )
    .filter((user: User) => user.name) // Ensure name is defined
    .sort((a, b) => (a.name && b.name ? a.name.localeCompare(b.name) : 0)); // Sort safely
  }
}