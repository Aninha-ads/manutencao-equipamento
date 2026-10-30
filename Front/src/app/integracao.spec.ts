import { DadosService } from './core/services/dados.service';
import { dadosTeste } from './testing/dados-teste';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { OrcamentoSolicitacaoComponent } from './features/solicitacao-orcamento/orcamento-solicitacao.component';

describe('INT01 — Nova solicitação e painel do cliente', () => {
  beforeEach(async () => {
    registerLocaleData(localePt);
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()] });
    const carregar = TestBed.inject(DadosService).carregar();
    TestBed.inject(HttpTestingController).expectOne('/api/dados').flush({
      ...dadosTeste(),
      clientes: [
        { id: 1, nome: 'Ana', email: 'ana@example.test', cpf: '11111111111', telefone: '41999990001', ativo: true,
          endereco: { cep: '80000000', logradouro: 'Rua A', numero: '1', complemento: '', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR' } },
        { id: 2, nome: 'Bruno', email: 'bruno@example.test', cpf: '22222222222', telefone: '41999990002', ativo: true,
          endereco: { cep: '80000000', logradouro: 'Rua B', numero: '2', complemento: '', bairro: 'Centro', cidade: 'Curitiba', uf: 'PR' } }
      ]
    });
    await carregar;
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('solicitação criada aparece no painel apenas para o cliente que a criou', async () => {
    const harness = await RouterTestingHarness.create();

    // Ana cria uma solicitação.
    const formulario = await harness.navigateByUrl('/orcamento/novo', OrcamentoSolicitacaoComponent);
    formulario.selecionarCliente(1);
    formulario.form.setValue({ categoria: 'Notebook', equipamento: 'Notebook de teste', descricao: 'Não liga' });

    const http = TestBed.inject(HttpTestingController);
    const envio = formulario.salvarSolicitacao();
    const requisicaoCriar = http.expectOne('/api/solicitacoes');
    requisicaoCriar.flush({ id: 99 });
    const requisicaoRecarga = http.expectOne('/api/dados');
    requisicaoRecarga.flush({
      ...dadosTeste(),
      clientes: [],
      solicitacoes: [
        ...dadosTeste().solicitacoes,
        { id: 99, dataHora: '2026-09-03T10:00:00', equipamento: 'Notebook de teste', descricao: 'Não liga', estado: 'ABERTA', clienteId: 1 }
      ]
    });
    await envio;

    // Painel do cliente Ana (clienteLogadoId = 1) deve mostrar a nova solicitação.
    const painelAna = await harness.navigateByUrl('/painel-cliente', PainelClienteComponent);
    expect(painelAna.solicitacoes.some(s => s.id === 99)).toBe(true);

    // Painel do cliente Bruno (clienteLogadoId = 2) não deve mostrar a solicitação da Ana.
    localStorage.setItem('clienteLogadoId', '2');
    const painelBruno = await harness.navigateByUrl('/painel-cliente', PainelClienteComponent);
    expect(painelBruno.solicitacoes.some(s => s.id === 99)).toBe(false);
  });
});