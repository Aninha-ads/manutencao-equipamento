import { Routes } from '@angular/router';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { LoginComponent } from './pages/login/login';
import { PainelFuncionarioComponent } from './pages/painel-funcionario/painel-funcionario.component';
import { EfetuarOrcamentoComponent } from './pages/orcamentos/efetuar-orcamento/efetuar-orcamento.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { EfetuarManutencaoComponent } from './pages/manutencoes/efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './pages/manutencoes/redirecionar-manutencao/redirecionar-manutencao.component';
import { OrcamentoSolicitacaoComponent } from './features/solicitacao-orcamento/orcamento-solicitacao.component';
import { ManterFuncionariosComponent } from './features/manter-funcionarios/manter-funcionarios.component';
import { CategoriaComponent } from './features/cadastro-categoria/categoria.component';
import { VisualizacaoSolicitacoesComponent } from './pages/visualizacao-solicitacoes/visualizacao-solicitacoes.component';
import { HomeComponent } from './home/home.component';
import { RelatoriosComponent } from './pages/relatorios/relatorios.component';
import { ResgatarServicoComponent } from './pages/resgatar-servico/resgatar-servico.component';
import { MostrarOrcamentoComponent } from './pages/orcamentos/mostrar-orcamento/mostrar-orcamento.component';
import { perfilGuard } from './core/guards/perfil.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
   {
    path: 'login-funcionario',
    redirectTo: 'login',
    pathMatch: 'full'
    },
   {
     path: 'cadastro-funcionario',
     redirectTo: 'manter-funcionarios',
     pathMatch: 'full'
   },

    {
    path: 'home',
    component: HomeComponent  },

  {
    path: 'cadastro',
    component: CadastroClienteComponent
  },
  {
    path: 'painel-cliente',
      component: PainelClienteComponent,
      canActivate: [perfilGuard('CLIENTE')]
    },
    {
      path: 'painel-funcionario',
      component: PainelFuncionarioComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
    },
    {
      path: 'orcamentos/efetuar',
      component: EfetuarOrcamentoComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
  },
    { path: 'orcamentos/mostrar-orcamento/:id',
      component: MostrarOrcamentoComponent,
      canActivate: [perfilGuard('CLIENTE')]
  },
  {
      path: 'visualizacao-solicitacoes',
      component: VisualizacaoSolicitacoesComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
    },
    {
      path: 'orcamento/novo',
      component: OrcamentoSolicitacaoComponent,
      canActivate: [perfilGuard('CLIENTE')]
    },
    {
      path: 'orcamentos/:id',
      component: VisualizarServicoComponent,
      canActivate: [perfilGuard('CLIENTE')]
    },
    {
      path: 'visualizar-servico/:id',
      component: VisualizarServicoComponent,
      canActivate: [perfilGuard('CLIENTE')]
  },
    {
      path: 'manutencoes/efetuar',
      component: EfetuarManutencaoComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
  },
    {
        path: 'manutencoes/redirecionar',
      component: RedirecionarManutencaoComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
    },

    {
      path: 'manter-funcionarios',
      component: ManterFuncionariosComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
    },

    {
      path: 'categoria',
      component: CategoriaComponent,
      canActivate: [perfilGuard('FUNCIONARIO')]
    
  },

  {
    path: 'registrar-servico/:id',
    component: ResgatarServicoComponent,
    canActivate: [perfilGuard('CLIENTE')]
  },

  {
  path: 'relatorios',
  component: RelatoriosComponent,
  canActivate: [perfilGuard('FUNCIONARIO')]
  },

  {
    path: '**',
    redirectTo: 'home'
  }
];
