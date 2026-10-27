import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { SolicitacaoTela } from '../../core/models/dados-tela.model';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resgatar-servico.component.html',
  styleUrl: './resgatar-servico.component.css',
})
export class ResgatarServicoComponent implements OnInit{
  private dados = inject(DadosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacao: SolicitacaoTela | undefined;
  motivoRejeicao = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const solicitacoes = this.dados.listarSolicitacoes();
    this.solicitacao = solicitacoes.find(s => s.id === Number(id));

    const entradaRejeicao = this.solicitacao?.historico?.slice().reverse().find(h => h.estado === 'REJEITADA');
    this.motivoRejeicao = entradaRejeicao?.descricao ?? 'Motivo não informado.';
  }

  async resgatarServico(): Promise<void> {
    if (!this.solicitacao || this.solicitacao.estado !== 'REJEITADA') {
      return;
    }

    try {
      await this.dados.mudarEstado(this.solicitacao.id, 'APROVADA');
    } catch {
      alert('Não foi possível resgatar a solicitação no banco. Tente novamente.');
      return;
    }
    alert('Solicitação resgatada com sucesso! Ela voltou para o estado APROVADA.');
    this.router.navigate(['/painel-cliente']);
  }
}
