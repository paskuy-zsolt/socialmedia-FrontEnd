import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticatedInterceptor } from './interceptor/authenticated/authenticated.interceptor';
import { loaderInterceptor } from './interceptor/loader/loader.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authenticatedInterceptor,
        loaderInterceptor
      ])
    ),
  ]
};