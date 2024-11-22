import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../service/auth/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup;
  emailError: string = '';
  passwordError: string = '';
  messageError: string = '';
  submitted: boolean = false;
  
  showPassword = faEye;
  hidePassword = faEyeSlash;
  passwordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      password: new FormControl('', [Validators.required]),
    })
  }

  getEmailErrorMessage() {
    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return 'Email is required';
    } else if (control?.hasError('email')) {
      return 'Not a valid email';
    } else if (control?.hasError('pattern')) {
      return 'Email format is invalid';
    }
    return '';
  }
  
  getPasswordErrorMessage() {
    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return 'Password is required';
    } else if (control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Password cannot be more than 120 characters long';
    }
    return '';
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.valid) {
      this.emailError = '';
      this.passwordError = '';

      const { email, password } = this.loginForm.value;

      this.userService.login( email, password ).subscribe((res) => {        
        const token = res.headers.get('Authorization');
        const expires = res.headers.get('Expires');

        if (token) {
          this.authService.setAuthToken(token, expires);
        }

        this.router.navigateByUrl("/feed");
      },
      (error) => {
          if (error.status === 404) {
              this.emailError = "Email doesn't exist.";
          } else if (error.status === 401) {
              this.passwordError = 'Incorrect password.';
          } else {
              console.error('Error logging in:', error);
          }
      });
    } else {
      this.messageError = `Note: "<em>Please fill out all required fields correctly.</em>"`;
    }
  }

  passwordState() {
    this.passwordVisible = !this.passwordVisible;
    const password = document.getElementById('password') as HTMLFormElement;

    if (password) {
      if (this.passwordVisible) {
        password['type'] = "text";
      } else {
        password['type'] = "password";
      }
    }
  }
}