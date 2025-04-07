import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SuccessMessageService } from '../../../service/message/success/success-message.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [SuccessMessageService],
})

export class ResetPasswordComponent implements OnInit {

  resetPasswordForm = inject(FormBuilder).group(
    {
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]],
      repeat_password: ['', [Validators.required]],
    },
    { validators: this.checkPasswords }
  );

  private httpClient = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private successMessageService = inject(SuccessMessageService);
  
  token: string | undefined;
  messageError: string = '';
  countdown: number = 3;
  submitted: boolean = false;
  tokenValid: boolean = true;

  showPassword = faEye;
  hidePassword = faEyeSlash;
  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;

  ngOnInit() {
    this.token = this.route.snapshot.params['token']?.replace(/^:/, '');
  } 

  checkPasswords(group: any) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('repeat_password')?.value;

    if (pass !== confirmPass) {
      group.get('repeat_password')?.setErrors({ notSame: true });
      return { notSame: true };
    } else {
      group.get('repeat_password')?.setErrors(null);
      return null;
    }
  }

  getPasswordErrorMessage() {
    const control = this.resetPasswordForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Password cannot be more than 120 characters long';
    }
    return '';
  }

  getRepeatPasswordErrorMessage() {
    const control = this.resetPasswordForm.get('repeat_password');
    if (control?.hasError('required')) {
      return 'Confirm password is required';
    } else if (control?.hasError('notSame')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onReset() {
    this.submitted = true;
    if (this.resetPasswordForm.valid) {
      const { password } = this.resetPasswordForm.value;

      this.httpClient
        .post(`https://connect-hub.eu/reset-password/:${this.token}`, { token: this.token, password })
        .subscribe({
          next: () => {
            this.messageError = '';
            this.successMessageService.showSuccessMessage();
            setTimeout(() => this.startCountdown(), 1000);
          },
          error: (error) => {
            if (error.status === 400) {
            this.messageError = 'Invalid or expired token.';
            this.tokenValid = false;
          } else if (error.status === 422) {
            this.messageError = 'Password too short.';
          } else {
            this.messageError = 'An unexpected error occurred.';
          }
        }
      });
    } else {
      this.messageError = 'Please enter valid passwords.';
    }
  }

  startCountdown() {
    const intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(intervalId);
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }

  passwordState() {
    this.passwordVisible = !this.passwordVisible;
    const password = document.getElementById('password') as HTMLFormElement;

    if (password) {
      password['type'] = this.passwordVisible ? "text" : "password";
    }
  }

  repeatPasswordState() {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
    const repeatPassword = document.getElementById('repeat_password') as HTMLFormElement;

    if (repeatPassword) {
      repeatPassword['type'] = this.passwordVisible ? "text" : "password";
    }
  }
}