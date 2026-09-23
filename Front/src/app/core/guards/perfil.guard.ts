import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Perfil } from '../services/auth.service';

export const perfilGuard = (perfilEsperado: Perfil): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.autenticado) {
      return router.createUrlTree(['/login']);
    }

    if (auth.perfil !== perfilEsperado) {
      return router.createUrlTree(['/login']);
    }

    return true;
  };
};