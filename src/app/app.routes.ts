import { Routes } from '@angular/router';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { LoginComponent } from './pages/login/login';
import { PainelFuncionarioComponent } from './pages/painel-funcionario/painel-funcionario.component';
import { EfetuarOrcamentoComponent } from './pages/orcamentos/efetuar-orcamento/efetuar-orcamento.component';
import { MostrarOrcamentoComponent } from './pages/orcamentos/mostrar-orcamento/mostrar-orcamento.component';
import { VisualizarServicoComponent } from './pages/visualizar-servico/visualizar-servico.component';

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
    path: 'cadastro',
    component: CadastroClienteComponent
  },
  {
    path: 'painel-cliente',
    component: PainelClienteComponent
  },
  {
    path: 'painel-funcionario',
    component: PainelFuncionarioComponent
  },
  {
    path: 'orcamentos/efetuar',
    component: EfetuarOrcamentoComponent
  },
  {
    path: 'orcamentos',
    component: MostrarOrcamentoComponent
  },
    {
    path: 'visualizar-servico',
    component: VisualizarServicoComponent
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];