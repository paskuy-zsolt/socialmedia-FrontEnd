import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { SuccessMessageService } from '../../service/message/success/success-message.service';
@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.css',
  providers: [SuccessMessageService]
})
export class DocumentationComponent {

  exitIcon = faPersonWalkingArrowRight;

  private successMessageService = inject(SuccessMessageService);

  historyBack(): void {
    window.history.back();
  }

  copyText(event: MouseEvent): void {
    // Get the parent element (button's parent, which is a div with class "code")
    const parentElement = (event.target as HTMLElement).parentElement;

    // Find the input or textarea inside the parent div
    const inputElement = parentElement?.querySelector('input, textarea') as HTMLInputElement | HTMLTextAreaElement;

    if (inputElement) {
      navigator.clipboard.writeText(inputElement.value).then(() => {
        this.successMessageService.showSuccessMessage();
        setTimeout(() => { this.successMessageService.hideSuccessMessage(); }, 3000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  }

  scrollTo(subtitleId: string) {
    const element = document.getElementById(subtitleId);

    if (element) {
      // Smooth scrolling behavior
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
