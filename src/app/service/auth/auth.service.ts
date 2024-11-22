import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtDecoderService } from '../jwt-decoder/jwt-decoder.service';
import { User } from '../../modules/user/user.model';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private router = inject(Router);
  private jwtDecoderService = inject(JwtDecoderService);

  constructor() {
    // Initialize user from token on service creation
    const token = this.getAuthToken();

    if (token) this.decodeToken(token);
  }

  setAuthToken(token: string, expires: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expires', expires);

    this.decodeToken(token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  getExpiresToken(): string | null {
    return localStorage.getItem('expires');
  }

  isAuthToken(): boolean {
    return !!this.getAuthToken();
  }

  isExpiredToken(): boolean {
    const expiresString = this.getExpiresToken();

    if (!expiresString) return true;

    const expires = new Date(expiresString);
    const currentDate = new Date();

    return expires <= currentDate;
  }

  clearAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');

    this.currentUserSubject.next(null);

    this.router.navigateByUrl('/expired-session').catch(err => console.error('Navigation error:', err));
  }

  private decodeToken(token: string): void {
    try {
      const decodedUser = this.jwtDecoderService.decodeToken(token) as User;

      this.currentUserSubject.next(decodedUser);
    } catch (error) {
      console.error('Invalid token', error);
      
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
}