import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
/*pelo que eu pesquisei, aqui 'informa' meu angular de que essa aplicação é um componente*/
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

/*pelo que vi, em typescript, uma classe assim faz o trabalho dum eventbutton,
por enquanto, basicamente ele mostra uma mensagenzinha depois de um login com sucesso
(que agora é todo login pq não tá pronto)
e se não preencher os campos, ele manda preencher com outro alerta.
*/
export class LoginComponent {

  email: string = '';
  senha: string = '';

  fazerLogin(): void {
    console.log('E-mail:', this.email);
    console.log('Senha:', this.senha);

    if (this.email === '' || this.senha === '') {
      alert('Preencha todos os campos!');
      return;
    }

    alert('Login realizado!');
  }
}