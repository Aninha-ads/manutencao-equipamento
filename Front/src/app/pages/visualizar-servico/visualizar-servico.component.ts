import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalRejeitarServicoComponent } from './modal-rejeitar-servico/modal-rejeitar-servico.component';
import { buscarSolicitacao } from '../../core/services/solicitacoes-prototipo';
@Component({
  selector: 'app-visualizar-servico', standalone: true, imports: [RouterLink],
  templateUrl: './visualizar-servico.component.html', styleUrl: './visualizar-servico.component.css'
})
export class VisualizarServicoComponent {
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  solicitacao = this.carregar();
  historico = this.solicitacao?.historico ?? [];
  get rotaVoltar(): string {
    const origem = this.route.snapshot.queryParamMap.get('origem');
    return origem === 'painel-funcionario' || origem === 'visualizacao-solicitacoes'
      ? '/' + origem : '/painel-cliente';
  }
  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(() => {
      this.solicitacao = this.carregar();
      this.historico = this.solicitacao?.historico ?? [];
      this.cdr.markForCheck();
    });
  }
  private carregar() {
    const registro = buscarSolicitacao(this.route.snapshot.paramMap.get('id'));
    return registro ? { ...registro, categoria: registro.categoria ?? 'Não informada',
      cliente: registro.cliente ?? 'Não informado', email: registro.email ?? 'Não informado',
      telefone: registro.telefone ?? 'Não informado', defeito: registro.descricao } : undefined;
  }
  abrirModalRejeitar() {
    const modalRef = this.modalService.open(ModalRejeitarServicoComponent);
    modalRef.result.then((motivo: string) => console.log('Motivo da rejeição:', motivo), () => {});
  }
}
