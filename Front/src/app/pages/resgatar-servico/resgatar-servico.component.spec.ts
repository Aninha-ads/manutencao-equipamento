import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { AuthService } from '../../core/services/auth.service';
import { dadosTeste } from '../../testing/dados-teste';
import { ResgatarServicoComponent } from './resgatar-servico.component';
import { routes } from '../../app.routes';

describe('Resgate de solicitação rejeitada', () => {
  let http: HttpTestingController;
  const resposta = () => {
    const dados = dadosTeste();
    dados.solicitacoes[0] = { ...dados.solicitacoes[0], clienteId: 1, estado: 'REJEITADA', valorOrcamento: 250,
      historico: [{ estado: 'REJEITADA', dataHora: '2026-11-06T10:00:00Z', funcionario: null, descricao: 'Valor alto' }] };
    return dados;
  };
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '7' }) } } },
      { provide: AuthService, useValue: { id: 1, perfil: 'CLIENTE' } }]
    });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => { http.verify(); vi.restoreAllMocks(); });

  it('possui a rota usada pelo painel do cliente', () => {
    expect(routes.find(r => r.path === 'resgatar-servico/:id')?.component).toBe(ResgatarServicoComponent);
  });

  it('carrega após F5 e aprova o orçamento ao confirmar o resgate', async () => {
    const fixture = TestBed.createComponent(ResgatarServicoComponent);
    fixture.detectChanges();
    http.expectOne('/api/dados').flush(resposta());
    await expect.poll(() => fixture.componentInstance.carregando).toBe(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Valor alto');
    expect(fixture.nativeElement.textContent).toContain('Confirmar resgate e aprovar orçamento');
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const salvar = fixture.componentInstance.resgatarServico();
    const patch = http.expectOne('/api/solicitacoes/7/estado');
    expect(patch.request.body).toEqual({ estado: 'APROVADA' });
    patch.flush(null);
    await Promise.resolve();
    await Promise.resolve();
    const dados = resposta();
    dados.solicitacoes[0].estado = 'APROVADA';
    http.expectOne('/api/dados').flush(dados);
    await salvar;
    expect(navegar).toHaveBeenCalledWith(['/painel-cliente']);
  });

  it('não mostra pedido pertencente a outro cliente', async () => {
    const fixture = TestBed.createComponent(ResgatarServicoComponent);
    fixture.detectChanges();
    const dados = resposta();
    dados.solicitacoes[0].clienteId = 2;
    http.expectOne('/api/dados').flush(dados);
    await expect.poll(() => fixture.componentInstance.carregando).toBe(false);
    expect(fixture.componentInstance.solicitacao).toBeUndefined();
    await fixture.componentInstance.resgatarServico();
    http.expectNone('/api/solicitacoes/7/estado');
  });
});
