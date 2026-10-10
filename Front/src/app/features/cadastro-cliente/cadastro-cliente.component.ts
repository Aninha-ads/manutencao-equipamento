import { Component, inject } from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule,
 ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

export interface ClienteRegistro {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}
//vira ReactiveFromsModule
@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css',
})
export class CadastroClienteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  enviando = false;
  erroCep = '';

  // Rejeita campos vazios ou preenchidos apenas com espaços.
  private readonly textoObrigatorio: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return String(control.value ?? '').trim().length > 0
      ? null
      : { apenasEspacos: true };
  };
 //Critérios para o CPF:
  // Valida se o CPF possui 11 dígitos e dois dígitos verificadores corretos.
  private readonly validarCpf: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const cpf = String(control.value ?? '').replace(/\D/g, '');

    if (!cpf) {
      return null; // O Validators.required verifica se está vazio.
    }
    if (cpf.length !== 11) {
      return { cpfInvalido: true };
    }
    // Bloqueia CPFs com todos os dígitos iguais.
    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalido: true };
    }
    const calcularDigito = (
      numeros: string,
      pesoInicial: number
    ): number => {
      let soma = 0;

      for (let i = 0; i < numeros.length; i++) {
        soma += Number(numeros[i]) * (pesoInicial - i);
      }

      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    };

    // Primeiro dígito: pesos 10, 9, 8, ..., 2.
    const primeiroDigito = calcularDigito(cpf.substring(0, 9), 10);
    if (primeiroDigito !== Number(cpf[9])) {
      return { cpfInvalido: true };
    }

    // Segundo dígito: pesos 11, 10, 9, ..., 2.
    const segundoDigito = calcularDigito(cpf.substring(0, 10), 11);

    if (segundoDigito !== Number(cpf[10])) {
      return { cpfInvalido: true };
    }

    return null;
  };

  // Exige uma quantidade exata de dígitos, ignorando a máscara.
  private quantidadeDigitos(quantidade: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = String(control.value ?? '');
      if (!valor) {
        return null;
      }

      const digitos = valor.replace(/\D/g, '');

      return digitos.length === quantidade
        ? null
        : { quantidadeDigitos: { esperada: quantidade } };
    };
  }

  cadastroForm = this.fb.group({
    nome: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(150)
    ]),

    email: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.email,
      Validators.maxLength(254)
    ]),

    cpf: this.fb.nonNullable.control('', [
      Validators.required,
      this.validarCpf
    ]),

    telefone: this.fb.nonNullable.control('', [
      Validators.required,
      this.quantidadeDigitos(11)
    ]),

    cep: this.fb.nonNullable.control('', [
      Validators.required,
      this.quantidadeDigitos(8)
    ]),

    logradouro: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(200)
    ]),

    numero: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(20)
    ]),

    complemento: this.fb.nonNullable.control('', [
      Validators.maxLength(150)
    ]),

    bairro: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(100)
    ]),

    cidade: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(100)
    ]),

    uf: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{2}$/)
    ])
  });

  get campos() {
    return this.cadastroForm.controls;
  }

  buscarCep(): void {
    const controleCep = this.campos.cep;
    const cepLimpo = controleCep.value.replace(/\D/g, '');

    this.erroCep = '';

    if (cepLimpo.length !== 8) {
      controleCep.markAsTouched();
      controleCep.updateValueAndValidity();
      return;
    }

    this.http
      .get<{
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
        uf?: string;
      }>(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .subscribe({
        next: (dados) => {
          if (dados.erro) {
            this.erroCep = 'CEP não encontrado.';
            return;
          }

          this.cadastroForm.patchValue({
            logradouro: dados.logradouro ?? '',
            bairro: dados.bairro ?? '',
            cidade: dados.localidade ?? '',
            uf: dados.uf ?? ''
          });
        },
        error: () => {
          this.erroCep = 'Não foi possível consultar o CEP. Tente novamente.';
        }
      });
  }

  atualizarUf(valor: string): void {
    const uf = valor
      .replace(/[^a-zA-Z]/g, '')
      .slice(0, 2)
      .toUpperCase();

    if (this.campos.uf.value !== uf) {
      this.campos.uf.setValue(uf);
    }
  }

  private gerarSenhaAleatoria(): string {
    // Mantém o comportamento do protótipo atual.
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  onSubmit(): void {
    if (this.cadastroForm.invalid || this.enviando) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    const dados = this.cadastroForm.getRawValue();

    const cliente: ClienteRegistro = {
      ...dados,
      nome: dados.nome.trim(),
      email: dados.email.trim(),
      cpf: dados.cpf.replace(/\D/g, ''),
      telefone: dados.telefone.replace(/\D/g, ''),
      cep: dados.cep.replace(/\D/g, ''),
      logradouro: dados.logradouro.trim(),
      numero: dados.numero.trim(),
      complemento: dados.complemento.trim(),
      bairro: dados.bairro.trim(),
      cidade: dados.cidade.trim(),
      uf: dados.uf.toUpperCase()
    };

    const payloadParaSalvar = {
      ...cliente,
      senha: this.gerarSenhaAleatoria()
    };
//PARTE PROVISÓRIA: 
    // Ainda não há envio para o backend neste método.
    console.log('Dados validados para cadastro:', payloadParaSalvar);

    alert('Validação concluída! O cadastro ainda precisa ser integrado ao backend.');

    // Removam este redirecionamento de teste quando implementar a API pfv
    // this.router.navigate(['/painel-cliente']);
  }
}