import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro-funcionario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cadastro-funcionario.component.html'
})
export class CadastroFuncionarioComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  erro = '';
  enviando = false;
  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    dataNascimento: ['', Validators.required]
  });

  async cadastrar(): Promise<void> {
    this.erro = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando = true;
    try {
      const { nome, email, senha, dataNascimento } = this.form.getRawValue();
      await firstValueFrom(this.auth.registrarFuncionario({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        nascimento: dataNascimento
      }));
      await this.router.navigate(['/painel-funcionario']);
    } catch {
      this.erro = 'Não foi possível criar a conta. Verifique os dados ou se o e-mail já está cadastrado.';
    } finally {
      this.enviando = false;
    }
  }
}
