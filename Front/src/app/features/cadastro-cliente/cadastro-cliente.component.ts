import { Component, inject } from '@angular/core';
import {AbstractControl, FormBuilder, ReactiveFormsModule,
 ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../services/auth.service';

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
  private readonly authService = inject(AuthService);

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
      return resto < 2 ? 0 : 11resto;
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

    numero: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(20)
    ]),

    complemento: this.fb.nonNullable.control('', [
      Validators.maxLength(150)
   ]),

    bairro: this.fb.nonNullable.