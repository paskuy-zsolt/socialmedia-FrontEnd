import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../service/user/user.service';
import { AuthService } from '../../../../service/auth/auth.service';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { SuccessMessageService } from '../../../../service/message/success/success-message.service';
import { FileValidators } from '../../../../validators/file-validators';

@Component({
  selector: 'app-user-profile-update',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxIntlTelInputModule],
  templateUrl: './user-profile-update.component.html',
  styleUrls: ['./user-profile-update.component.css'],
  providers: [SuccessMessageService]
})
export class UserProfileUpdateComponent implements OnInit {
  profileForm!: FormGroup;
  selectedFile: File | undefined | null = null;
  isLoading: boolean = false;
  countdown: number = 3;
  errorMessage: string = '';
  currentAvatarUrl: string | null = null;
  showMagnifier: boolean = false;
  magnifierPosition = { x: 0, y: 0 };
  magnifierBackgroundPosition = '0px 0px';

  private userService = inject(UserService);
  private authService = inject(AuthService);
  private successMessageService = inject(SuccessMessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  
  ngOnInit() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Initialize the form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.pattern(emailRegex)]],
      username: ['', [Validators.maxLength(50)]],
      phone: ['', Validators.max(15)],
      avatar: ['', [FileValidators.fileType(['image/jpeg', 'image/png', 'image/gif']), FileValidators.maxSize(2 * 1024 * 1024)]],
      description: ['', [Validators.maxLength(500)]]
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (currentUser?.userID) {
          this.userService.getUserDetails(currentUser.userID).subscribe({
            next: (response) => {
              if (response.success && response.user) {
                const userId = response.user._id;
                if (typeof userId === 'string') {

                  this.userService.getUserProfile(userId).subscribe({
                    next: (profile) => {
                      if (profile && profile.userProfile) {
                        this.profileForm.patchValue({
                          name: profile.userProfile.name,
                          email: profile.userProfile.email,
                          username: profile.userProfile.username,
                          phone: profile.userProfile.phone,
                          description: profile.userProfile.description
                        });

                        if (profile.userProfile.avatar) {
                          this.currentAvatarUrl = profile.userProfile.avatar;
                        }

                      } else {
                        // If profile doesn't exist, create a new one with the user details
                        this.profileForm.patchValue({
                          name: response.user.name,
                          email: response.user.email,
                          username: response.user.username,
                          phone: response.user.phone,
                          description: response.user.description || ''
                        });
                      }
                    },
                    error: (error) => {
                      // If getUserProfile fails, fallback to user details
                      console.error('Error loading user profile:', error);
                      this.profileForm.patchValue({
                        name: response.user.name,
                        email: response.user.email,
                        username: response.user.username,
                        phone: response.user.phone,
                        description: response.user.description || ''
                      });
                    }
                  });
                } else {
                  console.error('User ID is undefined or invalid.');
                  this.errorMessage = 'Invalid user ID.';
                }
              } else {
                this.errorMessage = 'User details not found.';
              }
              this.isLoading = false;
            },
            error: () => {
              this.errorMessage = 'Failed to load profile details.';
              this.isLoading = false;
            }
          });
        } else {
          this.errorMessage = 'Invalid user session.';
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Failed to authenticate user.';
        this.isLoading = false;
      }
    });
  }

  onMouseMove(event: MouseEvent) {
    if (!this.currentAvatarUrl) return;

    if (this.selectedFile) {
      const imgElement = event.target as HTMLImageElement;
      const rect = imgElement.getBoundingClientRect();

      // Calculate the cursor position relative to the image
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Update the magnifier position
      this.magnifierPosition = { x: event.clientX + 10, y: event.clientY + 10 }; // Offset to avoid overlapping the cursor

      // Calculate the background position for the zoom effect
      const backgroundX = (x / imgElement.width) * 100;
      const backgroundY = (y / imgElement.height) * 100;
      this.magnifierBackgroundPosition = `${backgroundX}% ${backgroundY}%`;
    } else {
      this.showMagnifier = false;
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.profileForm.patchValue({ avatar: file });
      this.profileForm.get('avatar')?.updateValueAndValidity();

      this.selectedFile = file;
      
      // Use FileReader to read the file and update the currentAvatarUrl
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentAvatarUrl = e.target.result; // Set the data URL as the new avatar URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      // If no file is selected, reset the currentAvatarUrl to the original avatar URL
      this.currentAvatarUrl = this.profileForm.value.avatar || null;
    }
  }

  deleteAvatar(): void {
    // Reset the avatar-related properties
    this.currentAvatarUrl = null;
    this.selectedFile = null;
  
    // Reset the avatar form control
    this.profileForm.patchValue({ avatar: null });
    this.profileForm.get('avatar')?.updateValueAndValidity();
  
    // Optionally, you can also clear the file input value
    const fileInput = document.getElementById('avatar') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  clearField(fieldName: string): void {
    const control = this.profileForm.get(fieldName);
    if (control) {
      console.log(control);
      control.setValue('');
      control.updateValueAndValidity();
    }
  }  

  updateProfile() {
    if (this.profileForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const phoneNumber = this.profileForm.value.phone ? this.profileForm.value.phone.e164Number : '';

    // Create FormData instance to handle file upload and other form fields
    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);

    if (this.profileForm.value.username) {
      formData.append('username', this.profileForm.value.username);
    } else {
      formData.append('username', '');
    }
    if (this.profileForm.value.phone) {
      formData.append('phone', phoneNumber);
    } else {
      formData.append('phone', '');
    }
    if (this.profileForm.value.description) {
      formData.append('description', this.profileForm.value.description);
    } else {
      formData.append('description', '');
    }
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    } else {
      formData.append('avatar', '');
    }

    // formData.forEach((value, key) => {
    //   console.log(key, value);
    // });
    
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        if (currentUser?.userID) {
          this.userService.updateUserProfile(currentUser.userID, formData).subscribe({
            next: () => {
                this.successMessageService.showSuccessMessage();
                this.startCountdown();
            },
            error: (error) => {
              console.error('Error updating profile:', error);
              this.errorMessage = 'Failed to update profile.';
              this.isLoading = false;  
            }
          });
        } else {
          this.errorMessage = 'Invalid user session.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.errorMessage = 'Failed to fetch current user.';
        this.isLoading = false;
      }
    });
  }

  cancelUpdate() {
    ViewEncapsulation.Emulated;
    this.router.navigate(['/profile']);
  }

  private startCountdown(): void {
    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(intervalId);

        ViewEncapsulation.Emulated;
        this.router.navigate(['/profile']);
      }
    }, 1000);
  }

  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }
  get username() { return this.profileForm.get('username'); }
  get phone() { return this.profileForm.get('phone'); }
  get description() { return this.profileForm.get('description'); }
  get avatar() { return this.profileForm.get('avatar'); }
}