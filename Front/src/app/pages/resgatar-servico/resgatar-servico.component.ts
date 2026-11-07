import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { SolicitacaoTela } from '../../core/models/dados-tela.model';
import { AuthService } from '../../core/services/auth.service';

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
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  solicitacao: SolicitacaoTela | undefined;
  motivoRejeicao = '';
  carregando = true;
  salvando = false;
  erro = '';

  ngOnInit(): void {
    void this.carregar();
  }

  async carregar(): Promise<void> {
    this.carregando = true;
    this.erro = '';
    try {
      await this.dados.carregar();
      const pedido = this.dados.buscarSolicitacao(this.route.snapshot.paramMap.get('id'));
      this.solicitacao = this.auth.perfil === 'CLIENTE' && pedido?.clienteId === this.auth.id ? pedido : undefined;
      const entradaRejeicao = this.solicitacao?.historico?.slice().reverse().find(h => h.estado === 'REJEITADA');
      this.motivoRejeicao = entradaRejeicao?.descricao ?? 'Motivo não informado.';
    } catch {
      this.erro = 'Não foi possível carregar a solicitação. Tente novamente.';
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  async resgatarServico(): Promise<void> {
    if (this.salvando || !this.solicitacao || this.solicitacao.estado !== 'REJEITADA') {
      return;
    }

    this.salvando = true;
    this.erro = '';
    try {
      await this.dados.mudarEstado(this.solicitacao.id, 'APROVADA');
      await this.router.navigate(['/painel-cliente']);
    } catch {
      this.erro = 'Não foi possível resgatar a solicitação. Ela pode ter sido devolvida e arquivada. Recarregue os dados antes de tentar novamente.';
    } finally {
      this.salvando = false;
      this.cdr.markForCheck();
    }
  }
}
