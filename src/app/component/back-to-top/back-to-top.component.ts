import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faDotCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-back-to-top',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './back-to-top.component.html',
  styleUrl: './back-to-top.component.css'
})

export class BackToTopComponent implements OnInit{
  dot = faDotCircle;
  arrowUp = faArrowUp;

  ngOnInit(): void {
    document.addEventListener("DOMContentLoaded", () => {
      const backToTop = document.getElementById("back-to-top-button") as HTMLElement;
      const amountScrolled = 300;
    
      if (backToTop) {
        window.addEventListener("scroll", () => {
          if (window.scrollY >= amountScrolled) {
            backToTop.style.display = "block"; // Show element
          } else {
            backToTop.style.display = "none"; // Hide element
          }
        });

        window.addEventListener("scroll", () => {
          const scrollPosition = window.innerHeight + window.scrollY;
          const pageHeight = document.documentElement.scrollHeight;
  
          if (pageHeight - scrollPosition <= 60) {
            backToTop.classList.add("bottom");
          } else {
            backToTop.classList.remove("bottom");
          }
        });
    
        backToTop.addEventListener("click", (event) => {
          event.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      }
    });
  }    
}
