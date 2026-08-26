import { Routes } from '@angular/router';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';

export const routes: Routes = [
  {
    path: 'painel-cliente',
    component: PainelClienteComponent
  },
  {
    path: 'cadastro',
    component: CadastroClienteComponent
  }
];