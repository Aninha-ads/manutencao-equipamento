import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { DadosService } from '../../core/services/dados.service';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  descricao: string;
  estado: EstadoSolicitacao;
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
  private dados = inject(DadosService);
  filtroAtual: string = 'TODAS';
  dataInicio: string = '';
  dataFim: string = '';

  solicitacoes: Solicitacao[] = this.dados.listarSolicitacoes().map(s => ({ ...s, cliente: s.cliente ?? 'Não informado' }));

  erroFiltro = '';
  private filtroAplicado = 'TODAS';
  private inicioAplicado = '';
  private fimAplicado = '';
  // Funcionário simulado para demonstrar a regra de redirecionamento do RF013.
  funcionarioLogadoId: number | null = this.dados.listarFuncionarios()[0]?.id ?? null;

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
    return solicitacao.estado;
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

  async finalizarSolicitacao(solicitacao: Solicitacao): Promise<void> {
    if (this.estadoAtual(solicitacao) !== 'PAGA' || !confirm('Finalizar esta solicitação?')) return;
    try {
      await this.dados.mudarEstado(solicitacao.id, 'FINALIZADA');
      this.solicitacoes = this.dados.listarSolicitacoes().map(s => ({ ...s, cliente: s.cliente ?? '' }));
    } catch {
      alert('Não foi possível finalizar a solicitação no banco. Tente novamente.');
    }
  }

  obterClasseEstado(estado: string): string {
    const mapaCores: { [key: string]: string } = {
      'ABERTA': 'badge-cinza',
      'ORCADA': 'badge-marrom',
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
