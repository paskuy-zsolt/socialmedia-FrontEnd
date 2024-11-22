import { Injectable } from '@angular/core';
import { User } from '../../modules/user/user.model';

@Injectable({
  providedIn: 'root'
})

export class JwtDecoderService {

  public decodeToken(token: string): User | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g,  '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return  '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decoding failed', error);
      return null;
    }
  }
}