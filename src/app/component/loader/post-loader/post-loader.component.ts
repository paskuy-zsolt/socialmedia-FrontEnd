import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../../service/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-loader.component.html',
  styleUrl: './post-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PostLoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loading$.pipe(
      map((loading) => loading['postLoader'])
    );
  }
}