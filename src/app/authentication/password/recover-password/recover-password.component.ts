import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SuccessMessageService } from '../../../service/message/success/success-message.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  providers: [SuccessMessageService]
})

export class RecoverPasswordComponent {

  recoverPasswordForm: FormGroup;
  emailError: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private successMessageService: SuccessMessageService
  ) {
    
    this.recoverPasswordForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    });
  }

  httpCLient = inject(HttpClient);
  data: any[] = [];

  onRecover() {
    const email = this.recoverPasswordForm.get('email')?.value;

    if (email) {

      if (this.recoverPasswordForm.valid) {

        this.httpCLient.post('https://connect-hub.eu/reset-password', { email }).subscribe(
          (data: any) => {
            this.data = data;
            this.emailError = '';
            this.successMessageService.showSuccessMessage();
          },
          error => {
            if (error.status === 404) {
              this.emailError = "The provided email address is not associated with any account.";
            } else {
              this.emailError = "An error occurred while resetting your password. Please try again later.";
            }
          }
        );
      } else {
          this.recoverPasswordForm.get('email')?.markAsTouched();
          this.emailError = 'Please enter a valid email.';
      }
    } else {
        this.emailError = 'Please provide an email address.';
    }
  }
}