import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { DadosService } from '../../core/services/dados.service';
import { dadosTeste } from '../../testing/dados-teste';
import { OrcamentoSolicitacaoComponent } from './orcamento-solicitacao.component';

describe('Abertura de solicitação no SQL', () => {
  let componente: OrcamentoSolicitacaoComponent;
  let http: HttpTestingController;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [OrcamentoSolicitacaoComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    });
    http = TestBed.inject(HttpTestingController);
    const carregar = TestBed.inject(DadosService).carregar();
    http.expectOne('/api/dados').flush(dadosTeste());
    await carregar;
    componente = TestBed.createComponent(OrcamentoSolicitacaoComponent).componentInstance;
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });
  afterEach(() => { http.verify(); vi.restoreAllMocks(); });

  it('impede registro com campos vazios', async () => {
    await componente.salvarSolicitacao();
    expect(componente.form.invalid).toBe(true);
    http.expectNone('/api/solicitacoes');
  });
  it('envia IDs do banco e só confirma depois da gravação', async () => {
    componente.clienteId = 3;
    componente.form.setValue({ categoria: 'Notebook', equipamento: ' Notebook Dell ', descricao: ' Não liga ' });
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const salvar = componente.salvarSolicitacao();
    const pedido = http.expectOne('/api/solicitacoes');
    expect(pedido.request.body).toEqual({ clienteId: 3, categoriaId: 1, equipamento: 'Notebook Dell', descricao: 'Não liga' });
    expect(navegar).not.toHaveBeenCalled();
    pedido.flush({ id: 42 });
    await Promise.resolve();
    http.expectOne('/api/dados').flush(dadosTeste());
    await salvar;
    expect(navegar).toHaveBeenCalledWith(['/painel-cliente']);
  });
  it('mantém o usuário na tela quando o banco recusa o cadastro', async () => {
    componente.clienteId = 3;
    componente.form.setValue({ categoria: 'Notebook', equipamento: 'Notebook', descricao: 'Falha' });
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const salvar = componente.salvarSolicitacao();
    http.expectOne('/api/solicitacoes').flush('Falha', { status: 409, statusText: 'Conflict' });
    await salvar;
    expect(navegar).not.toHaveBeenCalled();
  });
});
