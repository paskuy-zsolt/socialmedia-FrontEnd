import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentEventService {

  private commentCountChangedSource = new Subject<{ postId: string, newCount: number }>();

  // Observable to subscribe to
  commentCountChanged$ = this.commentCountChangedSource.asObservable();

  // Method to emit the new comment count
  emitCommentCountChange(postId: string, newCount: number): void {
    this.commentCountChangedSource.next({ postId, newCount });
  }
}
