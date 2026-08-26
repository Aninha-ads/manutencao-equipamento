import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-visualizacao-solicitacoes',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './visualizacao-solicitacoes.component.html',
  styleUrl: './visualizacao-solicitacoes.component.css'
})
export class VisualizacaoSolicitacoesComponent {
  filtroAtual: string = 'TODAS';
  dataInicio: string = '';
  dataFim: string = '';

  solicitacoes: Solicitacao[] = [
    { id: 1, dataHora: '15/08/2026 10:30', cliente: 'Ana', descricao: 'Tela quebrada', estado: 'ABERTA' },
    { id: 2, dataHora: '16/08/2026 14:00', cliente: 'João', descricao: 'Bateria viciada', estado: 'ORÇADA' },
    { id: 3, dataHora: '18/08/2026 09:15', cliente: 'Maria', descricao: 'Teclado falhando', estado: 'APROVADA' }
  ];

  obterClasseEstado(estado: string): string {
    const mapaCores: { [key: string]: string } = {
      'ABERTA': 'badge-cinza',
      'ORÇADA': 'badge-marrom',
      'REJEITADA': 'badge-vermelho',
      'APROVADA': 'badge-amarelo',
      'REDIRECIONADA': 'badge-roxo',
      'ARRUMADA': 'badge-azul',
      'PAGA': 'badge-alaranjado',
      'FINALIZADA': 'badge-verde'
    };
    return mapaCores[estado] || 'badge-secondary';
  }
}