import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { SessaoStorageService } from '../services/sessao-storage.service';
import { sessaoGuard } from './sessao.guard';

describe('sessaoGuard', () => {
  let storage: SessaoStorageService;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    storage = TestBed.inject(SessaoStorageService);
    router = TestBed.inject(Router);
  });

  const executar = (perfil: 'CLIENTE' | 'FUNCIONARIO') =>
    TestBed.runInInjectionContext(() => sessaoGuard(perfil)({} as any, {} as any));

  const destino = (r: unknown) => router.serializeUrl(r as UrlTree);

  it('sem sessão redireciona para /login', () => {
    expect(destino(executar('CLIENTE'))).toBe('/login');
  });

  it('perfil correto libera a rota', () => {
    storage.salvar({ id: 1, nome: 'Ana', email: 'ana@example.test', perfil: 'CLIENTE' });
    expect(executar('CLIENTE')).toBe(true);
  });

  it('cliente tentando rota de funcionário volta ao próprio painel', () => {
    storage.salvar({ id: 1, nome: 'Ana', email: 'ana@example.test', perfil: 'CLIENTE' });
    expect(destino(executar('FUNCIONARIO'))).toBe('/painel-cliente');
  });

  it('funcionário tentando rota de cliente volta ao próprio painel', () => {
    storage.salvar({ id: 5, nome: 'Maria', email: 'maria@example.test', perfil: 'FUNCIONARIO' });
    expect(destino(executar('CLIENTE'))).toBe('/painel-funcionario');
  });
});
