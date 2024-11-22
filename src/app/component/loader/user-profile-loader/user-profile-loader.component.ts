import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LoaderService } from '../../../service/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile-loader.component.html',
  styleUrl: './user-profile-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileLoaderComponent {
  isLoading$: Observable<boolean>;

  constructor(private loaderService: LoaderService) {
    this.isLoading$ = this.loaderService.loading$.pipe(
      map((loading) => loading['userProfileLoader'])
    );
  }
}