import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { OrcamentoSolicitacaoComponent } from './orcamento-solicitacao.component';

describe('OrcamentoSolicitacaoComponent', () => {
  let componente: OrcamentoSolicitacaoComponent;
  let dispositivoTeste: ComponentFixture<OrcamentoSolicitacaoComponent>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [OrcamentoSolicitacaoComponent],
    }).compileComponents();

    dispositivoTeste = TestBed.createComponent(OrcamentoSolicitacaoComponent);
    componente = dispositivoTeste.componentInstance;
    componente.ngOnInit();
    await dispositivoTeste.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('deve criar o componente', () => {
    expect(componente).toBeTruthy();
  });

  it('deve gerar o primeiro ID quando não há solicitações salvas', () => {
    expect(componente.solicitacaoId).toBe(1);
  });

  it('deve gerar o próximo ID com base nas solicitações existentes', () => {
    localStorage.setItem('solicitacoes', JSON.stringify([
      { id: 3, dataHora: '', categoria: 'Monitor', equipamento: 'Monitor', descricao: 'Falha', estado: 'Pendente' },
      { id: 7, dataHora: '', categoria: 'Notebook', equipamento: 'Notebook', descricao: 'Falha', estado: 'Pendente' }
    ]));

    const novoComponente = TestBed.createComponent(OrcamentoSolicitacaoComponent).componentInstance;
    novoComponente.ngOnInit();

    expect(novoComponente.solicitacaoId).toBe(8);
  });

  it('deve impedir o registro com campos vazios', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);

    componente.salvarSolicitacao();

    expect(alerta).toHaveBeenCalledWith(
      'Preencha a categoria, o equipamento e os detalhes da solicitação.'
    );
    expect(localStorage.getItem('solicitacoes')).toBeNull();
  });

  it('deve salvar uma solicitação preenchida', () => {
    const alerta = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    componente.categoria = 'Notebook';
    componente.equipamento = ' Notebook Dell ';
    componente.descricao = ' Não liga ';

    componente.salvarSolicitacao();

    const solicitacoesSalvas = JSON.parse(localStorage.getItem('solicitacoes') ?? '[]');
    expect(solicitacoesSalvas).toHaveLength(1);
    expect(solicitacoesSalvas[0]).toMatchObject({
      id: 1,
      categoria: 'Notebook',
      equipamento: 'Notebook Dell',
      descricao: 'Não liga',
      estado: 'Pendente'
    });
    expect(alerta).toHaveBeenCalledWith('Sua solicitação de orçamento foi enviada com sucesso!');
  });
});
