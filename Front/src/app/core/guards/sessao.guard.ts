import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PerfilSessao } from '../models/sessao.model';
import { SessaoStorageService } from '../services/sessao-storage.service';
import { rotaInicial } from '../utils/rota-por-perfil';

/**
 * Protege rotas por perfil. Uso: { path: '...', canActivate: [sessaoGuard('CLIENTE')] }
 * - sem sessão: vai para /login
 * - perfil errado: volta para a página inicial do próprio perfil
 */
export const sessaoGuard = (perfilEsperado: PerfilSessao): CanActivateFn => {
  return () => {
    const sessao = inject(SessaoStorageService).obter();
    const router = inject(Router);

    if (!sessao) {
      return router.createUrlTree(['/login']);
    }
    if (sessao.perfil !== perfilEsperado) {
      return router.createUrlTree([rotaInicial(sessao.perfil)]);
    }
    return true;
  };
};
