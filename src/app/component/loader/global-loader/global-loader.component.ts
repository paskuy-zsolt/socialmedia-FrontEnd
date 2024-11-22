import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../../service/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.css'
})

export class GlobalLoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loading$.pipe(
      map((loading) => loading['globalLoader'])
    );
  }
}