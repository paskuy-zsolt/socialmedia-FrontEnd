import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SuccessMessageService } from '../../../service/message/success/success-message.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [SuccessMessageService]
})

export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string | undefined;
  messageError: string = '';
  countdown: number = 3;
  submitted: boolean = false;
  tokenValid: boolean = true;

  showPassword = faEye;
  hidePassword = faEyeSlash;
  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private successMessageService: SuccessMessageService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]),
      repeat_password: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.token = params['token'].replace(/^:/, '');
      console.log(this.token);
    });
  } 

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('repeat_password')?.value;

    if (pass !== confirmPass) {
      group.get('repeat_password')?.setErrors({ notSame: true });
      return { notSame: true };
    } else {
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
      this.http.post(`https://connect-hub.eu/reset-password/:${this.token}`, { token: this.token, password }).subscribe((response: any) => {
        this.messageError = '';
        this.successMessageService.showSuccessMessage();
  
        setTimeout(() => {
          this.startCountdown();
        }, 1000);
      },
      (error) => {
          if (error.status === 400) {
            this.messageError = 'Invalid or expired token.';
            this.tokenValid = false;
          } else if (error.status === 422) {
            this.messageError = 'Password too short.';
          } else {
            this.messageError = 'An unexpected error occurred.';
          }
        }
      );
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
      if (this.passwordVisible) {
        password['type'] = "text";
      } else {
        password['type'] = "password";
      }
    }
  }

  repeatPasswordState() {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
    const repeatPassword = document.getElementById('repeat_password') as HTMLFormElement;

    if (repeatPassword) {
      if (this.repeatPasswordVisible) {
        repeatPassword['type'] = "text";
      } else {
        repeatPassword['type'] = "password";
      }
    }
  }
}