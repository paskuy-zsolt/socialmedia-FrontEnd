import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LoaderService {
  private loadingSubject = new BehaviorSubject<{ [key: string]: boolean }>({
    initialLoader: false,
    globalLoader: false,
    postLoader: false,
    commentLoader: false,
    userLoader: false,
    usersLoader: false,
    userProfileLoader: false
  });

  loading$ = this.loadingSubject.asObservable();

  show(loaderName: string) {
    this.updateLoaderState(loaderName, true);
  }

  hide(loaderName: string) {
    this.updateLoaderState(loaderName, false);
  }

  private updateLoaderState(loaderName: string, state: boolean) {
    this.loadingSubject.next({
      ...this.loadingSubject.getValue(),
      [loaderName]: state,
    });
  }
}