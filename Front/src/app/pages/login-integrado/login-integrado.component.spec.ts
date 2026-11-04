import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginApiService } from '../../core/services/login-api.service';
import { LoginIntegradoComponent } from './login-integrado.component';

describe('LoginIntegradoComponent', () => {
  let fixture: ComponentFixture<LoginIntegradoComponent>;
  let component: LoginIntegradoComponent;
  let router: Router;
  const api = { entrar: vi.fn() };

  beforeEach(async () => {
    api.entrar.mockReset();
    await TestBed.configureTestingModule({
      imports: [LoginIntegradoComponent],
      providers: [provideRouter([]), { provide: LoginApiService, useValue: api }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginIntegradoComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  it('não chama a API com formulário inválido', () => {
    component.entrar();
    expect(api.entrar).not.toHaveBeenCalled();
  });

  it('cliente é enviado para o painel do cliente', () => {
    api.entrar.mockReturnValue(of({ id: 1, nome: 'Ana', email: 'ana@example.test', perfil: 'CLIENTE' }));
    component.form.setValue({ email: 'ana@example.test', senha: '1234' });
    component.entrar();
    expect(router.navigate).toHaveBeenCalledWith(['/painel-cliente']);
  });

  it('funcionário é enviado para o painel do funcionário', () => {
    api.entrar.mockReturnValue(of({ id: 5, nome: 'Maria', email: 'maria@example.test', perfil: 'FUNCIONARIO' }));
    component.form.setValue({ email: 'maria@example.test', senha: '1234' });
    component.entrar();
    expect(router.navigate).toHaveBeenCalledWith(['/painel-funcionario']);
  });

  it('mostra mensagem quando as credenciais são inválidas', () => {
    api.entrar.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    component.form.setValue({ email: 'ana@example.test', senha: 'errada' });
    component.entrar();
    fixture.detectChanges();
    expect(component.erro).toContain('inválidos');
    expect(fixture.nativeElement.querySelector('.alert-danger')).toBeTruthy();
    expect(component.enviando).toBe(false);
  });
});
