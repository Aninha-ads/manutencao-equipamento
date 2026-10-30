import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { DadosService } from './dados.service';
import { FuncionarioTela } from '../models/dados-tela.model';

export type Perfil = 'CLIENTE' | 'FUNCIONARIO';

export interface Sessao {
  id: number;
  email: string;
  token: string;
  perfil: Perfil;
  nome: string;
  expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dados = inject(DadosService);

  private _sessao = signal<Sessao | null>(this.carregarSessaoSalva());
  readonly sessao = this._sessao.asReadonly();

  login(email: string, senha: string): Observable<Sessao> {
    return this.http
      .post<Sessao>('/api/auth/login', { email, senha })
      .pipe(
        tap(sessao => this.salvarSessao(sessao)),
        switchMap(sessao => from(this.dados.carregar()).pipe(map(() => sessao))),
        catchError(erro => {
          this.limparSessao();
          return throwError(() => erro);
        })
      );
  }

  registrarCliente(dados: object): Observable<Sessao> {
    return this.carregarSessao(this.http.post<Sessao>('/api/clientes', dados));
  }

  registrarFuncionario(dados: object): Observable<FuncionarioTela> {
    return this.http.post<FuncionarioTela>('/api/funcionarios', dados);
  }

  private carregarSessao(requisicao: Observable<Sessao>): Observable<Sessao> {
    return requisicao.pipe(
      tap(sessao => this.salvarSessao(sessao)),
      switchMap(sessao => from(this.dados.carregar()).pipe(map(() => sessao))),
      catchError(erro => {
        this.limparSessao();
        return throwError(() => erro);
      })
    );
  }

  logout(): Observable<void> {
    const token = this._sessao()?.token;
    const request = token
      ? this.http.post<void>('/api/auth/logout', {}, {
          headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
        })
      : of<void>(undefined);
    return request.pipe(finalize(() => {
      this.limparSessao();
      void this.router.navigate(['/login']);
    }));
  }

  private salvarSessao(sessao: Sessao): void {
    this._sessao.set(sessao);
    localStorage.setItem('sessao', JSON.stringify(sessao));
  }

  private limparSessao(): void {
    this._sessao.set(null);
    localStorage.removeItem('sessao');
  }

  private carregarSessaoSalva(): Sessao | null {
    const salva = localStorage.getItem('sessao');
    if (!salva) {
      return null;
    }
    try {
      const sessao = JSON.parse(salva) as Sessao;
      if (!sessao.token || !sessao.id || !sessao.perfil || !sessao.expiresAt
          || Date.parse(sessao.expiresAt) <= Date.now()) {
        localStorage.removeItem('sessao');
        return null;
      }
      return sessao;
    } catch {
      localStorage.removeItem('sessao');
      return null;
    }
  }

  get perfil(): Perfil | null {
    return this._sessao()?.perfil ?? null;
  }

  get id(): number | null {
    return this._sessao()?.id ?? null;
  }

  get autenticado(): boolean {
    return !!this._sessao();
  }
}
