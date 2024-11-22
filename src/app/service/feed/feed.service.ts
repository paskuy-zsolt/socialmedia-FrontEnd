import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PostsResponse } from '../../modules/post/post.model';


@Injectable({
  providedIn: 'root'
})

export class FeedService {

  private http = inject(HttpClient);

  getPosts(page: number, limit: number = 10): Observable<PostsResponse> {
    return this.http.get<PostsResponse>(`https://connect-hub.eu/feed?page=${page}&limit=${limit}`);
  }
}