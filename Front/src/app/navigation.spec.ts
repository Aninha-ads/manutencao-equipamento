import { TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { EfetuarOrcamentoComponent } from './pages/orcamentos/efetuar-orcamento/efetuar-orcamento.component';
import { EfetuarManutencaoComponent } from './pages/manutencoes/efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './pages/manutencoes/redirecionar-manutencao/redirecionar-manutencao.component';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { NavbarFuncionarioComponent } from './pages/navbar-funcionario/navbar-funcionario.component';

describe('Navegação das solicitações', () => {
  beforeEach(() => {
    registerLocaleData(localePt);
    localStorage.setItem('solicitacoes', JSON.stringify([
      { id: 7, dataHora: '2026-09-01T10:00:00', equipamento: 'Monitor selecionado', descricao: 'Tela piscando', estado: 'ABERTA' },
      { id: 12, dataHora: '2026-09-02T10:00:00', equipamento: 'Impressora selecionada', descricao: 'Sem impressão', estado: 'APROVADA' }
    ]));
    TestBed.configureTestingModule({ providers: [provideRouter(routes), provideHttpClient()] });
  });

  afterEach(() => localStorage.clear());

  it('mostra o registro selecionado e atualiza ao navegar para outro ID', async () => {
    const harness = await RouterTestingHarness.create();
    let component = await harness.navigateByUrl('/visualizar-servico/7', VisualizarServicoComponent);
    expect(component.solicitacao?.equipamento).toBe('Monitor selecionado');
    expect(harness.routeNativeElement?.textContent).toContain('Tela piscando');
    component = await harness.navigateByUrl('/visualizar-servico/12', VisualizarServicoComponent);
    expect(component.solicitacao?.id).toBe(12);
    expect(harness.routeNativeElement?.textContent).toContain('Impressora selecionada');
    expect(harness.routeNativeElement?.textContent).not.toContain('Monitor selecionado');
  });

  it('cada botão Detalhes do painel inclui o ID da própria linha', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/painel-cliente', PainelClienteComponent);
    const links = [...harness.routeNativeElement!.querySelectorAll<HTMLAnchorElement>('a')]
      .filter(link => link.textContent?.trim() === 'Detalhes');
    expect(links.map(link => link.getAttribute('href'))).toEqual(['/visualizar-servico/7', '/visualizar-servico/12']);
    links[1].click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/visualizar-servico/12');
  });

  it('volta ao painel de origem do funcionário', async () => {
    const harness = await RouterTestingHarness.create();
    const component = await harness.navigateByUrl('/visualizar-servico/7?origem=painel-funcionario', VisualizarServicoComponent);
    expect(component.rotaVoltar).toBe('/painel-funcionario');
  });

  it('informa ID inexistente ou inválido sem mostrar um registro fixo', async () => {
    const harness = await RouterTestingHarness.create();
    for (const id of ['999', 'abc']) {
      const component = await harness.navigateByUrl('/visualizar-servico/' + id, VisualizarServicoComponent);
      expect(component.solicitacao).toBeUndefined();
      expect(harness.routeNativeElement?.textContent).toContain('Solicitação não encontrada');
    }
  });

  it('leva o ID ao orçamento do funcionário', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/orcamentos/efetuar?id=7', EfetuarOrcamentoComponent);
    const component = await harness.navigateByUrl('/orcamentos/efetuar?id=12', EfetuarOrcamentoComponent);
    expect(component.registro?.id).toBe(12);
    expect(component.solicitacao.equipamento).toBe('Impressora selecionada');
  });

  it('preserva o registro entre manutenção e redirecionamento', async () => {
    const harness = await RouterTestingHarness.create();
    const manutencao = await harness.navigateByUrl('/manutencoes/efetuar?id=12', EfetuarManutencaoComponent);
    expect(manutencao.registro?.id).toBe(12);
    const link = harness.routeNativeElement?.querySelector<HTMLButtonElement>('button.btn-warning');
    link?.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/manutencoes/redirecionar?id=12');
    const redirecionamento = await harness.navigateByUrl('/manutencoes/redirecionar?id=12', RedirecionarManutencaoComponent);
    expect(redirecionamento.registro?.equipamento).toBe('Impressora selecionada');
  });

  it('não exibe dados de exemplo nos formulários sem ID', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/orcamentos/efetuar', EfetuarOrcamentoComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Solicitação não encontrada');
  });

  it('o menu do funcionário abre destinos existentes e permite sair', async () => {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(NavbarFuncionarioComponent);
    fixture.detectChanges();
    const links = [...fixture.nativeElement.querySelectorAll('a')] as HTMLAnchorElement[];
    const destinos = links.map(link => link.getAttribute('href'));
    expect(destinos).toContain('/manter-funcionarios');
    expect(destinos).toContain('/relatorios');
    for (const destino of destinos) {
      expect(routes.some(route => '/' + route.path === destino)).toBe(true);
    }
    const botaoMenu = fixture.nativeElement.querySelector('.navbar-toggler') as HTMLButtonElement;
    botaoMenu.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.navbar-collapse').classList.contains('show')).toBe(true);
    localStorage.setItem('token', 'sessao-de-teste');
    const sair = fixture.nativeElement.querySelector('.btn-outline-dark') as HTMLButtonElement;
    sair.click();
    await harness.fixture.whenStable();
    expect(localStorage.getItem('token')).toBeNull();
    expect(TestBed.inject(Router).url).toBe('/login');
  });
});
