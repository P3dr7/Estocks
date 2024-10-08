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
    data_criacao date,
    FOREIGN KEY (id_produto) REFERENCES Produtos(id_produto)
);

-- Criacao da tabela Etapa
CREATE TABLE Etapa (
    Id_Etapa SERIAL PRIMARY KEY,
    Nome_Etapa VARCHAR(30) NOT NULL,
    Material_x VARCHAR(30) NOT NULL,
    Quantidade_Material_x INT NOT NULL,
    Tempo_Necessario TIME NOT NULL,
    fk_Produto_Id_Produto INT NOT NULL,
    CONSTRAINT fk_produto FOREIGN KEY (fk_Produto_Id_Produto) REFERENCES produtos(id_produto)
);

-- Criacao da tabela Estoque_Material
CREATE TABLE Estoque_Material (
    Id_Material SERIAL PRIMARY KEY,
    Nome_Material VARCHAR(30) NOT NULL,
    Quantidade_Material INT NOT NULL
);

CREATE TABLE etapa_material (
    id_material INT,
    id_etapa INT,
    PRIMARY KEY (id_material, id_etapa),
    FOREIGN KEY (id_material) REFERENCES estoque_material(id_material) ON DELETE CASCADE,
    FOREIGN KEY (id_etapa) REFERENCES etapa(id_etapa) ON DELETE CASCADE
);