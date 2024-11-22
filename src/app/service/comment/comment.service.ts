import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../modules/user/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getCommentsForPost(postId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/post/${postId}/comments`);
  }
  
  getUserForComments(userId: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/user/${userId}`).pipe(
      map(response => response.user)
  )}

  addComment(postId: string, userId: string, content: string) {
    return this.http.post(`${this.apiUrl}/post/${postId}/comment/add`, { 
      userId, 
      content 
    });
  }

  deleteComment(postId: string, commentId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/post/${postId}/comment/${commentId}`);
  }
}
