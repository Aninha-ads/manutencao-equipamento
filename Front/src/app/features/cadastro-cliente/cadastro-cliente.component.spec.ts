import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService } from '../../core/services/auth.service';

import { CadastroClienteComponent } from './cadastro-cliente.component';

describe('CadastroClienteComponent', () => {
  let component: CadastroClienteComponent;
  let fixture: ComponentFixture<CadastroClienteComponent>;
  const registrarCliente = vi.fn();

  beforeEach(async () => {
    registrarCliente.mockReset().mockReturnValue(of({ perfil: 'CLIENTE' }));
    await TestBed.configureTestingModule({
      imports: [CadastroClienteComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]), provideNgxMask(),
        { provide: AuthService, useValue: { registrarCliente } }],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const [numero, formatado] of [
    ['4133334444', '(41) 3333-4444'],
    ['41999998888', '(41) 99999-8888']
  ]) {
    it(`aceita e envia ${numero.length} dígitos com máscara de telefone`, async () => {
      component.formulario.patchValue({
        nome: 'Cliente de teste', email: 'telefone@example.test', senha: 'Teste123',
        cpf: '52998224725', cep: '80010000', logradouro: 'Rua de teste', numero: '10',
        bairro: 'Centro', cidade: 'Curitiba', uf: 'PR'
      });
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('#telefone') as HTMLInputElement;
      input.value = numero;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      fixture.detectChanges();
      expect(input.value).toBe(formatado);
      expect(component.campos.telefone.value).toBe(numero);
      expect(component.campos.telefone.valid).toBe(true);
      const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
      component.cadastrar();
      expect(registrarCliente).toHaveBeenCalledWith(expect.objectContaining({ telefone: numero }));
      expect(navegar).toHaveBeenCalledWith(['/painel-cliente']);
    });
  }

  it('rejeita telefone incompleto e mantém CEP com exatamente oito dígitos', () => {
    component.campos.telefone.setValue('413333444');
    expect(component.campos.telefone.hasError('quantidadeDigitos')).toBe(true);
    component.campos.cep.setValue('8001000');
    expect(component.campos.cep.hasError('quantidadeDigitos')).toBe(true);
    component.campos.cep.setValue('80010000');
    expect(component.campos.cep.valid).toBe(true);
  });
});
