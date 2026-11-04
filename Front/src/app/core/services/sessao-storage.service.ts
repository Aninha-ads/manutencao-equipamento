import { Injectable } from '@angular/core';
import { SessaoUsuario } from '../models/sessao.model';

const CHAVE = 'sessaoUsuario';

/** Guarda o usuário logado no sessionStorage (some ao fechar a aba). Não guarda senha. */
@Injectable({ providedIn: 'root' })
export class SessaoStorageService {
  salvar(sessao: SessaoUsuario): void {
    sessionStorage.setItem(CHAVE, JSON.stringify(sessao));
  }

  obter(): SessaoUsuario | null {
    try {
      const bruto = sessionStorage.getItem(CHAVE);
      if (!bruto) return null;
      const s = JSON.parse(bruto);
      const valida =
        s && typeof s.id === 'number' && typeof s.email === 'string' &&
        (s.perfil === 'CLIENTE' || s.perfil === 'FUNCIONARIO');
      return valida ? (s as SessaoUsuario) : null;
    } catch {
      return null; // JSON corrompido = sem sessão
    }
  }

  limpar(): void {
    sessionStorage.removeItem(CHAVE);
  }

  get autenticado(): boolean {
    return this.obter() !== null;
  }
}
