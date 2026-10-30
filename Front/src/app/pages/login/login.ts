import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
/*pelo que eu pesquisei, aqui 'informa' meu angular de que essa aplicação é um componente*/
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

// O backend identifica o perfil e a resposta determina o painel de destino.
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  erroLogin = signal('');
  enviando = signal(false);

  form: FormGroup = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  async fazerLogin(): Promise<void> {
    if (this.enviando()) return;
    this.erroLogin.set('');
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    try {
      const sessao = await firstValueFrom(this.auth.login(
        this.form.controls['email'].value.trim(),
        this.form.controls['senha'].value
      ));
      await this.router.navigate([
        sessao.perfil === 'FUNCIONARIO' ? '/painel-funcionario' : '/painel-cliente'
      ]);
    } catch {
      this.erroLogin.set('E-mail ou senha inválidos, ou serviço indisponível.');
    } finally {
      this.enviando.set(false);
    }
  }
}
