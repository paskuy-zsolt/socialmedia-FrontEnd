import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  show() {
    this.loadingSubject.next(true);
  }

  hide() {
    this.loadingSubject.next(false);
  }

  isLoading(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  setLoadingState(loading: boolean) {
    this.loadingSubject.next(loading);
  }
}
