//tentando aprender back, revisar aqui
export interface HistoricoSolicitacao {
  id: number;

  solicitacaoId: number;

  dataHora: string;

  estadoAnterior?: string;
  estadoNovo: string;

  autorId: number;

  funcionarioOrigemId?: number;
  funcionarioDestinoId?: number;

  observacao?: string;
}