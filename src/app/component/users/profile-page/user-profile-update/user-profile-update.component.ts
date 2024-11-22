import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-profile-update',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './user-profile-update.component.html',
  styleUrl: './user-profile-update.component.css'
})
export class UserProfileUpdateComponent {
  
  icon_save = faCheck;

  updateProfile() {
    // this.route.navigate(['/profile']);
  }

}
