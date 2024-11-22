import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { SuccessMessageService } from '../../service/message/success/success-message.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [SuccessMessageService]
})

export class SignUpComponent implements OnInit {
  
  signUpForm: FormGroup;
  emailError: string = '';
  messageError: string = '';
  countdown: number = 3;
  submitted: boolean = false;
  years: number[] = [];
  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' },
  ];
  days: number[] = [];

  showPassword = faEye;
  hidePassword = faEyeSlash;
  passwordVisible: boolean = false;
  repeatPasswordVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private successMessageService: SuccessMessageService
  ) {
    this.signUpForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(120)]),
      repeat_password: new FormControl('', [Validators.required]),
      year: new FormControl('', [Validators.required]),
      month: new FormControl('', [Validators.required]),
      day: new FormControl('', [Validators.required])
    }, { validators: [this.checkPasswords.bind(this), this.checkAge.bind(this)] });
  }

  ngOnInit() {
    this.populateYears();
    this.populateDays();
    this.signUpForm.get('month')?.valueChanges.subscribe(() => this.populateDays());
    this.signUpForm.get('year')?.valueChanges.subscribe(() => this.populateDays());
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  populateDays() {
    const month = this.signUpForm.get('month')?.value;
    const year = this.signUpForm.get('year')?.value;
    const daysInMonth = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
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

  checkAge(group: FormGroup) {
    const year = group.get('year');
    const month = group.get('month');
    const day = group.get('day');
  
    if (!year?.value || !month?.value || !day?.value) {
      if (!year?.value) year?.setErrors({ dateNotSelected: true });
      if (!month?.value) month?.setErrors({ dateNotSelected: true });
      if (!day?.value) day?.setErrors({ dateNotSelected: true });
      return { dateNotSelected: true };
    }
  
    const selectedDate = new Date(year.value, month.value - 1, day.value);
    const currentDate = new Date();
  
    const ageDiffYears = currentDate.getFullYear() - selectedDate.getFullYear();
    const ageDiffMonths = currentDate.getMonth() - selectedDate.getMonth();
    const ageDiffDays = currentDate.getDate() - selectedDate.getDate();
  
    if (ageDiffYears < 16 || (ageDiffYears === 16 && (ageDiffMonths < 0 || (ageDiffMonths === 0 && ageDiffDays < 0)))) {
      if (ageDiffYears < 16) year?.setErrors({ underage: true });
      if (ageDiffYears === 16 && ageDiffMonths < 0) month?.setErrors({ underage: true });
      if (ageDiffYears === 16 && ageDiffMonths === 0 && ageDiffDays < 0) day?.setErrors({ underage: true });
      return { underage: true };
    }
  
    return null;
  }

  getUsernameErrorMessage() {
    const control = this.signUpForm.get('name');
    if (control?.hasError('required')) {
      return 'Username is required';
    } else if (control?.hasError('minlength')) {
      return 'Username must be at least 3 characters long';
    } else if (control?.hasError('maxlength')) {
      return 'Username cannot be more than 200 characters long';
    }
    return '';
  }

  getEmailErrorMessage() {
    const control = this.signUpForm.get('email');
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
    const control = this.signUpForm.get('password');
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
    const control = this.signUpForm.get('repeat_password');
    if (control?.hasError('required')) {
      return 'Confirm password is required';
    } else if (control?.hasError('notSame')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getDateErrorMessage() {
    const yearControl = this.signUpForm.get('year');
    const monthControl = this.signUpForm.get('month');
    const dayControl = this.signUpForm.get('day');

    if (yearControl?.hasError('underage') || monthControl?.hasError('underage') || dayControl?.hasError('underage')) {
      return 'You must be at least 16 years old to sign up';
    }

    if (yearControl?.hasError('dateNotSelected') || monthControl?.hasError('dateNotSelected') || dayControl?.hasError('dateNotSelected')) {
      return 'Please select a date of birth';
    }
    
    return '';
  }

  onSignUp() {
    this.submitted = true;

    if (this.signUpForm.invalid) {
      this.messageError = `Note: "<em>Please fill out all required fields correctly.</em>"`;
      return;
    }

    this.userService.signup(this.signUpForm.value).subscribe(
      (response) => {
        this.successMessageService.showSuccessMessage();
        setTimeout(() => {
          this.startCountdown();
        }, 1000);
      },
      (error) => {
        if (error.status === 409) {
          this.emailError = 'Email already exists.';
        } else {
          this.emailError = 'An error occurred during sign-up. Please try again later.';
          console.error('Error signing up:', error);
        }
      }
    );
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