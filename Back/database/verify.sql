-- Consultas para conferir os dados depois de executar o seed.sql.
-- Este arquivo apenas consulta, sem alterar registros.

-- Retrato de 06/11/2026: 9 usuários, 6 clientes, 3 funcionários,
-- 6 endereços, 5 categorias, 24 solicitações e 72 eventos de histórico.
SELECT COUNT(*) AS total_usuarios FROM usuario;
SELECT COUNT(*) AS total_enderecos FROM endereco;
SELECT COUNT(*) AS total_clientes FROM cliente;
SELECT COUNT(*) AS total_funcionarios FROM funcionario;
SELECT COUNT(*) AS total_categorias FROM categoria;
SELECT COUNT(*) AS total_solicitacoes FROM solicitacao;
SELECT COUNT(*) AS total_historico FROM historico_solicitacao;

-- Mostra a distribuição atual dos pedidos por estado.
SELECT estado, COUNT(*) AS quantidade
FROM solicitacao
GROUP BY estado
ORDER BY estado;

-- Mostra como as tabelas se relacionam pelo ID.
SELECT s.id, u.nome AS cliente, c.nome AS categoria, s.estado, s.valor_orcado
FROM solicitacao s
JOIN cliente cli ON s.cliente_id = cli.usuario_id
JOIN usuario u ON cli.usuario_id = u.id
JOIN categoria c ON s.categoria_id = c.id
ORDER BY s.id;

-- Exemplo: acompanhar o histórico da solicitação 8.
SELECT h.data_hora, h.estado_anterior, h.estado_novo, u.nome AS autor
FROM historico_solicitacao h
JOIN usuario u ON h.autor_id = u.id
WHERE h.solicitacao_id = 8
ORDER BY h.data_hora, h.id;
