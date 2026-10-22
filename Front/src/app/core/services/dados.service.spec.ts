import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DadosService, DadosTelas } from './dados.service';
import { provideRouter } from '@angular/router';
import { ManterFuncionariosComponent } from '../../features/manter-funcionarios/manter-funcionarios.component';
import { RedirecionarManutencaoComponent } from '../../pages/manutencoes/redirecionar-manutencao/redirecionar-manutencao.component';
import { dadosTeste } from '../../testing/dados-teste';

describe('DadosService — fonte SQL via API', () => {
  let service: DadosService;
  let http: HttpTestingController;
  const resposta: DadosTelas = {
    clientes: [], categorias: [{ id: 9, nome: 'Categoria do SQL' }], solicitacoes: [],
    funcionarios: [{ id: 5, nome: 'Funcionário do SQL', email: 'tecnico@example.test', nascimento: '1990-05-15' }]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])] });
    service = TestBed.inject(DadosService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); localStorage.clear(); });

  it('usa os registros retornados pelo SQL e ignora os mocks antigos no navegador', async () => {
    localStorage.setItem('funcionarios', JSON.stringify([{ id: 999, nome: 'Mock antigo' }]));
    const carregar = service.carregar();
    http.expectOne('/api/dados').flush(resposta);
    await carregar;
    expect(service.listarFuncionarios()).toEqual(resposta.funcionarios);
    expect(service.listarCategorias()).toEqual(resposta.categorias);
    const copia = service.listarFuncionarios();
    copia[0].nome = 'Alteração não salva';
    expect(service.listarFuncionarios()[0].nome).toBe('Funcionário do SQL');
  });

  it('não cria uma massa alternativa quando a API falha', async () => {
    const carregar = service.carregar();
    http.expectOne('/api/dados').flush('Indisponível', { status: 503, statusText: 'Unavailable' });
    await expect(carregar).rejects.toBeDefined();
    expect(service.listarFuncionarios()).toEqual([]);
    expect(service.listarSolicitacoes()).toEqual([]);
  });

  for (const redirecionamentoPrimeiro of [true, false]) {
    it(`usa os mesmos funcionários do SQL com redirecionamento primeiro: ${redirecionamentoPrimeiro}`, async () => {
      const carregar = service.carregar();
      http.expectOne('/api/dados').flush(dadosTeste());
      await carregar;
      const crud = () => TestBed.createComponent(ManterFuncionariosComponent).componentInstance;
      const redirecionamento = () => TestBed.createComponent(RedirecionarManutencaoComponent).componentInstance;
      if (redirecionamentoPrimeiro) {
        const primeira = redirecionamento();
        expect(crud().funcionarios).toEqual(primeira.funcionarios);
      } else {
        const primeira = crud();
        expect(redirecionamento().funcionarios).toEqual(primeira.funcionarios);
      }
      expect(service.listarFuncionarios().map(f => f.id)).toEqual([5, 6]);
    });
  }

  it('deixa o banco gerar o ID e recarrega os dados após cadastrar', async () => {
    const abertura = { clienteId: 1, categoriaId: 9, equipamento: 'Monitor', descricao: 'Não liga' };
    const salvar = service.criarSolicitacao(abertura);
    const pedido = http.expectOne('/api/solicitacoes');
    expect(pedido.request.method).toBe('POST');
    expect(pedido.request.body).toEqual(abertura);
    pedido.flush({ id: 42 });
    await Promise.resolve();
    http.expectOne('/api/dados').flush(resposta);
    expect(await salvar).toEqual({ id: 42 });
  });

  it('propaga erros de gravação sem modificar a fonte compartilhada', async () => {
    const carregar = service.carregar();
    http.expectOne('/api/dados').flush(resposta);
    await carregar;
    const salvar = service.salvarFuncionario({ ...resposta.funcionarios[0], nome: 'Outro nome' });
    http.expectOne('/api/funcionarios/5').flush('Falha', { status: 409, statusText: 'Conflict' });
    await expect(salvar).rejects.toBeDefined();
    expect(service.listarFuncionarios()).toEqual(resposta.funcionarios);
  });
});
