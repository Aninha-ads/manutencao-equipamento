export interface SolicitacaoPrototipo {
  id: number; dataHora: string; equipamento: string; descricao: string; estado: string;
  categoria?: string; cliente?: string; email?: string; telefone?: string;
  cpf?: string; endereco?: string; valorOrcamento?: number; funcionarioDestinoId?: number;
  historico?: { dataHora: string; estado: string; funcionario: string; descricao: string }[];
}
const iniciais: SolicitacaoPrototipo[] = [
    {
      id: 1,
      dataHora: '2026-06-01T10:30:00',
      equipamento: 'Notebook Dell Inspiron',
      descricao: 'Notebook não liga',
      estado: 'FINALIZADA'//concluida
    },
    {
      id: 2,
      dataHora: '2026-06-28T14:15:00',
      equipamento: 'Impressora HP LaserJet',
      descricao: 'Impressora não está imprimindo',
      estado: 'ARRUMADA' //Em andamento
    },
    {
      id: 3,
      dataHora: '2026-07-09T09:45:00',
      equipamento: 'Monitor LG',
      descricao: 'Monitor apresentando falhas na imagem',
      estado: 'ORCADA' //Pendente
    },
    {
      id: 4,
      dataHora: '2026-08-16T16:40:00',
      equipamento: 'Computador Lenovo ThinkCentre',
      descricao: 'Computador reiniciando sozinho',
      estado: 'ABERTA' //Aguardando atendimento
    },
    {
      id: 5,
      dataHora: '2026-08-20T11:00:00',
      equipamento: 'Teclado Mecânico Redragon',
      descricao: 'Teclas travando ao digitar',
      estado: 'REJEITADA'
    }
  ];
export function listarSolicitacoes(): SolicitacaoPrototipo[] {
  const salvas = localStorage.getItem('solicitacoes');
  if (salvas) {
    try { const lista: unknown = JSON.parse(salvas); if (Array.isArray(lista)) return lista; }
    catch { /* Recupera dados locais inválidos. */ }
  }
  const lista = iniciais.map(s => ({ ...s }));
  localStorage.setItem('solicitacoes', JSON.stringify(lista));
  return lista;
}
export function buscarSolicitacao(valor: string | null): SolicitacaoPrototipo | undefined {
  if (!valor || !/^\d+$/.test(valor)) return undefined;
  return listarSolicitacoes().find(s => s.id === Number(valor));
}
