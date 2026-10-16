import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { listarSolicitacoes, SolicitacaoPrototipo } from '../../core/services/solicitacoes-prototipo';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './resgatar-servico.component.html',
  styleUrl: './resgatar-servico.component.css',
})
export class ResgatarServicoComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  solicitacao: SolicitacaoPrototipo | undefined;
  motivoRejeicao = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const solicitacoes = listarSolicitacoes();
    this.solicitacao = solicitacoes.find(s => s.id === Number(id));

    const entradaRejeicao = this.solicitacao?.historico?.slice().reverse().find(h => h.estado === 'REJEITADA');
    this.motivoRejeicao = entradaRejeicao?.descricao ?? 'Motivo não informado.';
  }

  resgatarServico(): void {
    if (!this.solicitacao || this.solicitacao.estado !== 'REJEITADA') {
      return;
    }

    const agora = new Date().toISOString();

    this.solicitacao.estado = 'APROVADA';
    this.solicitacao.historico = [
      ...(this.solicitacao.historico ?? []),
      {
        dataHora: agora,
        estado: 'APROVADA',
        funcionario: '-',
        descricao: 'Solicitação resgatada pelo cliente (de REJEITADA para APROVADA).'
      }
    ];

    const solicitacoes = listarSolicitacoes();
    const index = solicitacoes.findIndex(s => s.id === this.solicitacao!.id);
    solicitacoes[index] = this.solicitacao;
    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

    alert('Solicitação resgatada com sucesso! Ela voltou para o estado APROVADA.');
    this.router.navigate(['/painel-cliente']);
  }
}
