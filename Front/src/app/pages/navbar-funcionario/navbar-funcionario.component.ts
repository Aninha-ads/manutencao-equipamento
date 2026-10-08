import { AuthService } from '../../core/services/auth.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-funcionario',
  imports: [RouterLink],
  templateUrl: './navbar-funcionario.component.html',
  styleUrl: './navbar-funcionario.component.css',
})
export class NavbarFuncionarioComponent {
  private auth = inject(AuthService);
  menuAberto = false;
  sair(): void { this.auth.logout(); }
}
