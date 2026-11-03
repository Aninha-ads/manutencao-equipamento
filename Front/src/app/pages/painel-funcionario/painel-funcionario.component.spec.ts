import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PainelFuncionarioComponent } from './painel-funcionario.component';
import { provideRouter } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { SolicitacaoTela } from '../../core/models/dados-tela.model';
import { vi } from 'vitest';

describe('PainelFuncionarioComponent', () => {
  let component: PainelFuncionarioComponent;
  let fixture: ComponentFixture<PainelFuncionarioComponent>;
  let registros: SolicitacaoTela[];
  const mudarEstado = vi.fn();

  beforeEach(async () => {
    registros = ['ABERTA', 'APROVADA', 'REJEITADA', 'ORCADA', 'ARRUMADA', 'PAGA', 'FINALIZADA']
      .map((estado, index) => ({ id: index + 1, estado, cliente: 'Cliente ' + index,
        equipamento: 'Notebook', descricao: 'Não liga', dataHora: '2026-11-03T12:00:00Z' })) as SolicitacaoTela[];
    mudarEstado.mockReset();
    await TestBed.configureTestingModule({ providers: [provideHttpClient(), provideRouter([]), {
      provide: DadosService, useValue: { listarSolicitacoes: () => registros, mudarEstado }
    }],
      imports: [PainelFuncionarioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PainelFuncionarioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => vi.restoreAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('lista todas as abertas, aprovadas e rejeitadas com as ações adequadas', () => {
    fixture.detectChanges();
    expect(component.solicitacoes.map(s => s.estado)).toEqual(['ABERTA', 'APROVADA', 'REJEITADA']);
    const linhas = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(linhas.length).toBe(3);
    expect(linhas[0].textContent).toContain('Efetuar Orçamento');
    expect(linhas[0].querySelector('a[href="/orcamentos/efetuar?id=1"]')).toBeTruthy();
    expect(linhas[1].textContent).toContain('Arrumar');
    expect(linhas[1].querySelector('a[href="/manutencoes/efetuar?id=2"]')).toBeTruthy();
    expect(linhas[2].textContent).toContain('Devolver / arquivar');
    expect(linhas[2].textContent).not.toContain('Arrumar');
  });

  it('arquiva com confirmação e remove a solicitação da lista após persistir', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mudarEstado.mockImplementation(async () => { registros = registros.map(s => s.id === 3 ? { ...s, estado: 'FINALIZADA' } : s); });
    await component.devolver(component.solicitacoes[2]);
    expect(mudarEstado).toHaveBeenCalledWith(3, 'FINALIZADA');
    expect(component.solicitacoes.map(s => s.id)).toEqual([1, 2]);
    expect(component.processando()).toBeNull();
  });

  it('não grava se o funcionário cancelar a devolução', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    await component.devolver(component.solicitacoes[2]);
    expect(mudarEstado).not.toHaveBeenCalled();
    expect(component.solicitacoes.length).toBe(3);
  });

  it('mantém o pedido na lista e mostra erro se a API recusar', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mudarEstado.mockRejectedValue(new Error('Conflito'));
    await component.devolver(component.solicitacoes[2]);
    expect(component.solicitacoes.length).toBe(3);
    expect(component.erro()).toContain('Não foi possível');
    expect(component.processando()).toBeNull();
  });
});
