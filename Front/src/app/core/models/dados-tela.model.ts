import { EstadoSolicitacao } from '../../models/solicitacao.model';
export interface FuncionarioTela {
  id: number; nome: string; email: string; nascimento: string;
}
export interface SolicitacaoTela {
  id: number; dataHora: string; equipamento: string; descricao: string; estado: EstadoSolicitacao;
  clienteId?: number; categoriaId?: number;
  categoria?: string; cliente?: string; email?: string; telefone?: string;
  cpf?: string; endereco?: string; valorOrcamento?: number; funcionarioDestinoId?: number;
  historico?: { dataHora: string; estado: EstadoSolicitacao; funcionario: string; descricao: string }[];
}
