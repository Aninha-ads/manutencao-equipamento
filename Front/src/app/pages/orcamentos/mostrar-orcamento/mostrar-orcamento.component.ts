import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DadosService } from '../../../core/services/dados.service';
import { SolicitacaoTela } from '../../../core/models/dados-tela.model';

@Component({
  selector: 'app-mostrar-orcamento',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './mostrar-orcamento.component.html',
  styleUrl: './mostrar-orcamento.component.css',
})
export class MostrarOrcamentoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dados = inject(DadosService);
  private fb = inject(FormBuilder);

  solicitacao: SolicitacaoTela | undefined;
  mostrandoRejeicao = false;

  rejeicaoForm = this.fb.group({
    motivo: ['', Validators.required]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.solicitacao = this.dados.buscarSolicitacao(id);
  }

  // RF006/RF007: só é permitido agir sobre solicitações ORÇADA.
  get permissaoValida(): boolean {
    return this.solicitacao?.estado === 'ORCADA';
  }

  async aprovarServico(): Promise<void> {
    if (!this.solicitacao || !this.permissaoValida) {
      return;
    }

    await this.dados.mudarEstado(this.solicitacao.id, 'APROVADA');

    const valorFormatado = (this.solicitacao.valorOrcamento ?? 0).toFixed(2).replace('.', ',');
    alert(`Serviço Aprovado no Valor R$ ${valorFormatado}`);
    this.router.navigate(['/painel-cliente']);
  }

  abrirRejeicao(): void {
    this.mostrandoRejeicao = true;
  }

  cancelarRejeicao(): void {
    this.mostrandoRejeicao = false;
    this.rejeicaoForm.reset();
  }

  async confirmarRejeicao(): Promise<void> {
    if (!this.solicitacao || !this.permissaoValida) {
      return;
    }
    if (this.rejeicaoForm.invalid) {
      this.rejeicaoForm.markAllAsTouched();
      return;
    }

    const motivo = this.rejeicaoForm.value.motivo!.trim();

    await this.dados.mudarEstado(this.solicitacao.id, 'REJEITADA');
    // PENDENTE: o motivo da rejeição ainda não está sendo enviado ao back-end.
    // mudarEstado(id, estado, autorId?) não aceita esse campo — confirmar com
    // o DadosController.java se existe outro parâmetro/endpoint para isso.
    console.log('Motivo informado (ainda não enviado ao back-end):', motivo);

    alert('Serviço Rejeitado');
    this.router.navigate(['/painel-cliente']);
  }
}