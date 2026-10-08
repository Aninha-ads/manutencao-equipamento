import { buscarSolicitacao } from '../../../core/services/solicitacoes-prototipo';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Funcionario {
  id: number;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-redirecionar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './redirecionar-manutencao.component.html',
  styleUrl: './redirecionar-manutencao.component.css',
})
export class RedirecionarManutencaoComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  registro = buscarSolicitacao(this.route.snapshot.queryParamMap.get('id'));
  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.registro = buscarSolicitacao(params.get('id'));
      this.cdr.markForCheck();
      
    });
  }


  private readonly chaveFuncionarios = 'funcionarios';

  private fb = inject(FormBuilder);

  private funcionariosPadrao: Funcionario[] = [
    {
      id: 1,
      nome: 'Maria Souza',
      email: 'maria.teste@empresa.com'
    },
    {
      id: 2,
      nome: 'Mario Oliveira',
      email: 'mario.teste@empresa.com'
    },
    {
      id: 3,
      nome: 'Pedro Silva',
      email: 'pedro.teste@empresa.com'
    }
  ];

  funcionarios: Funcionario[] = this.carregarFuncionarios();

  funcionarioAtual: Funcionario = this.funcionarios[0];

  funcionariosDisponiveis: Funcionario[] = this.funcionarios.filter(
    funcionario => funcionario.id !== this.funcionarioAtual.id
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

  private carregarFuncionarios(): Funcionario[] {

    const funcionariosSalvos = localStorage.getItem(
      this.chaveFuncionarios
    );

    if (funcionariosSalvos) {
      return JSON.parse(funcionariosSalvos) as Funcionario[];
    }

    localStorage.setItem(
      this.chaveFuncionarios,
      JSON.stringify(this.funcionariosPadrao)
    );

    return this.funcionariosPadrao;
  }

  private funcionarioDestinoValido(control: any) {

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

    if (funcionario.id === this.funcionarioAtual.id) {
      return {
        mesmoFuncionario: true
      };
    }

    return null;
  }

  redirecionarManutencao(): void {
    if (!this.registro) return;

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

    console.log('Redirecionamento:', {
      funcionarioAtual: this.funcionarioAtual,
      funcionarioDestino: funcionarioDestino
    });

    alert(
      `Manutenção redirecionada para ${funcionarioDestino.nome}.`
    );
  }
}
