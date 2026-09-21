import { Routes } from '@angular/router';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { HomeComponent } from './home/home.component'; 
import { LoginComponent } from './pages/login/login';
import { PainelFuncionarioComponent } from './pages/painel-funcionario/painel-funcionario.component';
import { EfetuarOrcamentoComponent } from './pages/orcamentos/efetuar-orcamento/efetuar-orcamento.component';
import { MostrarOrcamentoComponent } from './pages/orcamentos/mostrar-orcamento/mostrar-orcamento.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';
import { EfetuarManutencaoComponent } from './pages/manutencoes/efetuar-manutencao/efetuar-manutencao.component';
import { RedirecionarManutencaoComponent } from './pages/manutencoes/redirecionar-manutencao/redirecionar-manutencao.component';
import { OrcamentoSolicitacaoComponent } from './features/solicitacao-orcamento/orcamento-solicitacao.component';
import { ManterFuncionariosComponent } from './features/manter-funcionarios/manter-funcionarios.component';
import { CategoriaComponent } from './features/cadastro-categoria/categoria.component';
import { VisualizacaoSolicitacoesComponent } from './pages/visualizacao-solicitacoes/visualizacao-solicitacoes.component';
import { LoginFuncionarioComponent } from './pages/login-funcionario/login-funcionario.component';
import { ClienteLayoutComponent } from './pages/cliente-layout/cliente-layout.component';
import { FuncionarioLayoutComponent } from './pages/funcionario-layout/funcionario-layout.component';

//tive que fazer uma nota rota por causa do navbar que eu criei (a rota antiga está no final da página, se estiver tudo certinho pode apagar ela)
export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'login-funcionario',
    component: LoginFuncionarioComponent
  },

  {
    path: 'cadastro',
    component: CadastroClienteComponent
  },

  // CLIENTE

  {
  path: '',
  component: ClienteLayoutComponent,
  children: [
    {
      path: 'painel-cliente',
      component: PainelClienteComponent
    },
    {
      path: 'visualizar-servico',
      component: VisualizarServicoComponent
    },
    {
      path: 'orcamento/novo',
      component: OrcamentoSolicitacaoComponent
    }
  ]
},

  // FUNCIONÁRIO

{
  path: 'painel-funcionario',
  component: FuncionarioLayoutComponent,
  children: [
    {
      path: '',
      component: PainelFuncionarioComponent
    }
  ]
},

{
  path: 'manutencoes/efetuar',
  component: FuncionarioLayoutComponent,
  children: [
    {
      path: '',
      component: EfetuarManutencaoComponent
    }
  ]
},

{
  path: 'orcamentos/efetuar',
  component: FuncionarioLayoutComponent,
  children: [
    {
      path: '',
      component: EfetuarOrcamentoComponent
    }
  ]
},

{
  path: 'visualizacao-solicitacoes',
  component: FuncionarioLayoutComponent,
  children: [
    {
      path: '',
      component: VisualizacaoSolicitacoesComponent
    }
  ]
},

{
  path: 'categoria',
  component: FuncionarioLayoutComponent,
  children: [
    {
      path: '',
      component: CategoriaComponent
    }
  ]
},

  // OUTRAS PÁGINAS

  {
    path: 'orcamento/:id',
    component: OrcamentoSolicitacaoComponent
  },

  {
    path: 'orcamentos',
    component: MostrarOrcamentoComponent
  },

  {
    path: 'manutencoes/redirecionar',
    component: RedirecionarManutencaoComponent
  },

  {
    path: 'manter-funcionarios',
    component: ManterFuncionariosComponent
  },

  {
    path: 'home',
    component: HomeComponent
  },

  // TESTE VIACEP
  {
    path: 'teste-viacep',
    loadComponent: () =>
      import('./pages/teste-viacep/teste-viacep.component')
        .then(m => m.TesteViacepComponent)
  },

  {
    path: '**',
    redirectTo: 'home'
  }

];