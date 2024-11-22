import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

const skipInterceptionRoutes = ['/sign-up', '/reset-password', '/expired-session'];

export const authenticatedInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // console.log(`Requesting ${req.url}`);
  
  const token = authService.getAuthToken();
  const shouldSkipInterception = skipInterceptionRoutes.some(route => req.url.includes(route));

  if (!shouldSkipInterception && authService.isAuthToken() && !authService.isExpiredToken()) {

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq)
  } else if (!shouldSkipInterception && authService.isAuthToken() && authService.isExpiredToken()) {
    console.warn("Token expired, clearing auth data.");
    authService.clearAuthToken();
  }
  
  return next(req);
}