import { TestBed } from '@angular/core/testing';
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

  afterEach(() => http.verify());

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
