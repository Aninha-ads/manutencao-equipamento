import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LoginApiService, mensagemErroLogin } from './login-api.service';
import { SessaoStorageService } from './sessao-storage.service';

describe('LoginApiService', () => {
  let service: LoginApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(LoginApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('envia e-mail normalizado e guarda a sessão devolvida', () => {
    const resposta = { id: 1, nome: 'Ana Silva', email: 'ana@example.test', perfil: 'CLIENTE' };
    let recebido: unknown;
    service.entrar('  ANA@example.test ', '1234').subscribe((s) => (recebido = s));

    const req = http.expectOne('/api/sessao/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'ana@example.test', senha: '1234' });
    req.flush(resposta);

    expect(recebido).toEqual(resposta);
    expect(TestBed.inject(SessaoStorageService).obter()).toEqual(resposta as any);
  });

  it('não guarda sessão quando o login falha', () => {
    service.entrar('ana@example.test', 'errada').subscribe({ error: () => undefined });
    http.expectOne('/api/sessao/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(TestBed.inject(SessaoStorageService).obter()).toBeNull();
  });

  it('sair limpa a sessão', () => {
    const storage = TestBed.inject(SessaoStorageService);
    storage.salvar({ id: 1, nome: 'Ana', email: 'ana@example.test', perfil: 'CLIENTE' });
    service.sair();
    expect(storage.obter()).toBeNull();
  });
});

describe('mensagemErroLogin', () => {
  const erro = (status: number) => new HttpErrorResponse({ status });

  it('traduz os status da API', () => {
    expect(mensagemErroLogin(erro(401))).toContain('inválidos');
    expect(mensagemErroLogin(erro(403))).toContain('desativada');
    expect(mensagemErroLogin(erro(400))).toContain('e-mail válido');
    expect(mensagemErroLogin(erro(0))).toContain('conectar');
    expect(mensagemErroLogin(new Error('x'))).toContain('inesperado');
  });
});
