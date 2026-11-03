import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { DadosService } from '../../core/services/dados.service';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  equipamento: string;
  estado: EstadoSolicitacao;
}

@Component({
  selector: 'app-painel-funcionario',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './painel-funcionario.component.html',
  styleUrl: './painel-funcionario.component.css'
})
export class PainelFuncionarioComponent {
  private dados = inject(DadosService);
  private registros = signal(this.dados.listarSolicitacoes());
  erro = signal('');
  processando = signal<number | null>(null);

  get solicitacoes(): Solicitacao[] {
    return this.registros()
      .filter(s => ['ABERTA', 'APROVADA', 'REJEITADA'].includes(s.estado))
      .map(s => ({ ...s, cliente: s.cliente ?? 'Não informado' }));
  }

  async devolver(solicitacao: Solicitacao): Promise<void> {
    if (this.processando() !== null || solicitacao.estado !== 'REJEITADA') return;
    if (!confirm('Confirmar a devolução do equipamento e arquivar esta solicitação rejeitada, sem manutenção?')) return;
    this.erro.set('');
    this.processando.set(solicitacao.id);
    try {
      await this.dados.mudarEstado(solicitacao.id, 'FINALIZADA');
      this.registros.set(this.dados.listarSolicitacoes());
    } catch {
      this.erro.set('Não foi possível devolver e arquivar a solicitação. Atualize os dados e tente novamente.');
    } finally {
      this.processando.set(null);
    }
  }

  limitarDescricao(descricao: string): string {
    if (descricao.length <= 30) {
      return descricao;
    }

    return descricao.substring(0, 30) + '...';
  }

}
