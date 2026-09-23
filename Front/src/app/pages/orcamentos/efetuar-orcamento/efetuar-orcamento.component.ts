import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [FormsModule, RouterLink],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrl: './efetuar-orcamento.component.css',
})
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

  valorOrcamento = '';

  registrarOrcamento(): void {
    const valor = Number(this.valorOrcamento.replace(',', '.'));

    if (!this.valorOrcamento.trim() || Number.isNaN(valor) || valor <= 0) {
      alert('Informe um valor de orçamento válido.');
      return;
    }

    alert(`Orçamento de R$ ${valor.toFixed(2).replace('.', ',')} registrado com sucesso!`);
  }
}
