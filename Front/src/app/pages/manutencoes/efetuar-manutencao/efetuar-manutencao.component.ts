import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-efetuar-manutencao',  //http://localhost:4200/manutencoes/efetuar
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrl: './efetuar-manutencao.component.css',
})
export class EfetuarManutencaoComponent {

  private fb = inject(FormBuilder);

  manutencaoForm = this.fb.group({
    descricaoManutencao: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.pattern(/\S+/),
        Validators.maxLength(1000)
      ]
    ),

    orientacoesCliente: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.pattern(/\S+/),
        Validators.maxLength(1000)
      ]
    )
  });

  get descricaoManutencao() {
    return this.manutencaoForm.controls.descricaoManutencao;
  }

  get orientacoesCliente() {
    return this.manutencaoForm.controls.orientacoesCliente;
  }

  efetuarManutencao(): void {

    if (this.manutencaoForm.invalid) {
      this.manutencaoForm.markAllAsTouched();
      return;
    }

    const dados = {
      descricaoManutencao: this.descricaoManutencao.value.trim(),
      orientacoesCliente: this.orientacoesCliente.value.trim()
    };

    console.log('Dados da manutenção:', dados);

    alert('Manutenção registrada com sucesso!');
  }
}
