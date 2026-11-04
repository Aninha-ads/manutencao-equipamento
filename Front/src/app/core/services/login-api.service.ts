import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessaoUsuario } from '../models/sessao.model';
import { SessaoStorageService } from './sessao-storage.service';

/** Converte o erro HTTP do login em uma mensagem amigável para a tela. */
export function mensagemErroLogin(erro: unknown): string {
  const status = erro instanceof HttpErrorResponse ? erro.status : -1;
  switch (status) {
    case 0:
      return 'Não foi possível conectar ao servidor.';
    case 400:
      return 'Informe um e-mail válido e a senha.';
    case 401:
      return 'E-mail ou senha inválidos.';
    case 403:
      return 'Conta desativada ou sem perfil de acesso.';
    default:
      return 'Erro inesperado ao fazer login. Tente novamente.';
  }
}

/** Login (RF002) integrado ao back-end: POST /api/sessao/login. */
@Injectable({ providedIn: 'root' })
export class LoginApiService {
  private http = inject(HttpClient);
  private storage = inject(SessaoStorageService);
  private readonly url = `${environment.apiUrl}/sessao/login`;

  entrar(email: string, senha: string): Observable<SessaoUsuario> {
    return this.http
      .post<SessaoUsuario>(this.url, { email: email.trim().toLowerCase(), senha })
      .pipe(tap((sessao) => this.storage.salvar(sessao)));
  }

  sair(): void {
    this.storage.limpar();
  }
}
