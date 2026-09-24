-- Estrutura inicial do banco em PostgreSQL.
-- Executar em um banco vazio.
-- PRIMARY KEY identifica o registro e SERIAL gera seu número.
-- REFERENCES liga uma tabela a outra. NOT NULL indica campo obrigatório.
-- UNIQUE impede repetição e CHECK verifica uma condição.
BEGIN;

-- Dados comuns de clientes e funcionários.
-- O e-mail é único para evitar duas contas com o mesmo endereço.
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    -- Serão preenchidos quando o login for implementado na Semana 8.
    senha_hash VARCHAR(64),
    senha_salt VARCHAR(64),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Endereço do cliente. CEP é texto para manter os zeros iniciais.
CREATE TABLE endereco (
    id SERIAL PRIMARY KEY,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(150),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL
);

-- O cliente usa o mesmo ID do usuário, onde estão seu nome e e-mail.
-- Cada cliente possui seu próprio registro de endereço.
CREATE TABLE cliente (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuario(id),
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(11) NOT NULL,
    endereco_id INTEGER NOT NULL UNIQUE REFERENCES endereco(id)
);

-- Dados específicos do funcionário. Os demais ficam em usuario.
CREATE TABLE funcionario (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuario(id),
    data_nascimento DATE NOT NULL
);

-- Tipos de equipamento. ativo permite desativar sem apagar o registro.
CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Lista de estados usados no sistema.
CREATE TABLE estado_solicitacao (
    codigo VARCHAR(20) PRIMARY KEY,
    descricao VARCHAR(80) NOT NULL
);

INSERT INTO estado_solicitacao (codigo, descricao) VALUES
    ('ABERTA', 'Aberta'),
    ('ORCADA', 'Orçada'),
    ('REJEITADA', 'Rejeitada'),
    ('APROVADA', 'Aprovada'),
    ('REDIRECIONADA', 'Redirecionada'),
    ('ARRUMADA', 'Arrumada'),
    ('PAGA', 'Paga'),
    ('FINALIZADA', 'Finalizada');

-- Pedido de manutenção. Os IDs ligam o pedido ao cliente, categoria e funcionário.
-- Orçamento, reparo e datas de conclusão começam vazios e são preenchidos depois.
CREATE TABLE solicitacao (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL REFERENCES cliente(usuario_id),
    categoria_id INTEGER NOT NULL REFERENCES categoria(id),
    funcionario_responsavel_id INTEGER REFERENCES funcionario(usuario_id),
    descricao_equipamento TEXT NOT NULL,
    descricao_defeito TEXT NOT NULL,
    -- Guarda o instante da abertura. A apresentação usa o fuso configurado no banco.
    data_hora_abertura TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) NOT NULL DEFAULT 'ABERTA' REFERENCES estado_solicitacao(codigo),
    -- Duas casas decimais para o valor em reais.
    valor_orcado NUMERIC(10,2) CHECK (valor_orcado > 0),
    motivo_rejeicao TEXT,
    descricao_manutencao TEXT,
    orientacoes_cliente TEXT,
    data_hora_pagamento TIMESTAMPTZ,
    data_hora_finalizacao TIMESTAMPTZ
);

-- Guarda as mudanças de estado. O autor pode ser cliente ou funcionário.
-- Na abertura, estado_anterior fica vazio.
-- Origem e destino são usados quando a manutenção é redirecionada.
CREATE TABLE historico_solicitacao (
    id SERIAL PRIMARY KEY,
    solicitacao_id INTEGER NOT NULL REFERENCES solicitacao(id),
    data_hora TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado_anterior VARCHAR(20) REFERENCES estado_solicitacao(codigo),
    estado_novo VARCHAR(20) NOT NULL REFERENCES estado_solicitacao(codigo),
    autor_id INTEGER NOT NULL REFERENCES usuario(id),
    funcionario_origem_id INTEGER REFERENCES funcionario(usuario_id),
    funcionario_destino_id INTEGER REFERENCES funcionario(usuario_id),
    observacao TEXT
);

COMMIT;
