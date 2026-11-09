import { EstadoSolicitacao } from '../../models/solicitacao.model';
import { DadosService } from '../../core/services/dados.service';
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface Solicitacao {
  id: number;
  dataHora: string;
  equipamento: string;
  descricao: string;
  estado: EstadoSolicitacao;
  clienteId?: number;
}

@Component({
  selector: 'app-painel-cliente',
  imports: [DatePipe, FormsModule, RouterLink],
  templateUrl: './painel-cliente.component.html',
  styleUrl: './painel-cliente.component.css',
})
export class PainelClienteComponent implements OnInit{
  private dados = inject(DadosService);
  private auth = inject(AuthService);
  //private readonly chaveClienteLogado = 'clienteLogadoId';

  filtroEstado = 'TODOS';
  solicitacoes: Solicitacao[] = [];

  //mudei os estados para deixar como no enunciado (aberta, orçada, aprovada, rejeitada, arrumada, paga, finalizada)
  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  private carregarSolicitacoes(): void {
    const sessao = this.auth.sessao()
    //const clienteLogadoId = this.obterClienteLogado();
    //const lista = this.dados.listarSolicitacoes();

    //lista ordenada, data/hora
    // INT01: só mostra as solicitações do cliente que está "logado" (seleção provisória,
    // até o login de verdade existir), ordenadas por data/hora.
    this.solicitacoes = this.dados.listarSolicitacoes()
      .filter(s => sessao?.perfil !== 'CLIENTE' || s.clienteId === sessao.id)
      .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());  
      //.filter(s => clienteLogadoId === null || s.clienteId === clienteLogadoId)
      //.sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
  }

/*
  private obterClienteLogado(): number | null {
    const salvo = localStorage.getItem(this.chaveClienteLogado);
    return salvo ? Number(salvo) : null;
  }
*/

  get estados(): string[] {
    return ['TODOS', ...new Set(this.solicitacoes.map(solicitacao => solicitacao.estado))];
  }

  get solicitacoesFiltradas(): Solicitacao[] {
    if (this.filtroEstado === 'TODOS') {
      return this.solicitacoes;
    }

    return this.solicitacoes.filter(
      solicitacao => solicitacao.estado === this.filtroEstado
    );
  }

  equipamentoResumido(equipamento: string): string {
    return equipamento.length > 30
      ? equipamento.substring(0, 30) + '...'
      : equipamento;
  }

  // RF003: botão de ação conforme o estado. ARRUMADA não entra aqui porque
  // o botão "Confirmar pagamento" do HTML chama pagarServico() direto.
  acaoPara(estado: string): { label: string; rota: string } | null {
    switch (estado) {
      case 'ORCADA':
        return { label: 'Aprovar/Rejeitar', rota: '/orcamentos/mostrar-orcamento' };
      //removi rejeitada pois não precisava de uma rota, ela muda o estado da solicitação
      //vou adicionar método abaijo para resgatar a rejeitada
      //case 'APROVADA':
      //return null;
      default:
        return null;
    }
  }

    async resgatarServico(id: number): Promise<void> {
      const solicitacao = this.solicitacoes.find(s => s.id === id);
        //o botão só aparece se ela já estiver rejeitada, mas por segurança é bom
        //colocar essa condição, vai que buga
    if (!solicitacao || solicitacao.estado !== 'REJEITADA') {
      alert('Esta solicitação não pode ser resgatada.');
      return;
    }

    if (!confirm('Deseja resgatar esta solicitação? Ela mudará para o estado APROVADA.')) {
      return;
    }

    try {
      await this.dados.mudarEstado(id, 'APROVADA');

      this.carregarSolicitacoes();

      alert('Serviço resgatado com sucesso! A solicitação mudou para APROVADA e foi enviada para nossos técnicos!');

    } catch (erro) {
      console.error('Erro ao resgatar serviço:', erro);
      alert('Não foi possível resgatar o serviço. Tente novamente.');
    }
  }

  async pagarServico(id: number): Promise<void> {
    try {
      await this.dados.mudarEstado(id, 'PAGA');
      this.carregarSolicitacoes();
    } catch {
      alert('Não foi possível registrar o pagamento. Verifique a solicitação e tente novamente.');
    }
  }
}
