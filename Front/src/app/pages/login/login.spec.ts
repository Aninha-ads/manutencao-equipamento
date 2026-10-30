import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { AuthService, Perfil } from '../../core/services/auth.service';

import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const auth = { login: vi.fn() };

  beforeEach(async () => {
    auth.login.mockReset();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      // O LoginComponent usa Router no construtor, então precisamos prover um.
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  it('oferece somente o cadastro público de cliente', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/cadastro"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('a[href="/cadastro-funcionario"]')).toBeNull();
  });

  for (const [perfil, painel] of [
    ['CLIENTE', '/painel-cliente'],
    ['FUNCIONARIO', '/painel-funcionario']
  ] as const) {
    it(`identifica ${perfil} pela resposta e abre seu painel`, async () => {
      auth.login.mockReturnValue(of({ perfil: perfil as Perfil }));
      const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      component.form.setValue({ email: 'pessoa@exemplo.com', senha: 'senha-teste' });

      await component.fazerLogin();

      expect(auth.login).toHaveBeenCalledWith('pessoa@exemplo.com', 'senha-teste');
      expect(navegar).toHaveBeenCalledWith([painel]);
      expect(component.enviando()).toBe(false);
    });
  }

  it('mostra erro sem navegar quando a autenticação falha', async () => {
    auth.login.mockReturnValue(throwError(() => new Error('Falha de autenticação')));
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.form.setValue({ email: 'pessoa@exemplo.com', senha: 'incorreta' });

    await component.fazerLogin();
    fixture.detectChanges();

    expect(navegar).not.toHaveBeenCalled();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('E-mail ou senha inválidos');
    expect(component.enviando()).toBe(false);
  });
});
