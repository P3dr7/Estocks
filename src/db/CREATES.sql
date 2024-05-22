CREATE TABLE Usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP
);

-- Criação da tabela Produtos
CREATE TABLE Produtos (
    id_produto SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    tamanho_produto VARCHAR(50),
    cor_produto VARCHAR(50)
);

-- Criação da tabela Lote_Produto
CREATE TABLE Lote_Produto (
    id_lote_produto SERIAL PRIMARY KEY,
    id_produto INT NOT NULL,
    preco_produto MONEY NOT NULL,
    quantidade_produto NUMERIC(10, 2) NOT NULL,
    nome_produto VARCHAR(100) NOT NULL,
    n_lote VARCHAR(50),
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto)
);