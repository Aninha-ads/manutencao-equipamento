import { DadosService } from '../../../core/services/dados.service';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-efetuar-manutencao',  //http://localhost:4200/manutencoes/efetuar
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-manutencao.component.html',
  styleUrl: './efetuar-manutencao.component.css',
})
export class EfetuarManutencaoComponent {
  private dados = inject(DadosService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  registro = this.dados.buscarSolicitacao(this.route.snapshot.queryParamMap.get('id'));
  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.registro = this.dados.buscarSolicitacao(params.get('id'));
      this.cdr.markForCheck();
      
    });
  }


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

  async efetuarManutencao(): Promise<void> {
    if (!this.registro) return;
    if (this.registro.estado !== 'APROVADA' && this.registro.estado !== 'REDIRECIONADA') {
      alert('A solicitação precisa estar aprovada ou redirecionada para iniciar a manutenção.');
      return;
    }

    if (this.manutencaoForm.invalid) {
      this.manutencaoForm.markAllAsTouched();
      return;
    }

    const dados = {
      descricaoManutencao: this.descricaoManutencao.value.trim(),
      orientacoesCliente: this.orientacoesCliente.value.trim()
    };

    try {
      await this.dados.mudarEstado(this.registro.id, 'ARRUMADA', dados);
      alert('Manutenção registrada com sucesso!');
    } catch {
      alert('Não foi possível registrar a manutenção. Verifique o estado da solicitação e tente novamente.');
    }
  }
}
