import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalRejeitarServicoComponent } from './modal-rejeitar-servico/modal-rejeitar-servico.component';
import { DadosService } from '../../core/services/dados.service';
import { AuthService } from '../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-visualizar-servico', standalone: true, imports: [RouterLink, DatePipe],
  templateUrl: './visualizar-servico.component.html', styleUrl: './visualizar-servico.component.css'
})
export class VisualizarServicoComponent {
  private dados = inject(DadosService);
  private auth = inject(AuthService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  erro = '';
  
  solicitacao = this.carregar();
  historico = this.ordenar(this.solicitacao?.historico);
  get interfaceFuncionario(): boolean {
    return this.route.snapshot.data['interfaceFuncionario'] === true;
  }
  get rotaVoltar(): string {
    const origem = this.route.snapshot.queryParamMap.get('origem');
    if (this.interfaceFuncionario) {
      return origem === 'visualizacao-solicitacoes' ? '/visualizacao-solicitacoes' : '/painel-funcionario';
    }
    return origem === 'painel-funcionario' || origem === 'visualizacao-solicitacoes'
      ? '/' + origem : '/painel-cliente';
  }
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => {
      void this.atualizarRegistro();
    });
  }

  private async atualizarRegistro(): Promise<void> {
    this.erro = '';
    try {
      await this.dados.carregar();
      this.solicitacao = this.carregar();
      this.historico = this.ordenar(this.solicitacao?.historico);
    } catch {
      this.erro = 'Não foi possível atualizar os dados e as datas do histórico. Tente abrir o pedido novamente.';
    }
    this.cdr.markForCheck();
  }

  private carregar() {
    const registro = this.dados.buscarSolicitacao(this.route.snapshot.paramMap.get('id'));
    if (!registro || !this.temAcesso(registro.clienteId)) return undefined;
    return {
      ...registro,
      categoria: registro.categoria ?? 'Não informada',
      cliente: registro.cliente ?? 'Não informado', 
      email: registro.email ?? 'Não informado',
      telefone: registro.telefone ?? 'Não informado', 
      defeito: registro.descricao
    };
  }

  private ordenar<T extends { dataHora: string }>(lista: T[] = []): T[] {
    return [...lista].sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }

  private temAcesso(clienteId?: number): boolean {
    const sessao = this.auth.sessao();
    if (sessao?.perfil !== 'CLIENTE') return true;
    return clienteId === undefined || clienteId === sessao.id;
  }

  get podeRejeitar(): boolean {
    return !this.interfaceFuncionario && this.solicitacao?.estado === 'ORCADA' && this.auth.perfil === 'CLIENTE';
  }

  async devolverArquivar(): Promise<void> {
    if (!this.interfaceFuncionario || this.auth.perfil !== 'FUNCIONARIO' || this.solicitacao?.estado !== 'REJEITADA') return;
    if (!confirm('Confirmar a devolução do equipamento e arquivar o pedido sem manutenção ou pagamento? O cliente não poderá mais resgatá-lo.')) return;
    try {
      await this.dados.mudarEstado(this.solicitacao.id, 'FINALIZADA');
      this.solicitacao = this.carregar();
      this.historico = this.ordenar(this.solicitacao?.historico);
    } catch {
      this.erro = 'Não foi possível arquivar o pedido. Reabra os detalhes para conferir o estado atual.';
    }
    this.cdr.markForCheck();
  }
  
  async abrirModalRejeitar(): Promise<void> {
    if (!this.podeRejeitar || !this.solicitacao) return;
    const id = this.solicitacao.id;
    const modalRef = this.modalService.open(ModalRejeitarServicoComponent);
    let motivo: string;
    try {
      motivo = await modalRef.result;
    } catch {
      return;
    }
    this.erro = '';
    try {
      await this.dados.mudarEstado(id, 'REJEITADA', { motivoRejeicao: motivo });
      this.solicitacao = this.carregar();
      this.historico = this.ordenar(this.solicitacao?.historico);
    } catch {
      this.erro = 'Não foi possível registrar a rejeição. Confira o estado atual do pedido e tente novamente.';
    }
    this.cdr.markForCheck();
  }
}
