import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../../modules/user/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = "https://connect-hub.eu/";

  private http = inject(HttpClient);

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users`);
  }

  getUserDetails(userId: string): Observable<{ success: boolean; user: User }> {
    return this.http.get<{ success: boolean; user: User }>(`${this.apiUrl}/user/${userId}`);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/sign-up`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }, { observe: 'response' });
  }

  logout(): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/user/logout`, { observe: 'response' });
  }

  delete(userId: string) {
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }

  recoverPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email });
  }
}