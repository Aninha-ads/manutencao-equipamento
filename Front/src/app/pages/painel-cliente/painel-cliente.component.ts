import { listarSolicitacoes } from '../../core/services/solicitacoes-prototipo';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Solicitacao {
  id: number;
  dataHora: string;
  equipamento: string;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-painel-cliente',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './painel-cliente.component.html',
  styleUrl: './painel-cliente.component.css',
})
export class PainelClienteComponent implements OnInit{
  filtroEstado = 'TODOS';
  solicitacoes: Solicitacao[] = [];

  //mudei os estados para deixar como no enunciado (aberta, orçada, aprovada, rejeitada, arrumada, paga, finalizada)
  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    const lista = listarSolicitacoes();

    //lista ordenada, data/hora
    this.solicitacoes = [...lista].sort(
      (a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );
  }

  get estados(): string[] {
    return ['TODOS', ...new Set(this.solicitacoes.map(solicitacao => solicitacao.estado))];
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    if (this.filtroEstado === 'TODOS') {
      return this.solicitacoes;
    }

    return this.solicitacoes.filter(
      solicitacao => solicitacao.estado === this.filtroEstado
    );
  }

  equipamentoResumido(equipamento: string):string {
    return equipamento.length > 30
    ? equipamento.substring(0, 30) + '...' 
    : equipamento;
  }

  acaoPara(estado: string): {label: string; rota: string} | null {
    switch (estado) {
      case 'ORCADA':
        return { label: 'Aprovar/Rejeitar', rota: '/visualizar-servico' };
      case 'REJEITADA':
        return { label: 'Resgatar Serviço', rota: '/visualizar-servico' };
      case 'ARRUMADA':
        return { label: 'Pagar Serviço', rota: '/visualizar-servico' };
      case 'APROVADA':
        return null; 
      default:
        return null; 
    }
  }
}
