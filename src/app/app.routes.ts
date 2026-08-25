import { Routes } from '@angular/router';

<<<<<<< HEAD
import { LoginComponent } from './pages/login/login';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { PainelFuncionarioComponent } from './pages/painel-funcionario/painel-funcionario.component';

import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';

export const routes: Routes = [

=======
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { LoginComponent } from './pages/login/login';

export const routes: Routes = [
>>>>>>> edc7e780734bd991e27d324cb97d7484b49602ce
  {
    path: 'login',
    component: LoginComponent
  },
<<<<<<< HEAD

  {
    path: 'cadastro',
    component: CadastroClienteComponent
  },

=======
>>>>>>> edc7e780734bd991e27d324cb97d7484b49602ce
  {
    path: 'painel-cliente',
    component: PainelClienteComponent
  },
<<<<<<< HEAD

  {
    path: 'painel-funcionario',
    component: PainelFuncionarioComponent
  }

];
=======
  {
    path: 'cadastro',
    component: CadastroClienteComponent
  }
];
>>>>>>> edc7e780734bd991e27d324cb97d7484b49602ce
