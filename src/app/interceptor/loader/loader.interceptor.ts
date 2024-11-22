import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../../service/animation/loader/loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {

  const loaderService = inject(LoaderService);
  loaderService.show();
  return next(req).pipe(finalize(() => loaderService.hide()));
};