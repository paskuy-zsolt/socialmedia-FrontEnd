import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { LoaderService } from './service/loader/loader.service';
import { InitialLoaderComponent } from './component/loader/initial-loader/initial-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InitialLoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private loaderService = inject(LoaderService);
  private router = inject(Router);
  
  // Array of routes to skip the loader
  private skipRoutes = ['/login', '/sign-up', '/reset-password', '/expired-session'];
  
  // Flag to indicate if the loader has been shown
  private loaderShown = false;  

  ngOnInit(): void {
    this.scrollUpOnNavigate();
    this.showLoader();
  }

  private async showLoader() {
    const currentRoute = this.router.url;

    // Show the global loader only if it hasn't been shown yet and the current route is not in skipRoutes
    if (!this.loaderShown && !this.skipRoutes.includes(currentRoute) && !currentRoute.includes('not-found')) {
      this.loaderService.show('initialLoader');
      await this.initializeApp();
    }
  }

  private async initializeApp() {
    // Fetch initial data
    await this.fetchInitialData();
    this.fadeOutLoader();
  }

  private fetchInitialData(): Promise<void> {
    return new Promise(resolve => {
      // Simulate a delay for loading
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  private fadeOutLoader() {
    const loaderContainer = document.querySelector('.initial-loader');
    
    if (loaderContainer) {
      loaderContainer.classList.add('hidden');
      setTimeout(() => {
        this.loaderService.hide('initialLoader');
      }, 500);
    }
    
    this.loaderShown = true;
  }



  scrollUpOnNavigate(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to the top of the page
      }
    });
  }
}
