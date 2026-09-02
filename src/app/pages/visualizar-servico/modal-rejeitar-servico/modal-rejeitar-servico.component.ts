import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-rejeitar-servico',
  imports: [FormsModule],
  templateUrl: './modal-rejeitar-servico.component.html',
  styleUrl: './modal-rejeitar-servico.component.css',
})
export class ModalRejeitarServicoComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  motivoRejeicao = '';

  confirmarRejeicao() {
    this.activeModal.close(this.motivoRejeicao);
  }
}