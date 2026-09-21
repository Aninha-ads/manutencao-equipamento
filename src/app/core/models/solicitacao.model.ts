export type EstadoSolicitacao =
  | 'ABERTA'
  | 'ORCADA'
  | 'REJEITADA'
  | 'APROVADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'PAGA'
  | 'FINALIZADA';

export interface Solicitacao {
  id: number;
  dataHoraAbertura: string;
  descricaoEquipamento: string;
  categoriaId: number;
  descricaoDefeito: string;
  estado: EstadoSolicitacao; // Objeto EstadoSolicitacao
  clienteId: number;

  valorOrcado?: number;
  motivoRejeicao?: string;
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  dataHoraPagamento?: string;
  dataHoraFinalizacao?: string;
}

export interface HistoricoSolicitacao {
  id: number;
  solicitacaoId: number;
  dataHora: string;
  estadoAnterior: EstadoSolicitacao;
  estadoNovo: EstadoSolicitacao;
  funcionarioId?: number;
  funcionarioOrigemId?: number;
  funcionarioDestinoId?: number;
  observacao?: string;
}