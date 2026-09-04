import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orcamento-solicitacao',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './orcamento-solicitacao.component.html',
})
export class OrcamentoSolicitacaoComponent implements OnInit {
  solicitacaoId = 0;
  valorOrcamento: number | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.solicitacaoId = +this.route.snapshot.params['id'];
  }

  salvarOrcamento(): void {
    console.log(
      `Orçamento da solicitação ${this.solicitacaoId} salvo com valor R$ ${this.valorOrcamento}`,
    );
    this.router.navigate(['/painel-funcionario']);
  }
}
