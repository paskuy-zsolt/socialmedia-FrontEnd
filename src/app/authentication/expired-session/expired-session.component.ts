import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-expired-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './expired-session.component.html',
  styleUrl: './expired-session.component.css'
})
export class ExpiredSessionComponent {
  
  countdown: number = 3;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.startCountdown();
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
}
