import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [
    trigger('toggleMenu', [
      state('hidden', style({ height: '0px', opacity: 0, visibility: 'hidden' })),
      state('visible', style({ height: '*', opacity: 1, visibility: 'visible' })),
      transition('hidden <=> visible', animate('300ms ease-in-out')),
    ]),
  ],
})
export class FooterComponent {
  menuStates: { [key: string]: 'hidden' | 'visible' } = {
    'menu-get-started': 'hidden',
    'menu-company': 'hidden',
    'menu-legal': 'hidden',
    'menu-quick-links': 'hidden',
  };

  isMobile: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 500;
    this.updateMenuStates();
  }

  ngOnInit() {
    this.isMobile = window.innerWidth < 500;
    this.updateMenuStates();
  }

  updateMenuStates() {
    if (this.isMobile) {
      Object.keys(this.menuStates).forEach((key) => {
        this.menuStates[key] = 'hidden';
      });
    } else {
      Object.keys(this.menuStates).forEach((key) => {
        this.menuStates[key] = 'visible';
      });
    }
  }

  toggleMenu(menuId: string) {
    if (this.isMobile) {
      this.menuStates[menuId] = this.menuStates[menuId] === 'hidden' ? 'visible' : 'hidden';
    }
  }
}