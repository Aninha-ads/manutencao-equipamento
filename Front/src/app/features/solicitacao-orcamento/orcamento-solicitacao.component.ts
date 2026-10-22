import { DadosService } from '../../core/services/dados.service';
//Aninha - gente, eu troquei o FormsModule por ReactiveForms, era uma exigência da Semana 7. 
//Também troquei o estado inicial de 'Pendente' para 'ABERTA' - é o que o RF004 pede

import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //retirei FormsModule
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-orcamento-solicitacao',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './orcamento-solicitacao.component.html',
  styleUrl: './orcamento-solicitacao.component.css',
})
export class OrcamentoSolicitacaoComponent {
  private dados = inject(DadosService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  clientes = this.dados.listarClientes();
  clienteId: number | null = null;
  categorias = this.dados.listarCategorias().map(c => c.nome);

  //adicionei o formgroup
  form: FormGroup = this.fb.group({
    categoria: ['', Validators.required],
    equipamento: ['', [Validators.required, Validators.maxLength(30)]],
    descricao: ['', Validators.required],
  });
  
 // private router = inject(Router);


  async salvarSolicitacao(): Promise<void> {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    

    // A identificação autenticada substituirá esta seleção explícita quando o login estiver integrado.
    const categoria = this.dados.listarCategorias().find(c => c.nome === this.form.value.categoria);
    if (!categoria || !this.clienteId) { alert('Selecione cliente e categoria válidos.'); return; }
    try {
      await this.dados.criarSolicitacao({
        clienteId: Number(this.clienteId), categoriaId: categoria.id,
        equipamento: this.form.value.equipamento.trim(), descricao: this.form.value.descricao.trim()
      });
    } catch {
      alert('Não foi possível salvar a solicitação no banco. Tente novamente.');
      return;
    }
    alert('Sua solicitação de orçamento foi enviada com sucesso!');
    this.router.navigate(['/painel-cliente']);
  }

}
