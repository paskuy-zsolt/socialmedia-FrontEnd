import { Component, ChangeDetectionStrategy } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../../service/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-initial-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './initial-loader.component.html',
  styleUrl: './initial-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialLoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loading$.pipe(
      map((loading) => loading['initialLoader'])
    );
  }
}

