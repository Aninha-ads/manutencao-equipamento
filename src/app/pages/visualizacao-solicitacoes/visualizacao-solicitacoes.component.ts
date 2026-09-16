import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  descricao: string;
  estado: string;
  funcionarioDestinoId?: number;
}

@Component({
  selector: 'app-visualizacao-solicitacoes',
  standalone: true,
  imports: [FormsModule, RouterLink],
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
  { id: 3, dataHora: '18/08/2026 09:15', cliente: 'Maria', descricao: 'Teclado falhando', estado: 'APROVADA' },
  { id: 4, dataHora: '19/08/2026 11:20', cliente: 'Carlos', descricao: 'Notebook não liga', estado: 'REJEITADA' },
  { id: 5, dataHora: '20/08/2026 15:45', cliente: 'Fernanda', descricao: 'Carregador não funciona', estado: 'REDIRECIONADA', funcionarioDestinoId: 1 },
  { id: 6, dataHora: '21/08/2026 08:30', cliente: 'Pedro', descricao: 'Computador reiniciando sozinho', estado: 'ARRUMADA' },
  { id: 7, dataHora: '22/08/2026 13:10', cliente: 'Juliana', descricao: 'Mouse não reconhecido', estado: 'PAGA' },
  { id: 8, dataHora: '23/08/2026 16:25', cliente: 'Rafael', descricao: 'Sistema muito lento', estado: 'FINALIZADA' },
  { id: 9, dataHora: '24/08/2026 10:05', cliente: 'Patrícia', descricao: 'Monitor sem imagem', estado: 'ABERTA' },
  { id: 10, dataHora: '25/08/2026 09:40', cliente: 'Lucas', descricao: 'HD fazendo ruído', estado: 'ORÇADA' },
  { id: 11, dataHora: '26/08/2026 14:35', cliente: 'Amanda', descricao: 'Wi-Fi não conecta', estado: 'APROVADA' },
  { id: 12, dataHora: '27/08/2026 17:00', cliente: 'Bruno', descricao: 'Entrada USB danificada', estado: 'REJEITADA' },
  { id: 13, dataHora: '28/08/2026 11:50', cliente: 'Camila', descricao: 'Webcam não funciona', estado: 'REDIRECIONADA', funcionarioDestinoId: 2 },
  { id: 14, dataHora: '29/08/2026 08:55', cliente: 'Marcos', descricao: 'Superaquecimento do notebook', estado: 'ARRUMADA' },
  { id: 15, dataHora: '30/08/2026 15:20', cliente: 'Beatriz', descricao: 'Teclas não respondem', estado: 'PAGA' },
  { id: 16, dataHora: '31/08/2026 12:15', cliente: 'Gustavo', descricao: 'Computador não reconhece HD', estado: 'FINALIZADA' },
  { id: 17, dataHora: '01/09/2026 09:25', cliente: 'Larissa', descricao: 'Tela piscando', estado: 'ABERTA' },
  { id: 18, dataHora: '02/09/2026 14:50', cliente: 'Diego', descricao: 'Ventoinha com ruído excessivo', estado: 'ORÇADA' },
  { id: 19, dataHora: '03/09/2026 10:10', cliente: 'Renata', descricao: 'Bluetooth não funciona', estado: 'APROVADA' },
  { id: 20, dataHora: '04/09/2026 16:40', cliente: 'Felipe', descricao: 'Notebook desligando sozinho', estado: 'FINALIZADA' }
];

  erroFiltro = '';
  private filtroAplicado = 'TODAS';
  private inicioAplicado = '';
  private fimAplicado = '';
  // Funcionário simulado para demonstrar a regra de redirecionamento do RF013.
  funcionarioLogadoId: number | null = 1;

  dataAbertura(valor: string): Date {
    const p = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(valor);
    return p ? new Date(+p[3], +p[2] - 1, +p[1], +p[4], +p[5]) : new Date(valor);
  }

  formatarData(valor: string): string {
    return this.dataAbertura(valor).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  estadoAtual(solicitacao: Solicitacao): string {
    const estado = solicitacao.estado.toUpperCase();
    return ['PENDENTE', 'AGUARDANDO ATENDIMENTO'].includes(estado) ? 'ABERTA' : estado;
  }

  aplicarFiltro(): void {
    this.erroFiltro = '';
    if (this.filtroAtual === 'PERIODO' && (!this.dataInicio || !this.dataFim || this.dataInicio > this.dataFim)) {
      this.erroFiltro = 'Informe início e fim válidos, com início anterior ou igual ao fim.';
      return;
    }
    this.filtroAplicado = this.filtroAtual;
    this.inicioAplicado = this.dataInicio;
    this.fimAplicado = this.dataFim;
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const amanha = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
    return this.solicitacoes.filter(s => {
      if (this.estadoAtual(s) === 'REDIRECIONADA' &&
          (this.funcionarioLogadoId === null || s.funcionarioDestinoId !== this.funcionarioLogadoId)) return false;
      const data = this.dataAbertura(s.dataHora);
      if (this.filtroAplicado === 'HOJE') return data >= inicioHoje && data < amanha;
      if (this.filtroAplicado === 'PERIODO') {
        const inicio = new Date(this.inicioAplicado + 'T00:00:00');
        const fim = new Date(this.fimAplicado + 'T00:00:00');
        fim.setDate(fim.getDate() + 1);
        return data >= inicio && data < fim;
      }
      return true;
    }).sort((a, b) => this.dataAbertura(a.dataHora).getTime() - this.dataAbertura(b.dataHora).getTime());
  }

  finalizarSolicitacao(solicitacao: Solicitacao): void {
    if (this.estadoAtual(solicitacao) !== 'PAGA' || !confirm('Finalizar esta solicitação?')) return;
    solicitacao.estado = 'FINALIZADA';
  }

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
