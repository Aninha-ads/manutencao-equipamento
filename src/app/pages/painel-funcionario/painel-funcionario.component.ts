import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
//dados fictícios para a vizualização, não dá para fazzer nada com eles ainda
//APENAS vizualização 
interface Solicitacao {
  id: number;
  dataHora: string;
  cliente: string;
  equipamento: string;
  estado: string;
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
//colocando dados dentro da tabela, pode mudar qualquer uma dessas coisas se quiser
//queria colocar figurinhas junto com os produtos, mas fica pro próximo commit
//ou você coloca se quiser, Ana
  solicitacoes: Solicitacao[] = [
    {
      id: 1,
      dataHora: '25/08/2026 08:30',
      cliente: 'João',
      equipamento: 'Notebook Dell Inspiron',
      estado: 'ABERTA'
    },
    {
      id: 2,
      dataHora: '25/08/2026 09:15',
      cliente: 'José',
      equipamento: 'Impressora HP LaserJet',
      estado: 'ABERTA'
    },
    {
      id: 3,
      dataHora: '25/08/2026 10:00',
      cliente: 'Joana',
      equipamento: 'Desktop Lenovo ThinkCentre',
      estado: 'ABERTA'
    },
    {
      id: 4,
      dataHora: '25/08/2026 10:45',
      cliente: 'Joaquina',
      equipamento: 'Microfone HyperX',
      estado: 'ABERTA'
    }
  ];

  limitarDescricao(descricao: string): string {
    if (descricao.length <= 30) {
      return descricao;
    }

    return descricao.substring(0, 30) + '...';
  }

}