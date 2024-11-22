import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../../modules/user/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getCommentsForPost(postId: string): Observable<any> {
    return this.http.get(`https://connect-hub.eu/post/${postId}/comments`);
  }
  
  getUserForComments(userId: string): Observable<User> {
    return this.http.get<{ user: User }>(`https://connect-hub.eu/user/${userId}`).pipe(
      map(response => response.user)
  )}

  addComment(postId: string, userId: string, content: string) {
    return this.http.post(`https://connect-hub.eu/post/${postId}/comment/add`, { 
      userId, 
      content 
    });
  }

  deleteComment(postId: string, commentId: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`https://connect-hub.eu/post/${postId}/comment/${commentId}`);
  }
}
