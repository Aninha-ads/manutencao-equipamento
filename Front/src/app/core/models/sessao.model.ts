export type PerfilSessao = 'CLIENTE' | 'FUNCIONARIO';

/** Resposta de POST /api/sessao/login. */
export interface SessaoUsuario {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilSessao;
}

export interface LoginRequest {
  email: string;
  senha: string;
}
