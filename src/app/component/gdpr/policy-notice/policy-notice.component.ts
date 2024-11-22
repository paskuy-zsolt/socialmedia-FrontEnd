import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-policy-notice',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './policy-notice.component.html',
  styleUrl: './policy-notice.component.css'
})

export class PolicyNoticeComponent implements OnInit {

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