import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../../modules/user/user.model';
import { UserService } from '../../../../service/user/user.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { SuccessMessageService } from '../../../../service/message/success/success-message.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
  providers: [SuccessMessageService]
})
export class UserSettingsComponent implements OnInit {

  currentUser: User | null = null;
  emailError: string | null = null;
  success: string | null = null;

  recoverPasswordForm: FormGroup;
  countdown: number = 3;
  
  showMailSentMessage: boolean = false;
  showAccountDeletedMessage: boolean = false;

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private successMessageService = inject(SuccessMessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  constructor() {
    // Initialize the form for password recovery
    this.recoverPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  ngOnInit(): void {
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      this.authService.getCurrentUser().subscribe({
        next: (user: User | null) => {
          if (user) {
            this.currentUser = user;
          } else {
            console.error('No current user found.');
          }
        },
        error: (error) => console.error('Error fetching user details:', error)
      });
    } else {
      console.error('No valid authentication token.');
    }

    this.recoverPasswordForm.get('email')?.valueChanges.subscribe(() => {
      this.emailError = null;
    });
  }

  onRecover() {
    const email = this.recoverPasswordForm.value.email;

    // Check if form is valid
    if (!this.recoverPasswordForm.valid) {
      this.emailError = 'Please enter a valid email address.';
      return;
    }

    // Check if email matches current user's email
    if (this.currentUser && email !== this.currentUser.email) {
      this.emailError = 'The address entered does not match your current email. Please enter your correct email.';
      return;
    }

    this.userService.recoverPassword(email).subscribe({
      next: () => {
        this.emailError = null;
        this.recoverPasswordForm.reset();
        this.success = `Mail Sent Successfully! <br>Please check your inbox.</div>`;
      },
      error: error => {
        console.error('Error sending password reset email:', error);
        this.emailError = 'Failed to send reset link. Please try again later.';
      }
    });
  }

  deleteUser(): void {
    if (this.currentUser) {
      const confirmed = window.confirm('Are you sure you want to delete your account? This action is irreversible.');

      if (confirmed) {
        this.userService.delete(this.currentUser.userID).subscribe({
          next: () => {
            this.successMessageService.showSuccessMessage();
            this.startCountdown();
          },
          error: (error) => console.error('Error deleting user:', error)
        });
      }
    } else {
      console.error('User data is not loaded.');
    }
  }

  private startCountdown(): void {
    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(intervalId);

        this.authService.clearAuthToken();
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }
}