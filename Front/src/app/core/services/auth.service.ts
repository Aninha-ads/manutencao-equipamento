import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export type Perfil = 'CLIENTE' | 'FUNCIONARIO';

export interface Sessao {
  token: string;
  perfil: Perfil;
  nome: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _sessao = signal<Sessao | null>(null);
  readonly sessao = this._sessao.asReadonly();

  login(email: string, senha: string) {
    return this.http
      .post<Sessao>('/api/auth/login', { email, senha })
      .pipe(
        tap((sessao) => {
          this._sessao.set(sessao);
          localStorage.setItem('token', sessao.token);
        })
      );
  }

  logout() {
    this._sessao.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get perfil(): Perfil | null {
    return this._sessao()?.perfil ?? null;
  }

  get autenticado(): boolean {
    return !!this._sessao();
  }
}