import { TestBed } from '@angular/core/testing';
import { SessaoStorageService } from './sessao-storage.service';
import { SessaoUsuario } from '../models/sessao.model';

describe('SessaoStorageService', () => {
  const sessao: SessaoUsuario = { id: 1, nome: 'Ana Silva', email: 'ana@example.test', perfil: 'CLIENTE' };
  let service: SessaoStorageService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessaoStorageService);
  });

  it('começa sem sessão', () => {
    expect(service.obter()).toBeNull();
    expect(service.autenticado).toBe(false);
  });

  it('salva e recupera a sessão', () => {
    service.salvar(sessao);
    expect(service.obter()).toEqual(sessao);
    expect(service.autenticado).toBe(true);
  });

  it('limpar remove a sessão', () => {
    service.salvar(sessao);
    service.limpar();
    expect(service.obter()).toBeNull();
  });

  it('ignora conteúdo corrompido ou com perfil inválido', () => {
    sessionStorage.setItem('sessaoUsuario', '{nao-e-json');
    expect(service.obter()).toBeNull();
    sessionStorage.setItem('sessaoUsuario', JSON.stringify({ ...sessao, perfil: 'ADMIN' }));
    expect(service.obter()).toBeNull();
  });
});
