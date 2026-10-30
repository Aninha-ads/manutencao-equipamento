import { FuncionarioTela as Funcionario } from '../../../core/models/dados-tela.model';
import { DadosService } from '../../../core/services/dados.service';
import { AuthService } from '../../../core/services/auth.service';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css',
})
export class RedirecionarManutencaoComponent {
  private dados = inject(DadosService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
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
  funcionarios = this.dados.listarFuncionarios();

  funcionarioAtual: Funcionario | undefined = this.funcionarios.find(f => f.id === this.auth.id);

  funcionariosDisponiveis: Funcionario[] = this.funcionarios.filter(
    funcionario => funcionario.id !== this.funcionarioAtual?.id
  );

  redirecionamentoForm = this.fb.group({
    funcionarioDestinoId: this.fb.nonNullable.control<number | null>(
      null,
      [
        Validators.required,
        this.funcionarioDestinoValido.bind(this)
      ]
    )
  });

  get funcionarioDestinoId() {
    return this.redirecionamentoForm.controls.funcionarioDestinoId;
  }

  private funcionarioDestinoValido(control: import('@angular/forms').AbstractControl) {

    const id = control.value;

    if (id === null || id === '') {
      return null;
    }

    const funcionario = this.funcionariosDisponiveis.find(
      funcionario => funcionario.id === Number(id)
    );

    if (!funcionario) {
      return {
        funcionarioInvalido: true
      };
    }

    if (funcionario.id === this.funcionarioAtual?.id) {
      return {
        mesmoFuncionario: true
      };
    }

    return null;
  }

  async redirecionarManutencao(): Promise<void> {
    if (!this.registro) return;
    if (this.registro.estado !== 'APROVADA') {
      alert('Somente solicitações aprovadas podem ser redirecionadas.');
      return;
    }

    if (this.redirecionamentoForm.invalid) {
      this.redirecionamentoForm.markAllAsTouched();
      return;
    }

    const funcionarioDestino = this.funcionariosDisponiveis.find(
      funcionario =>
        funcionario.id === Number(this.funcionarioDestinoId.value)
    );

    if (!funcionarioDestino) {
      return;
    }

    try {
      await this.dados.mudarEstado(this.registro.id, 'REDIRECIONADA', {
        funcionarioDestinoId: funcionarioDestino.id
      });
      alert(`Manutenção redirecionada para ${funcionarioDestino.nome}.`);
      await this.router.navigate(['/visualizacao-solicitacoes']);
    } catch {
      alert('Não foi possível redirecionar a manutenção. Verifique o estado da solicitação e tente novamente.');
    }
  }
}
