//tentando aprender back, revisar aqui
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

  clienteId: number;
  categoriaId: number;
  funcionarioResponsavelId?: number;

  descricaoEquipamento: string;
  descricaoDefeito: string;

  dataHoraAbertura: string;

  estado: EstadoSolicitacao;

  valorOrcado?: number;
  motivoRejeicao?: string;

  descricaoManutencao?: string;
  orientacoesCliente?: string;

  dataHoraPagamento?: string;
  dataHoraFinalizacao?: string;
}