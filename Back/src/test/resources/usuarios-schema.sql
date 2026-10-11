-- Mesmas colunas e restrições do schema MySQL, sem opções de armazenamento.
CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL UNIQUE,
    senha_hash VARCHAR(64),
    senha_salt VARCHAR(64),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE endereco (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cep VARCHAR(8) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(150),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    uf VARCHAR(2) NOT NULL
);
CREATE TABLE cliente (
    usuario_id INTEGER PRIMARY KEY,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(11) NOT NULL,
    endereco_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (endereco_id) REFERENCES endereco(id)
);
CREATE TABLE funcionario (
    usuario_id INTEGER PRIMARY KEY,
    data_nascimento DATE NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
