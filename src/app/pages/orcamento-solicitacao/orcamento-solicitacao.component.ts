import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface SolicitacaoManutencao {
  id: number;
  dataHora: string;
  categoria: string;
  equipamento: string;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-orcamento-solicitacao',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './orcamento-solicitacao.component.html',
  styleUrl: './orcamento-solicitacao.component.css',
})
export class OrcamentoSolicitacaoComponent implements OnInit {
  private readonly chaveSolicitacoes = 'solicitacoes';

  solicitacaoId = 0;
  categoria = '';
  equipamento = '';
  descricao = '';
  categorias = ['Notebook', 'Impressora', 'Desktop', 'Monitor', 'Outro'];

  private router = inject(Router);

  ngOnInit(): void {
    const solicitacoes = this.carregarSolicitacoes();
    this.solicitacaoId = solicitacoes.length === 0
      ? 1
      : Math.max(...solicitacoes.map(solicitacao => solicitacao.id)) + 1;
  }

  salvarSolicitacao(): void {
    const equipamentoInformado = this.equipamento.trim();
    const descricaoInformada = this.descricao.trim();

    if (!this.categoria || !equipamentoInformado || !descricaoInformada) {
      alert('Preencha a categoria, o equipamento e os detalhes da solicitação.');
      return;
    }

    const solicitacoes = this.carregarSolicitacoes();
    const novaSolicitacao: SolicitacaoManutencao = {
      id: this.solicitacaoId,
      dataHora: new Date().toISOString(),
      categoria: this.categoria,
      equipamento: equipamentoInformado,
      descricao: descricaoInformada,
      estado: 'Pendente'
    };

    solicitacoes.push(novaSolicitacao);
    localStorage.setItem(this.chaveSolicitacoes, JSON.stringify(solicitacoes));
    alert('Sua solicitação de orçamento foi enviada com sucesso!');
    this.router.navigate(['/painel-cliente']);
  }

  private carregarSolicitacoes(): SolicitacaoManutencao[] {
    const solicitacoesSalvas = localStorage.getItem(this.chaveSolicitacoes);
    return solicitacoesSalvas
      ? JSON.parse(solicitacoesSalvas) as SolicitacaoManutencao[]
      : [];
  }
}
