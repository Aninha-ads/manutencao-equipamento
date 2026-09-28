-- Estrutura inicial do banco em MySQL 8.0.16 ou superior.
-- Executar em um banco vazio.
-- PRIMARY KEY identifica o registro e AUTO_INCREMENT gera seu número.
-- FOREIGN KEY ... REFERENCES liga uma tabela a outra. NOT NULL indica campo obrigatório.
-- UNIQUE impede repetição e CHECK verifica uma condição.
-- No MySQL, CREATE TABLE faz commit implícito.

-- Dados comuns de clientes e funcionários.
-- O e-mail é único para evitar duas contas com o mesmo endereço.
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    -- Serão preenchidos quando o login for implementado na Semana 8.
    senha_hash VARCHAR(64),
    senha_salt VARCHAR(64),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- Endereço do cliente. CEP é texto para manter os zeros iniciais.
CREATE TABLE endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(150),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- O cliente usa o mesmo ID do usuário, onde estão seu nome e e-mail.
-- Cada cliente possui seu próprio registro de endereço.
CREATE TABLE cliente (
    usuario_id INTEGER PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(11) NOT NULL,
    endereco_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- Dados específicos do funcionário. Os demais ficam em usuario.
CREATE TABLE funcionario (
    usuario_id INTEGER PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- Tipos de equipamento. ativo permite desativar sem apagar o registro.
CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- Lista de estados usados no sistema.
CREATE TABLE estado_solicitacao (
    codigo VARCHAR(20) PRIMARY KEY,
    descricao VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

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
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    categoria_id INTEGER NOT NULL,
    funcionario_responsavel_id INTEGER,
    descricao_equipamento TEXT NOT NULL,
    descricao_defeito TEXT NOT NULL,
    -- Guarda o instante da abertura. A apresentação usa o fuso configurado na sessão do MySQL.
    data_hora_abertura TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    estado VARCHAR(20) NOT NULL DEFAULT 'ABERTA',
    -- Duas casas decimais para o valor em reais.
    valor_orcado NUMERIC(10,2) CHECK (valor_orcado > 0),
    motivo_rejeicao TEXT,
    descricao_manutencao TEXT,
    orientacoes_cliente TEXT,
    data_hora_pagamento TIMESTAMP(6) NULL DEFAULT NULL,
    data_hora_finalizacao TIMESTAMP(6) NULL DEFAULT NULL,
    FOREIGN KEY (cliente_id) REFERENCES cliente(usuario_id),
    FOREIGN KEY (categoria_id) REFERENCES categoria(id),
    FOREIGN KEY (funcionario_responsavel_id) REFERENCES funcionario(usuario_id),
    FOREIGN KEY (estado) REFERENCES estado_solicitacao(codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;

-- Guarda as mudanças de estado. O autor pode ser cliente ou funcionário.
-- Na abertura, estado_anterior fica vazio.
-- Origem e destino são usados quando a manutenção é redirecionada.
CREATE TABLE historico_solicitacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitacao_id INTEGER NOT NULL,
    data_hora TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    estado_anterior VARCHAR(20),
    estado_novo VARCHAR(20) NOT NULL,
    autor_id INTEGER NOT NULL,
    funcionario_origem_id INTEGER,
    funcionario_destino_id INTEGER,
    observacao TEXT,
    FOREIGN KEY (solicitacao_id) REFERENCES solicitacao(id),
    FOREIGN KEY (estado_anterior) REFERENCES estado_solicitacao(codigo),
    FOREIGN KEY (estado_novo) REFERENCES estado_solicitacao(codigo),
    FOREIGN KEY (autor_id) REFERENCES usuario(id),
    FOREIGN KEY (funcionario_origem_id) REFERENCES funcionario(usuario_id),
    FOREIGN KEY (funcionario_destino_id) REFERENCES funcionario(usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_as_cs;
