import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { DadosService } from '../../core/services/dados.service';
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Solicitacao {
  id: number;
  dataHora: string;
  equipamento: string;
  descricao: string;
  estado: EstadoSolicitacao;
}

@Component({
  selector: 'app-painel-cliente',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './painel-cliente.component.html',
  styleUrl: './painel-cliente.component.css',
})
export class PainelClienteComponent implements OnInit{
  private dados = inject(DadosService);
  filtroEstado = 'TODOS';
  solicitacoes: Solicitacao[] = [];

  //mudei os estados para deixar como no enunciado (aberta, orçada, aprovada, rejeitada, arrumada, paga, finalizada)
  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    //const lista = this.dados.listarSolicitacoes();

    //lista ordenada, data/hora
    this.solicitacoes = this.dados.listarSolicitacoes().sort(
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
      case 'APROVADA':
        return null; 
      default:
        return null; 
    }
  }

  async pagarServico(id: number): Promise<void> {
    try {
      await this.dados.mudarEstado(id, 'PAGA');
      this.carregarSolicitacoes();
    } catch {
      alert('Não foi possível registrar o pagamento. Verifique a solicitação e tente novamente.');
    }
  }
}
