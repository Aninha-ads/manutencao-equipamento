import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { DadosService } from '../../core/services/dados.service';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
//dados fictícios para a vizualização, não dá para fazzer nada com eles ainda
//APENAS vizualização 
interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  equipamento: string;
  estado: EstadoSolicitacao;
}

@Component({
  selector: 'app-painel-funcionario',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './painel-funcionario.component.html',
  styleUrl: './painel-funcionario.component.css'
})
export class PainelFuncionarioComponent {
  private dados = inject(DadosService);
//colocando dados dentro da tabela, pode mudar qualquer uma dessas coisas se quiser
//queria colocar figurinhas junto com os produtos, mas fica pro próximo commit
//ou você coloca se quiser, Ana
  solicitacoes: Solicitacao[] = this.dados.listarSolicitacoes()
    .filter(s => s.estado === 'ABERTA')
    .map(s => ({ ...s, cliente: s.cliente ?? 'Não informado' }));

  limitarDescricao(descricao: string): string {
    if (descricao.length <= 30) {
      return descricao;
    }

    return descricao.substring(0, 30) + '...';
  }

}
