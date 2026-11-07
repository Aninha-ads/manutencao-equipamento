import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { dadosTeste } from '../../testing/dados-teste';
import { VisualizacaoSolicitacoesComponent } from './visualizacao-solicitacoes.component';

describe('Solicitações após atualizar o navegador', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
        { provide: AuthService, useValue: { id: 5 } }]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => { http.verify(); vi.restoreAllMocks(); });

  it('busca as solicitações mesmo quando a memória começa vazia', async () => {
    const fixture = TestBed.createComponent(VisualizacaoSolicitacoesComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Carregando solicitações');
    const resposta = dadosTeste();
    http.expectOne('/api/dados').flush(resposta);
    await expect.poll(() => fixture.componentInstance.carregando).toBe(false);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.solicitacoes.length).toBe(resposta.solicitacoes.length);
    expect(fixture.componentInstance.solicitacoesFiltradas.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).not.toContain('Nenhuma solicitação encontrada');
  });

  it('devolve e arquiva rejeitada após confirmar a operação', async () => {
    const fixture = TestBed.createComponent(VisualizacaoSolicitacoesComponent);
    fixture.detectChanges();
    const dados = dadosTeste();
    dados.solicitacoes[0].estado = 'REJEITADA';
    http.expectOne('/api/dados').flush(dados);
    await expect.poll(() => fixture.componentInstance.carregando).toBe(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Devolver e arquivar');
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const finalizar = fixture.componentInstance.finalizarSolicitacao(fixture.componentInstance.solicitacoes[0]);
    const patch = http.expectOne('/api/solicitacoes/7/estado');
    expect(patch.request.body).toEqual({ estado: 'FINALIZADA' });
    patch.flush(null);
    await Promise.resolve();
    await Promise.resolve();
    dados.solicitacoes[0].estado = 'FINALIZADA';
    http.expectOne('/api/dados').flush(dados);
    await finalizar;
    expect(fixture.componentInstance.solicitacoes[0].estado).toBe('FINALIZADA');
  });

  it('distingue falha da API de lista vazia e permite tentar novamente', async () => {
    const fixture = TestBed.createComponent(VisualizacaoSolicitacoesComponent);
    fixture.detectChanges();
    http.expectOne('/api/dados').flush('Erro', { status: 503, statusText: 'Unavailable' });
    await expect.poll(() => fixture.componentInstance.carregando).toBe(false);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Não foi possível carregar');
    expect(fixture.nativeElement.textContent).not.toContain('Nenhuma solicitação encontrada');
    const tentativa = fixture.componentInstance.carregarSolicitacoes();
    http.expectOne('/api/dados').flush(dadosTeste());
    await tentativa;
    expect(fixture.componentInstance.erroCarregamento).toBe('');
    expect(fixture.componentInstance.solicitacoesFiltradas.length).toBeGreaterThan(0);
  });
});
