import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-rejeitar-servico',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-rejeitar-servico.component.html',
  styleUrl: './modal-rejeitar-servico.component.css',
})
export class ModalRejeitarServicoComponent {

  activeModal: NgbActiveModal = inject(NgbActiveModal);

  private fb = inject(FormBuilder);

  rejeicaoForm = this.fb.group({
    motivoRejeicao: [
      '',
      [
        Validators.required,
        Validators.pattern(/\S+/)
      ]
    ]
  });

  get motivoRejeicao() {
    return this.rejeicaoForm.controls.motivoRejeicao;
  }

  confirmarRejeicao(): void {

    if (this.rejeicaoForm.invalid) {
      this.rejeicaoForm.markAllAsTouched();
      return;
    }
//evitar null, tava dando problema
    const motivo = (this.motivoRejeicao.value ?? '').trim();

    this.activeModal.close(motivo);
  }
}