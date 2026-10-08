import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-funcionario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-funcionario.component.html',
  styleUrl: './login-funcionario.component.css'
})
export class LoginFuncionarioComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  fazerLoginFuncionario(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.value.email.trim().toLowerCase();
    sessionStorage.setItem('funcionarioLogadoEmail', email);
    alert('Login realizado!');

    this.router.navigate(['/painel-funcionario']);

  }

}