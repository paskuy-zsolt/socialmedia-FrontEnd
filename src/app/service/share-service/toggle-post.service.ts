import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TogglePostService {
  private visibilitySource = new BehaviorSubject<boolean>(false);
  isCreatePostVisible$ = this.visibilitySource.asObservable();

  toggleCreatePost() {
    // Toggle the visibility state
    this.visibilitySource.next(!this.visibilitySource.getValue());
  }
  
  showForm() {
    this.visibilitySource.next(true);
  }
}