import { Routes } from '@angular/router';
import { PainelClienteComponent } from './pages/painel-cliente/painel-cliente.component';

export const routes: Routes = [
    {
        path: 'painel-cliente',
        component: PainelClienteComponent
    }
];



import { Routes } from '@angular/router';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component'; 
export const routes: Routes = [
  { path: 'cadastro', component: CadastroClienteComponent },
 
];
