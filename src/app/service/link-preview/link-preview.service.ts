import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LinkPreviewService {
  private apiUrl = 'https://api.linkpreview.net/';
  private linkpreview_key = "b64a8cbc384b1d3d817f6a0c7d9ff7ef";

  private http = inject(HttpClient)

  fetchPreview(url: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?key=${this.linkpreview_key}&q=${encodeURIComponent(url)}`)
  }
}