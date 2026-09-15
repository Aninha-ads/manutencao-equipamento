import { Component } from '@angular/core';
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
export class PainelClienteComponent {
  private readonly chaveSolicitacoes = 'solicitacoes';
  filtroEstado = 'TODOS';

  solicitacoes: Solicitacao[] = [
    {
      id: 1,
      dataHora: '2026-06-01T10:30:00',
      equipamento: 'Notebook Dell Inspiron',
      descricao: 'Notebook não liga',
      estado: 'Concluída'
    },
    {
      id: 2,
      dataHora: '2026-06-28T14:15:00',
      equipamento: 'Impressora HP LaserJet',
      descricao: 'Impressora não está imprimindo',
      estado: 'Em andamento'
    },
    {
      id: 3,
      dataHora: '2026-07-09T09:45:00',
      equipamento: 'Monitor LG',
      descricao: 'Monitor apresentando falhas na imagem',
      estado: 'Pendente'
    },
    {
      id: 4,
      dataHora: '2026-08-16T16:40:00',
      equipamento: 'Computador Lenovo ThinkCentre',
      descricao: 'Computador reiniciando sozinho',
      estado: 'Aguardando atendimento'
    }
  ];

  constructor() {
    const solicitacoesSalvas = localStorage.getItem(this.chaveSolicitacoes);

    if (solicitacoesSalvas) {
      this.solicitacoes = JSON.parse(solicitacoesSalvas) as Solicitacao[];
    } else {
      localStorage.setItem(this.chaveSolicitacoes, JSON.stringify(this.solicitacoes));
    }
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
}