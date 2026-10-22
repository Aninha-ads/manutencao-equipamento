import { DadosTelas } from '../core/services/dados.service';

/** Resposta pequena da API usada somente nos testes das telas. */
export function dadosTeste(): DadosTelas {
  return {
    clientes: [], categorias: [{ id: 1, nome: 'Notebook' }],
    funcionarios: [
      { id: 5, nome: 'Maria', email: 'maria@example.test', nascimento: '1990-05-15' },
      { id: 6, nome: 'Mário', email: 'mario@example.test', nascimento: '1988-10-20' }
    ],
    solicitacoes: [
      { id: 7, dataHora: '2026-09-01T10:00:00', equipamento: 'Monitor selecionado', descricao: 'Tela piscando', estado: 'ABERTA' },
      { id: 12, dataHora: '2026-09-02T10:00:00', equipamento: 'Impressora selecionada', descricao: 'Sem impressão', estado: 'APROVADA' }
    ]
  };
}
