import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalRejeitarServicoComponent } from './modal-rejeitar-servico/modal-rejeitar-servico.component';

//AQUI PODE COMENTÁRIO DE BARRINHA, EEEEEE
//informações fantasia para ilustração (que vamos precisar msotrar no protótipo)
//livre para qualquer um mudar se quiser
interface Historico {
  //semi- "struct"
  dataHora: string;
  estado: string;
  funcionario: string;
  descricao: string;
}

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './visualizar-servico.component.html',
  styleUrl: './visualizar-servico.component.css'
})
export class VisualizarServicoComponent {

  private modalService = inject(NgbModal);

  // acima, referências pq outros arquivos, abaixo, começam as informações fictícias
  solicitacao = {
    id: 1,
    dataHora: '25/08/2026 08:30',

    cliente: 'João da Silva',
    email: 'joao@email.com',
    telefone: '(41) 99999-9999',

    equipamento: 'Notebook Dell Inspiron',
    categoria: 'Notebook',

    defeito: 'O equipamento não liga e apresenta falha ao iniciar.',

    estado: 'ORÇADA',

    valorOrcamento: 350.00
  };


  // Histórico dos passos da solicitação
  historico: Historico[] = [

    {
      dataHora: '25/08/2026 08:30',
      estado: 'ABERTA',
      funcionario: '—',
      descricao: 'Solicitação de manutenção criada pelo cliente.'
    },

    {
      dataHora: '25/08/2026 09:15',
      estado: 'ORÇADA',
      funcionario: 'Maria',
      descricao: 'Orçamento realizado para o serviço.'
    }

  ];

  abrirModalRejeitar() {
    const modalRef = this.modalService.open(ModalRejeitarServicoComponent);

    modalRef.result.then(
      (motivo: string) => {
        console.log('Motivo da rejeição:', motivo);
      },
      () => {
        console.log('Modal fechado sem confirmar');
      }
    );
  }

}