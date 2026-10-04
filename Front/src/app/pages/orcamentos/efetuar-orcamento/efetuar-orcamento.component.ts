import { Component } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators, AbstractControl,
  ValidationErrors} from '@angular/forms';
import { RouterLink } from '@angular/router';

interface SolicitacaoOrcamento {
  dataHora: string;
  categoria: string;
  estado: string;
  equipamento: string;
  defeito: string;
}

interface Cliente {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
}
//troca forms Module para Reactive FormsModule
@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrl: './efetuar-orcamento.component.css',
})
//aparece ainda o default que estava colocado antes
export class EfetuarOrcamentoComponent {
  solicitacao: SolicitacaoOrcamento = {
    dataHora: '20/08/2026 14:30',
    categoria: 'Notebook',
    estado: 'ABERTA',
    equipamento: 'Notebook Dell Inspiron 15',
    defeito: 'Notebook não liga e não apresenta nenhum sinal ao pressionar o botão de energia.'
  };

  cliente: Cliente = {
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    email: 'joao@email.com',
    telefone: '(41) 99999-9999',
    endereco: 'Rua das Flores, 100 - Centro - Curitiba/PR - CEP 80000-000'
  };

  // Aceita valores positivos com até duas casas decimais.
  valorPositivo(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;

    if (valor === null || valor === '') {
      return null;
    }

    // Aceita vírgula ou ponto como separador decimal.
    const texto = String(valor).trim().replace(',', '.');

    // Impede letras, sinais, valores negativos e mais de 2 casas decimais.
    if (!/^\d+(\.\d{1,2})?$/.test(texto)) {
      return { formatoInvalido: true };
    }

    const numero = Number(texto);

    if (!Number.isFinite(numero) || numero <= 0) {
      return { valorPositivo: true };
    }

    return null;
  }

orcamentoForm;

constructor(private fb: FormBuilder) {
  this.orcamentoForm = this.fb.group({
    valorOrcamento: [
      '',
      [
        Validators.required,
        this.valorPositivo.bind(this)
      ]
    ]
  });
}

  get valorOrcamento() {
    return this.orcamentoForm.controls.valorOrcamento; }

  registrarOrcamento(): void {
    if (this.orcamentoForm.invalid) {
      this.orcamentoForm.markAllAsTouched();
      return;
    }

    const texto = String(this.valorOrcamento.value).trim().replace(',', '.');
    const valor = Number(texto);

    alert(
      `Orçamento de R$ ${valor.toFixed(2).replace('.', ',')} registrado com sucesso!`
    );

    console.log('Valor registrado:', valor);
  }
}