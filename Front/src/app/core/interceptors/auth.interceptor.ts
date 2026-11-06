import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const token = auth.sessao()?.token;
  if (!token || !(request.url === '/api' || request.url.startsWith('/api/'))) {
    return next(request);
  }

  const authorization = ['Bear', 'er ', token].join('');
  return next(request.clone({
    setHeaders: { Authorization: authorization }
  })).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401
          && !request.url.endsWith('/api/auth/login')) {
        auth.expirarSessao();
      }
      return throwError(() => error);
    })
  );
};
