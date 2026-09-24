-- Dados ficticios para testar o banco. Executar uma vez, em banco vazio, depois de schema.sql.
-- Os IDs usados abaixo seguem a ordem dos cadastros.
BEGIN;

-- usuario
INSERT INTO usuario (nome, email, ativo) VALUES
    ('Ana Silva', 'ana@example.test', true),
    ('João Souza', 'joao@example.test', true),
    ('Carla Lima', 'carla@example.test', true),
    ('Pedro Santos', 'pedro@example.test', true),
    ('Maria Técnica', 'maria@example.test', true),
    ('Mário Técnico', 'mario@example.test', true);

-- endereco
INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, uf) VALUES
    ('80010000', 'Rua de Teste A', '10', NULL, 'Centro', 'Curitiba', 'PR'),
    ('80020000', 'Rua de Teste B', '20', NULL, 'Centro', 'Curitiba', 'PR'),
    ('80030000', 'Rua de Teste C', '30', NULL, 'Centro', 'Curitiba', 'PR'),
    ('80040000', 'Rua de Teste D', '40', NULL, 'Centro', 'Curitiba', 'PR');

-- cliente
INSERT INTO cliente (usuario_id, cpf, telefone, endereco_id) VALUES
    (1, '52998224725', '41990000001', 1),
    (2, '11144477735', '41990000002', 2),
    (3, '12345678909', '41990000003', 3),
    (4, '98765432100', '41990000004', 4);

-- funcionario
INSERT INTO funcionario (usuario_id, data_nascimento) VALUES
    (5, '1990-05-15T00:00:00.000Z'),
    (6, '1988-10-20T00:00:00.000Z');

-- categoria
INSERT INTO categoria (nome, ativo) VALUES
    ('Notebook', true),
    ('Impressora', true),
    ('Desktop', true),
    ('Monitor', true),
    ('Outro', true);

