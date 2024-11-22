import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

function getRouter(): Router {
  return inject(Router);
}

function getAuthService(): AuthService {
  return inject(AuthService);
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = getRouter();
  const authService = getAuthService();

  if (authService.isAuthToken()) {
    return true;
  } else {
    router.navigate(["/login"]);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const router = getRouter();
  const authService = getAuthService();

  if (!authService.isAuthToken()) {
    return true;
  } else {
    router.navigate(["/feed"]);
    return false;
  }
};
