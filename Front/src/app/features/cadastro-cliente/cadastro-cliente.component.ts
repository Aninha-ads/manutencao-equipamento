import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize } from 'rxjs/operators';

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

  enviando = false;
  erroCep = '';
  erroCadastro = '';
  sucessoCadastro = '';

  private readonly textoObrigatorio: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    return String(control.value ?? '').trim().length > 0
      ? null
      : { apenasEspacos: true };
  };

  // Valida os 11 dígitos do CPF e seus dígitos verificadores.
  private readonly validarCpf: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const cpf = String(control.value ?? '').replace(/\D/g, '');

    if (!cpf) {
      return null;
    }

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
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

    const primeiroDigito = calcularDigito(cpf.substring(0, 9), 10);

    if (primeiroDigito !== Number(cpf[9])) {
      return { cpfInvalido: true };
    }

    const segundoDigito = calcularDigito(cpf.substring(0, 10), 11);

    if (segundoDigito !== Number(cpf[10])) {
      return { cpfInvalido: true };
    }

    return null;
  };

  // Valida a quantidade de dígitos, ignorando a máscara.
  private quantidadeDigitos(quantidade: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = String(control.value ?? '');

      if (!valor) {
        return null;
      }

      const digitos = valor.replace(/\D/g, '');

      return digitos.length === quantidade
        ? null
        : {
            quantidadeDigitos: {
              exigido: quantidade,
              atual: digitos.length
            }
          };
    };
  }

  readonly formulario = this.fb.group({
    nome: this.fb.nonNullable.control('', [
      Validators.required,
      this.textoObrigatorio,
      Validators.maxLength(150)
    ]),

    email: this.fb.nonNullable.control('', [
      Validators.required,
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
      Validators.pattern(/^[a-zA-Z]{2}$/)
    ])
  });

  get cadastroForm() {
    return this.formulario;
  }

  get campos() {
    return this.formulario.controls;
  }

  onSubmit(): void {
    this.cadastrar();
  }

  buscarCep(): void {
    this.consultarCep();
  }

  atualizarUf(uf: string): void {
    const ufMaiuscula = uf.toUpperCase();

    if (uf !== ufMaiuscula) {
      this.formulario.controls.uf.setValue(ufMaiuscula);
    }
  }

  consultarCep(): void {
    const cep = this.formulario.controls.cep.value.replace(/\D/g, '');

    this.erroCep = '';

    if (cep.length !== 8) {
      this.erroCep = 'Informe um CEP válido com 8 dígitos.';
      return;
    }

    this.http
      .get<{
        cep: string;
        logradouro: string;
        bairro: string;
        localidade: string;
        uf: string;
        erro?: boolean;
      }>(`https://viacep.com.br/ws/${cep}/json/`)
      .subscribe({
        next: (resposta) => {
          if (resposta.erro) {
            this.erroCep = 'CEP não encontrado.';
            return;
          }

          this.formulario.patchValue({
            logradouro: resposta.logradouro ?? '',
            bairro: resposta.bairro ?? '',
            cidade: resposta.localidade ?? '',
            uf: resposta.uf ?? ''
          });
        },
        error: () => {
          this.erroCep = 'Não foi possível consultar o CEP. Tente novamente.';
        }
      });
  }

  cadastrar(): void {
    this.erroCadastro = '';
    this.sucessoCadastro = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const dados: ClienteRegistro = {
      ...this.formulario.getRawValue(),
      nome: this.formulario.controls.nome.value.trim(),
      email: this.formulario.controls.email.value.trim(),
      cpf: this.formulario.controls.cpf.value.replace(/\D/g, ''),
      telefone: this.formulario.controls.telefone.value.replace(/\D/g, ''),
      cep: this.formulario.controls.cep.value.replace(/\D/g, ''),
      logradouro: this.formulario.controls.logradouro.value.trim(),
      numero: this.formulario.controls.numero.value.trim(),
      complemento: this.formulario.controls.complemento.value.trim(),
      bairro: this.formulario.controls.bairro.value.trim(),
      cidade: this.formulario.controls.cidade.value.trim(),
      uf: this.formulario.controls.uf.value.trim().toUpperCase()
    };

    this.enviando = true;

    // Ajuste a URL e o formato do payload conforme o contrato da sua API.
    this.http
      .post('/api/clientes', dados)
      .pipe(finalize(() => (this.enviando = false)))
      .subscribe({
        next: () => {
          this.sucessoCadastro = 'Cadastro realizado com sucesso!';
          this.formulario.reset();

          // Se necessário, redirecione para a tela de login.
          // this.router.navigate(['/login']);
        },
        error: (erro) => {
          if (erro.status === 0) {
            this.erroCadastro =
              'Não foi possível conectar ao servidor. Verifique se o backend está funcionando.';
          } else if (erro.status === 409) {
            this.erroCadastro =
              'Já existe um cadastro com esses dados.';
          } else {
            this.erroCadastro =
              erro.error?.message ??
              'Não foi possível realizar o cadastro. Verifique os dados e tente novamente.';
          }
        }
      });
  }
}