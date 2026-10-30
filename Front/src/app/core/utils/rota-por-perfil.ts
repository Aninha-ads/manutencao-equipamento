import { PerfilSessao } from '../models/sessao.model';

const ROTA_INICIAL: Record<PerfilSessao, string> = {
  CLIENTE: '/painel-cliente',       // RF003
  FUNCIONARIO: '/painel-funcionario', // RF011
};

/** Rota da página inicial de cada perfil, usada logo após o login. */
export function rotaInicial(perfil: PerfilSessao | null | undefined): string {
  return perfil ? ROTA_INICIAL[perfil] ?? '/login' : '/login';
}