-- solicitacao
INSERT INTO solicitacao (cliente_id, categoria_id, funcionario_responsavel_id, descricao_equipamento, descricao_defeito, data_hora_abertura, estado, valor_orcado, motivo_rejeicao, descricao_manutencao, orientacoes_cliente, data_hora_pagamento, data_hora_finalizacao) VALUES
    (1, 1, NULL, 'Notebook de teste 1', 'Não liga', '2026-09-01T12:00:00.000Z', 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL),
    (2, 2, 5, 'Impressora de teste 2', 'Falha intermitente', '2026-09-01T13:00:00.000Z', 'ORCADA', '131.00', NULL, NULL, NULL, NULL, NULL),
    (3, 3, 5, 'Desktop de teste 3', 'Ruído excessivo', '2026-09-02T12:00:00.000Z', 'REJEITADA', '146.50', 'Valor acima do orçamento disponível.', NULL, NULL, NULL, NULL),
    (4, 4, 5, 'Monitor de teste 4', 'Superaquecimento', '2026-09-02T13:00:00.000Z', 'APROVADA', '162.00', NULL, NULL, NULL, NULL, NULL),
    (1, 5, 6, 'Outro de teste 5', 'Conector danificado', '2026-09-03T12:00:00.000Z', 'REDIRECIONADA', '177.50', NULL, NULL, NULL, NULL, NULL),
    (2, 1, 5, 'Notebook de teste 6', 'Não liga', '2026-09-03T13:00:00.000Z', 'ARRUMADA', '193.00', NULL, 'Reparo e testes funcionais do equipamento 6', 'Manter o equipamento limpo e em local ventilado.', NULL, NULL),
    (3, 2, 5, 'Impressora de teste 7', 'Falha intermitente', '2026-09-04T12:00:00.000Z', 'PAGA', '208.50', NULL, 'Reparo e testes funcionais do equipamento 7', 'Manter o equipamento limpo e em local ventilado.', '2026-09-04T16:00:00.000Z', NULL),
    (4, 3, 5, 'Desktop de teste 8', 'Ruído excessivo', '2026-09-04T13:00:00.000Z', 'FINALIZADA', '224.00', NULL, 'Reparo e testes funcionais do equipamento 8', 'Manter o equipamento limpo e em local ventilado.', '2026-09-04T17:00:00.000Z', '2026-09-04T18:00:00.000Z'),
    (1, 4, NULL, 'Monitor de teste 9', 'Superaquecimento', '2026-09-05T12:00:00.000Z', 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL),
    (2, 5, 5, 'Outro de teste 10', 'Conector danificado', '2026-09-05T13:00:00.000Z', 'ORCADA', '255.00', NULL, NULL, NULL, NULL, NULL),
    (3, 1, 5, 'Notebook de teste 11', 'Não liga', '2026-09-06T12:00:00.000Z', 'REJEITADA', '270.50', 'Valor acima do orçamento disponível.', NULL, NULL, NULL, NULL),
    (4, 2, 5, 'Impressora de teste 12', 'Falha intermitente', '2026-09-06T13:00:00.000Z', 'APROVADA', '286.00', NULL, NULL, NULL, NULL, NULL),
    (1, 3, 6, 'Desktop de teste 13', 'Ruído excessivo', '2026-09-07T12:00:00.000Z', 'REDIRECIONADA', '301.50', NULL, NULL, NULL, NULL, NULL),
    (2, 4, 5, 'Monitor de teste 14', 'Superaquecimento', '2026-09-07T13:00:00.000Z', 'ARRUMADA', '317.00', NULL, 'Reparo e testes funcionais do equipamento 14', 'Manter o equipamento limpo e em local ventilado.', NULL, NULL),
    (3, 5, 5, 'Outro de teste 15', 'Conector danificado', '2026-09-08T12:00:00.000Z', 'PAGA', '332.50', NULL, 'Reparo e testes funcionais do equipamento 15', 'Manter o equipamento limpo e em local ventilado.', '2026-09-08T16:00:00.000Z', NULL),
    (4, 1, 5, 'Notebook de teste 16', 'Não liga', '2026-09-08T13:00:00.000Z', 'FINALIZADA', '348.00', NULL, 'Reparo e testes funcionais do equipamento 16', 'Manter o equipamento limpo e em local ventilado.', '2026-09-08T17:00:00.000Z', '2026-09-08T18:00:00.000Z'),
    (1, 2, NULL, 'Impressora de teste 17', 'Falha intermitente', '2026-09-09T12:00:00.000Z', 'ABERTA', NULL, NULL, NULL, NULL, NULL, NULL),
    (2, 3, 5, 'Desktop de teste 18', 'Ruído excessivo', '2026-09-09T13:00:00.000Z', 'ORCADA', '379.00', NULL, NULL, NULL, NULL, NULL),
    (3, 4, 5, 'Monitor de teste 19', 'Superaquecimento', '2026-09-10T12:00:00.000Z', 'REJEITADA', '394.50', 'Valor acima do orçamento disponível.', NULL, NULL, NULL, NULL),
    (4, 5, 5, 'Outro de teste 20', 'Conector danificado', '2026-09-10T13:00:00.000Z', 'APROVADA', '410.00', NULL, NULL, NULL, NULL, NULL);

