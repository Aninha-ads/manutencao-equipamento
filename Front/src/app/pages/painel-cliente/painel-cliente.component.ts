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
  private readonly chaveSolicitacoes = 'solicitacoes';
  filtroEstado = 'TODOS';
  solicitacoes: Solicitacao[] = [];

  //mudei os estados para deixar como no enunciado (aberta, orçada, aprovada, rejeitada, arrumada, paga, finalizada)
  private readonly mockInicial: Solicitacao[] = [
    {
      id: 1,
      dataHora: '2026-06-01T10:30:00',
      equipamento: 'Notebook Dell Inspiron',
      descricao: 'Notebook não liga',
      estado: 'FINALIZADA'//concluida
    },
    {
      id: 2,
      dataHora: '2026-06-28T14:15:00',
      equipamento: 'Impressora HP LaserJet',
      descricao: 'Impressora não está imprimindo',
      estado: 'ARRUMADA' //Em andamento
    },
    {
      id: 3,
      dataHora: '2026-07-09T09:45:00',
      equipamento: 'Monitor LG',
      descricao: 'Monitor apresentando falhas na imagem',
      estado: 'ORCADA' //Pendente
    },
    {
      id: 4,
      dataHora: '2026-08-16T16:40:00',
      equipamento: 'Computador Lenovo ThinkCentre',
      descricao: 'Computador reiniciando sozinho',
      estado: 'ABERTA' //Aguardando atendimento
    },
    {
      id: 5,
      dataHora: '2026-08-20T11:00:00',
      equipamento: 'Teclado Mecânico Redragon',
      descricao: 'Teclas travando ao digitar',
      estado: 'REJEITADA'
    }
  ];

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    const solicitacoesSalvas = localStorage.getItem(this.chaveSolicitacoes);
    let lista:Solicitacao[];

    if (solicitacoesSalvas) {
      lista = JSON.parse(solicitacoesSalvas) as Solicitacao[];
    } else {
      lista = this.mockInicial;
      localStorage.setItem(this.chaveSolicitacoes, JSON.stringify(lista));
    }

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
        return { label: 'Aprovar/Rejeitar', rota: '/orcamentos/mostrar-orcamento' };
      case 'REJEITADA':
        return { label: 'Resgatar Serviço', rota: '/resgatar-servico' };
      case 'ARRUMADA':
        return { label: 'Pagar Serviço', rota: '/pagar-servico' };
      case 'APROVADA':
        return null; 
      default:
        return null; 
    }
  }
}