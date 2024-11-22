import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../../service/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-loader.component.html',
  styleUrl: './users-loader.component.css'
})
export class UsersLoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loading$.pipe(
      map((loading) => loading['usersLoader'])
    );
  }
}