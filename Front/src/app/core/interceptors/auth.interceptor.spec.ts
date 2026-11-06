import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../services/auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpTestingController;
  const expirarSessao = vi.fn();

  beforeEach(() => {
    expirarSessao.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { sessao: () => ({ token: 'token-invalido' }), expirarSessao }
        }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('limpa a sessão e redireciona quando a API rejeita o token', () => {
    TestBed.inject(HttpClient)
      .get('/api/dados')
      .subscribe({ error: () => undefined });

    const request = http.expectOne('/api/dados');
    expect(request.request.headers.has('Authorization')).toBe(true);
    request.flush({ message: 'Sessão inválida.' }, { status: 401, statusText: 'Unauthorized' });

    expect(expirarSessao).toHaveBeenCalledOnce();
  });

  it('não encerra a sessão quando o login retorna credenciais inválidas', () => {
    TestBed.inject(HttpClient)
      .post('/api/auth/login', {})
      .subscribe({ error: () => undefined });

    http.expectOne('/api/auth/login')
      .flush({ message: 'Credenciais inválidas.' }, { status: 401, statusText: 'Unauthorized' });

    expect(expirarSessao).not.toHaveBeenCalled();
  });
});
