import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-funcionario',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login-funcionario.component.html',
  styleUrl: './login-funcionario.component.css'
})
export class LoginFuncionarioComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  erroLogin = '';
  enviando = false;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  async fazerLoginFuncionario(): Promise<void> {
    this.erroLogin = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    try {
      const sessao = await firstValueFrom(this.auth.login(
        this.form.controls['email'].value.trim(),
        this.form.controls['senha'].value
      ));
      await this.router.navigate([
        sessao.perfil === 'FUNCIONARIO' ? '/painel-funcionario' : '/painel-cliente'
      ]);
    } catch {
      this.erroLogin = 'E-mail ou senha inválidos, ou serviço indisponível.';
    } finally {
      this.enviando = false;
    }
  }
}
