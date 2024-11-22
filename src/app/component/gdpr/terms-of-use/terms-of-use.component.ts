import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './terms-of-use.component.html',
  styleUrl: './terms-of-use.component.css'
})
export class TermsOfUseComponent implements OnInit {

  private router = inject(Router);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        
        if (tree.fragment) {
          this.scrollToFragment(tree.fragment);
        }
      });
  }

  private scrollToFragment(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.scrollY;
      const middlePosition =
        absoluteElementTop - window.innerHeight / 2 + elementRect.height / 2;

      window.scrollTo({
        top: middlePosition,
        behavior: 'smooth',
      });

      this.renderer.addClass(element, 'highlight');

      setTimeout(() => {
        this.renderer.addClass(element, 'highlight-remove');
      }, 1500);

      setTimeout(() => {
        this.renderer.removeClass(element, 'highlight');
        this.renderer.removeClass(element, 'highlight-remove');
      }, 2500);
    }
  }
}