import { Component } from '@angular/core';

interface  Solicitacao {
  id: number;
  dataHora: string;
  descricao: string;
  estado: string;
}

@Component({
  selector: 'app-painel-cliente',
  imports: [],
  templateUrl: './painel-cliente.component.html',
  styleUrl: './painel-cliente.component.css',
})
export class PainelClienteComponent {

  solicitacoes: Solicitacao[] = [
    { 
      id: 1, 
      dataHora: '2026-06-01 10:30', 
      descricao: 'Notebook não liga', 
      estado: 'Concluída'
    },
    { 
      id: 2, 
      dataHora: '2026-06-28 14:15', 
      descricao: 'Impressora não está imprimindo', 
      estado: 'Em andamento' 
    },
    { 
      id: 3, 
      dataHora: '2026-07-09 09:45', 
      descricao: 'Monitor apresentando falhas na imagem', 
      estado: 'Pendente' 
    },
    {
        id: 4,
        dataHora: '2026-08-16 16:40',
        descricao: 'Computador reiniciando sozinho',
        estado: 'Aguardando atendimento'
      }
  ];
}