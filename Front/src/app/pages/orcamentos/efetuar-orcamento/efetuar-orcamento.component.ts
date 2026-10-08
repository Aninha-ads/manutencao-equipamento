import { buscarSolicitacao } from '../../../core/services/solicitacoes-prototipo';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormBuilder, ReactiveFormsModule, Validators, AbstractControl,
  ValidationErrors} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface SolicitacaoOrcamento {
  dataHora: string;
  categoria: string;
  estado: string;
  equipamento: string;
  defeito: string;
}

interface Cliente {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
}
//troca forms Module para Reactive FormsModule
@Component({
  selector: 'app-efetuar-orcamento',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './efetuar-orcamento.component.html',
  styleUrl: './efetuar-orcamento.component.css',
})
export class EfetuarOrcamentoComponent {
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  registro = buscarSolicitacao(this.route.snapshot.queryParamMap.get('id'));
  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.registro = buscarSolicitacao(params.get('id'));
      if (this.registro) {
        this.solicitacao = { ...this.registro, categoria: this.registro.categoria ?? 'Não informada', defeito: this.registro.descricao };
        this.cliente = { nome: this.registro.cliente ?? 'Não informado', cpf: this.registro.cpf ?? 'Não informado', email: this.registro.email ?? 'Não informado', telefone: this.registro.telefone ?? 'Não informado', endereco: this.registro.endereco ?? 'Não informado' };
      }
      this.cdr.markForCheck();
    });
  }

  solicitacao: SolicitacaoOrcamento = {
    dataHora: '', categoria: '', estado: '', equipamento: '', defeito: ''
  };

  cliente: Cliente = {
    nome: '', cpf: '', email: '', telefone: '', endereco: ''
  };

  // Aceita valores positivos com até duas casas decimais.
  valorPositivo(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;

    if (valor === null || valor === '') {
      return null;
    }

    // Aceita vírgula ou ponto como separador decimal.
    const texto = String(valor).trim().replace(',', '.');

    // Impede letras, sinais, valores negativos e mais de 2 casas decimais.
    if (!/^\d+(\.\d{1,2})?$/.test(texto)) {
      return { formatoInvalido: true };
    }

    const numero = Number(texto);

    if (!Number.isFinite(numero) || numero <= 0) {
      return { valorPositivo: true };
    }

    return null;
  }

orcamentoForm;

constructor(private fb: FormBuilder) {
  this.orcamentoForm = this.fb.group({
    valorOrcamento: [
      '',
      [
        Validators.required,
        this.valorPositivo.bind(this)
      ]
    ]
  });
}

  get valorOrcamento() {
    return this.orcamentoForm.controls.valorOrcamento; }

  registrarOrcamento(): void {
    if (!this.registro) return;
    if (this.orcamentoForm.invalid) {
      this.orcamentoForm.markAllAsTouched();
      return;
    }

    const texto = String(this.valorOrcamento.value).trim().replace(',', '.');
    const valor = Number(texto);

    alert(
      `Orçamento de R$ ${valor.toFixed(2).replace('.', ',')} registrado com sucesso!`
    );

    console.log('Valor registrado:', valor);
  }
}
