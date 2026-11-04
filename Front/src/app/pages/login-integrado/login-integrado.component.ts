import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginApiService, mensagemErroLogin } from '../../core/services/login-api.service';
import { rotaInicial } from '../../core/utils/rota-por-perfil';

/** Tela de login (RF002) ligada ao back-end. Redireciona conforme o perfil devolvido pela API. */
@Component({
  selector: 'app-login-integrado',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login-integrado.component.html',
  styleUrl: './login-integrado.component.css',
})
export class LoginIntegradoComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private api = inject(LoginApiService);

  enviando = false;
  erro = '';

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.erro = '';
    const { email, senha } = this.form.getRawValue();

    this.api.entrar(email, senha).subscribe({
      next: (sessao) => {
        this.enviando = false;
        this.router.navigate([rotaInicial(sessao.perfil)]);
      },
      error: (e) => {
        this.enviando = false;
        this.erro = mensagemErroLogin(e);
      },
    });
  }
}
