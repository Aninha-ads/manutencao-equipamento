import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
//seguindo o slide(279) do professor
//decidi tirar o NavbarComponent pois ele não vai ser mais utilizado
/*import { NavbarComponent } from './pages/navbar/navbar.component';*/
import { FooterComponent } from './pages/footer/footer.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { NavbarFuncionarioComponent } from './pages/navbar-funcionario/navbar-funcionario.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavbarComponent, NavbarFuncionarioComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('manutencao-equipamento');

  constructor(public router: Router) {}

  get mostrarMenu(): boolean {
    return !['/', '/login', '/login-funcionario', '/home', '/cadastro'].includes(this.router.url.split('?')[0]);
  }

  get menuFuncionario(): boolean {
    const origem = this.router.parseUrl(this.router.url).queryParams['origem'];
    return origem === 'painel-funcionario' || origem === 'visualizacao-solicitacoes'
      || ['/painel-funcionario', '/visualizacao-solicitacoes', '/orcamentos/efetuar',
          '/manutencoes/', '/manter-funcionarios', '/categoria', '/relatorios']
          .some(rota => this.router.url.startsWith(rota));
  }

}
