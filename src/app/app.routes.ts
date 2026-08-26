import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { PainelFuncionarioComponent } from './pages/painel-funcionario/painel-funcionario.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full'
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
  }
];