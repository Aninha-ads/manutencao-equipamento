import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../app.routes';
import { AuthService } from '../../core/services/auth.service';
import { DadosService } from '../../core/services/dados.service';
import { SolicitacaoTela } from '../../core/models/dados-tela.model';
import { VisualizarServicoComponent } from '../visualizar-servico/visualizar-servico.component';
import { PainelFuncionarioComponent } from './painel-funcionario.component';
import { LoginComponent } from '../login/login';

describe('Detalhes de solicitação aberta pelo funcionário', () => {
  const registros: SolicitacaoTela[] = [
    { id: 22, clienteId: 1, dataHora: '2026-11-03T12:00:00Z', equipamento: 'Notebook selecionado',
      descricao: 'Tela quebrada', estado: 'ABERTA', cliente: 'Zoe Reis', historico: [] },
    { id: 23, clienteId: 2, dataHora: '2026-11-03T13:00:00Z', equipamento: 'Monitor selecionado',
      descricao: 'Não liga', estado: 'ABERTA', cliente: 'Outro cliente', historico: [] }
  ];
  let auth: { autenticado: boolean; perfil: string };

  beforeEach(() => {
    registerLocaleData(localePt);
    auth = { autenticado: true, perfil: 'FUNCIONARIO' };
    TestBed.configureTestingModule({ providers: [
      provideRouter(routes),
      { provide: AuthService, useValue: auth },
      { provide: DadosService, useValue: {
        listarSolicitacoes: () => registros,
        buscarSolicitacao: (id: string) => registros.find(registro => registro.id === Number(id))
      } }
    ] });
    // Um contexto antigo de cliente não deve bloquear o funcionário autenticado.
    localStorage.setItem('clienteLogadoId', '999');
  });

  afterEach(() => localStorage.removeItem('clienteLogadoId'));

  it('abre os detalhes da linha clicada e permite voltar ao painel', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/painel-funcionario', PainelFuncionarioComponent);
    const links = [...harness.routeNativeElement!.querySelectorAll<HTMLAnchorElement>('a')]
      .filter(link => link.textContent?.trim() === 'Detalhes');
    expect(links.map(link => link.getAttribute('href')))
      .toEqual(['/solicitacoes/abertas/22', '/solicitacoes/abertas/23']);

    links[1].click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/solicitacoes/abertas/23');
    expect(harness.routeNativeElement?.textContent).toContain('Detalhes da solicitação aberta');
    expect(harness.routeNativeElement?.textContent).toContain('Monitor selecionado');
    expect(harness.routeNativeElement?.textContent).not.toContain('Rejeitar serviço');
    expect(harness.routeNativeElement?.querySelector('a[href="/orcamentos/efetuar?id=23"]')).toBeTruthy();

    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.btn-voltar')!.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/painel-funcionario');
  });

  it('carrega por URL direta e troca os dados ao navegar entre IDs', async () => {
    const harness = await RouterTestingHarness.create();
    let component = await harness.navigateByUrl('/solicitacoes/abertas/22', VisualizarServicoComponent);
    expect(component.solicitacao?.id).toBe(22);
    component = await harness.navigateByUrl('/solicitacoes/abertas/23', VisualizarServicoComponent);
    expect(component.solicitacao?.id).toBe(23);
    expect(component.rotaVoltar).toBe('/painel-funcionario');
  });

  it('mostra aviso para ID inexistente com retorno ao painel do funcionário', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/solicitacoes/abertas/999', VisualizarServicoComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Solicitação não encontrada');
    expect(harness.routeNativeElement?.querySelector('a[href="/painel-funcionario"]')).toBeTruthy();
  });

  for (const perfil of ['CLIENTE', 'VISITANTE']) {
    it(`bloqueia acesso de ${perfil}`, async () => {
      auth.perfil = perfil;
      auth.autenticado = perfil !== 'VISITANTE';
      const harness = await RouterTestingHarness.create();
      await harness.navigateByUrl('/solicitacoes/abertas/22', LoginComponent);
      expect(TestBed.inject(Router).url).toBe('/login');
    });
  }
});
