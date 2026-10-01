//Aninha - gente, eu troquei o FormsModule por ReactiveForms, era uma exigência da Semana 7. 
//Também troquei o estado inicial de 'Pendente' para 'ABERTA' - é o que o RF004 pede

import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; //retirei FormsModule
import { Router, RouterLink } from '@angular/router';

interface SolicitacaoManutencao {
  id: number;
  dataHora: string;
  categoria: string;
  equipamento: string;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-orcamento-solicitacao',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './orcamento-solicitacao.component.html',
  styleUrl: './orcamento-solicitacao.component.css',
})
export class OrcamentoSolicitacaoComponent implements OnInit {
  private readonly chaveSolicitacoes = 'solicitacoes';
  private fb = inject(FormBuilder);
  private router = inject(Router);

  solicitacaoId = 0;
  categorias = ['Notebook', 'Impressora', 'Desktop', 'Monitor', 'Outro'];

  //adicionei o formgroup
  form: FormGroup = this.fb.group({
    categoria: ['', Validators.required],
    equipamento: ['', [Validators.required, Validators.maxLength(30)]],
    descricao: ['', Validators.required],
  });
  
 // private router = inject(Router);

  ngOnInit(): void {
    const solicitacoes = this.carregarSolicitacoes();
    this.solicitacaoId = solicitacoes.length === 0
      ? 1
      : Math.max(...solicitacoes.map(solicitacao => solicitacao.id)) + 1;
  }

  salvarSolicitacao(): void {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    /*
    const equipamentoInformado = this.equipamento.trim();
    const descricaoInformada = this.descricao.trim();

    if (!this.categoria || !equipamentoInformado || !descricaoInformada) {
      alert('Preencha a categoria, o equipamento e os detalhes da solicitação.');
      return;
    }
      */

    const solicitacoes = this.carregarSolicitacoes();
    const novaSolicitacao: SolicitacaoManutencao = {
      id: this.solicitacaoId,
      dataHora: new Date().toISOString(),
      categoria: this.form.value.categoria,
      equipamento: this.form.value.equipamento.trim(),
      descricao: this.form.value.descricao.trim(),
      estado: 'ABERTA'
    };

    solicitacoes.push(novaSolicitacao);
    localStorage.setItem(this.chaveSolicitacoes, JSON.stringify(solicitacoes));
    alert('Sua solicitação de orçamento foi enviada com sucesso!');
    this.router.navigate(['/painel-cliente']);
  }

  private carregarSolicitacoes(): SolicitacaoManutencao[] {
    const solicitacoesSalvas = localStorage.getItem(this.chaveSolicitacoes);
    return solicitacoesSalvas
      ? JSON.parse(solicitacoesSalvas) as SolicitacaoManutencao[]
      : [];
  }
}