-- historico_solicitacao
INSERT INTO historico_solicitacao (solicitacao_id, data_hora, estado_anterior, estado_novo, autor_id, funcionario_origem_id, funcionario_destino_id, observacao) VALUES
    (1, '2026-09-01T12:00:00.000Z', NULL, 'ABERTA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (2, '2026-09-01T13:00:00.000Z', NULL, 'ABERTA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (2, '2026-09-01T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (3, '2026-09-02T12:00:00.000Z', NULL, 'ABERTA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (3, '2026-09-02T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (3, '2026-09-02T14:00:00.000Z', 'ORCADA', 'REJEITADA', 3, NULL, NULL, 'Valor acima do orçamento disponível.'),
    (4, '2026-09-02T13:00:00.000Z', NULL, 'ABERTA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (4, '2026-09-02T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (4, '2026-09-02T15:00:00.000Z', 'ORCADA', 'APROVADA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (5, '2026-09-03T12:00:00.000Z', NULL, 'ABERTA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (5, '2026-09-03T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (5, '2026-09-03T14:00:00.000Z', 'ORCADA', 'APROVADA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (5, '2026-09-03T15:00:00.000Z', 'APROVADA', 'REDIRECIONADA', 5, 5, 6, 'Encaminhada ao técnico especialista.'),
    (6, '2026-09-03T13:00:00.000Z', NULL, 'ABERTA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (6, '2026-09-03T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (6, '2026-09-03T15:00:00.000Z', 'ORCADA', 'APROVADA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (6, '2026-09-03T16:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (7, '2026-09-04T12:00:00.000Z', NULL, 'ABERTA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (7, '2026-09-04T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (7, '2026-09-04T14:00:00.000Z', 'ORCADA', 'APROVADA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (7, '2026-09-04T15:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (7, '2026-09-04T16:00:00.000Z', 'ARRUMADA', 'PAGA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T13:00:00.000Z', NULL, 'ABERTA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T15:00:00.000Z', 'ORCADA', 'APROVADA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T16:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T17:00:00.000Z', 'ARRUMADA', 'PAGA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (8, '2026-09-04T18:00:00.000Z', 'PAGA', 'FINALIZADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (9, '2026-09-05T12:00:00.000Z', NULL, 'ABERTA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (10, '2026-09-05T13:00:00.000Z', NULL, 'ABERTA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (10, '2026-09-05T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (11, '2026-09-06T12:00:00.000Z', NULL, 'ABERTA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (11, '2026-09-06T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (11, '2026-09-06T14:00:00.000Z', 'ORCADA', 'REJEITADA', 3, NULL, NULL, 'Valor acima do orçamento disponível.'),
    (12, '2026-09-06T13:00:00.000Z', NULL, 'ABERTA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (12, '2026-09-06T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (12, '2026-09-06T15:00:00.000Z', 'ORCADA', 'APROVADA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (13, '2026-09-07T12:00:00.000Z', NULL, 'ABERTA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (13, '2026-09-07T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (13, '2026-09-07T14:00:00.000Z', 'ORCADA', 'APROVADA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (13, '2026-09-07T15:00:00.000Z', 'APROVADA', 'REDIRECIONADA', 5, 5, 6, 'Encaminhada ao técnico especialista.'),
    (14, '2026-09-07T13:00:00.000Z', NULL, 'ABERTA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (14, '2026-09-07T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (14, '2026-09-07T15:00:00.000Z', 'ORCADA', 'APROVADA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (14, '2026-09-07T16:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (15, '2026-09-08T12:00:00.000Z', NULL, 'ABERTA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (15, '2026-09-08T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (15, '2026-09-08T14:00:00.000Z', 'ORCADA', 'APROVADA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (15, '2026-09-08T15:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (15, '2026-09-08T16:00:00.000Z', 'ARRUMADA', 'PAGA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T13:00:00.000Z', NULL, 'ABERTA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T15:00:00.000Z', 'ORCADA', 'APROVADA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T16:00:00.000Z', 'APROVADA', 'ARRUMADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T17:00:00.000Z', 'ARRUMADA', 'PAGA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (16, '2026-09-08T18:00:00.000Z', 'PAGA', 'FINALIZADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (17, '2026-09-09T12:00:00.000Z', NULL, 'ABERTA', 1, NULL, NULL, 'Evento da massa de testes.'),
    (18, '2026-09-09T13:00:00.000Z', NULL, 'ABERTA', 2, NULL, NULL, 'Evento da massa de testes.'),
    (18, '2026-09-09T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (19, '2026-09-10T12:00:00.000Z', NULL, 'ABERTA', 3, NULL, NULL, 'Evento da massa de testes.'),
    (19, '2026-09-10T13:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (19, '2026-09-10T14:00:00.000Z', 'ORCADA', 'REJEITADA', 3, NULL, NULL, 'Valor acima do orçamento disponível.'),
    (20, '2026-09-10T13:00:00.000Z', NULL, 'ABERTA', 4, NULL, NULL, 'Evento da massa de testes.'),
    (20, '2026-09-10T14:00:00.000Z', 'ABERTA', 'ORCADA', 5, NULL, NULL, 'Evento da massa de testes.'),
    (20, '2026-09-10T15:00:00.000Z', 'ORCADA', 'APROVADA', 4, NULL, NULL, 'Evento da massa de testes.');

COMMIT;
