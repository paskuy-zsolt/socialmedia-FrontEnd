import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../modules/post/post.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  // Fetch a single post by ID
  getPost(postId: string): Observable<{ post: Post }> {
    return this.http.get<{ post: Post }>(`${this.apiUrl}/post/${postId}`);
  }

  // Fetch posts for a specific user
  getUserPosts(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/post/user/${userId}`);
  }

  // Fetch the author of a post (this seems to be redundant, consider renaming or refactoring)
  getAuthorFromPost(userId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/post/user/${userId}`);
  }

  // Create a new post
  createPost(postData: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/post/create`, postData);
  }

  // Like a post
  likedPost(postId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/post/${postId}/like`, { userId });
  }

  // Delete post
  deletePost(postId: string) {
    return this.http.delete(`${this.apiUrl}/post/${postId}`);
  }

  // Update post
  updatePost(postId: string, updatedPost: { title: string; content: string; attachments?:string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/post/${postId}`, updatedPost);
  }
}