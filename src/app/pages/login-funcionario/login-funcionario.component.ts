import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-funcionario',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login-funcionario.component.html',
  styleUrl: './login-funcionario.component.css'
})
export class LoginFuncionarioComponent {

  email: string = '';
  senha: string = '';

  constructor(private router: Router) {}

  fazerLoginFuncionario(): void {

    console.log('E-mail:', this.email);
    console.log('Senha:', this.senha);

    if (this.email === '' || this.senha === '') {
      alert('Preencha todos os campos!');
      return;
    }

    alert('Login realizado!');

    this.router.navigate(['/painel-funcionario']);

  }

}