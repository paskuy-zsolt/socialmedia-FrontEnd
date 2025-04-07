import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SuccessMessageService } from '../../../service/message/success/success-message.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css'],
  providers: [SuccessMessageService],
})

export class RecoverPasswordComponent {
  recoverPasswordForm = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
  });

  private httpClient = inject(HttpClient);
  private successMessageService = inject(SuccessMessageService);

  emailError = '';

  onRecover() {
    if (this.recoverPasswordForm.valid) {
      const email = this.recoverPasswordForm.get('email')?.value;

      this.httpClient.post('http://localhost:3000/reset-password', { email }).subscribe({
        next: () => {
          this.emailError = '';
          this.successMessageService.showSuccessMessage();
        },
        error: (error) => {
          if (error.status === 404) {
            this.emailError = 'The provided email address is not associated with any account.';
          } else {
            this.emailError = 'An error occurred while resetting your password. Please try again later.';
          }
        },
      });
    } else {
      this.recoverPasswordForm.get('email')?.markAsTouched();
      this.emailError = 'Please enter a valid email.';
    }
  }
}