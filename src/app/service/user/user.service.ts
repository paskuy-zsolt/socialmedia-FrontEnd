import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfileResponse, UserResponse } from '../../modules/user/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private apiUrl = "https://www.connect-hub.eu";

  private http = inject(HttpClient);

  getUsers(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users`);
  }

  getUserDetails(userId: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/user/${userId}`)
  }

  getUserProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/profile`);
  }

  updateUserProfile(userId: string, formData: FormData): Observable<UserProfileResponse> {
    const headers = new HttpHeaders();
    return this.http.patch<UserProfileResponse>(`${this.apiUrl}/user/${userId}/update-profile`, formData, { headers });
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