import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsResponse } from '../../modules/post/post.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})

export class FeedService {

  private apiUrl = environment.apiUrl;

  private http = inject(HttpClient);
  
  getPosts(page: number, limit: number = 10): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`${this.apiUrl}/feed?page=${page}&limit=${limit}`);
  }
}