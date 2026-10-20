DROP TABLE IF EXISTS adocao, animal, usuario CASCADE; -- cascade para remover todas as dependências

CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(100) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE CHECK (LENGTH(cpf) = 11 AND cpf ~ '^[0-9]+$'),
    telefone VARCHAR(11) NOT NULL, 
    tipo_usuario VARCHAR(20) NOT NULL CHECK (tipo_usuario IN ('ONG', 'Adotante')),
    cidade VARCHAR(100) NOT NULL,
    uf CHAR(2) NOT NULL
);

CREATE TABLE animal (
    id_animal INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    nome VARCHAR(100) NOT NULL,
    foto_url VARCHAR(500) NOT NULL,
    especie VARCHAR(50) NOT NULL CHECK (especie IN ('Cachorro', 'Gato', 'Outro')),
    porte VARCHAR(20) NOT NULL CHECK (porte IN ('Pequeno', 'Médio', 'Grande')),
    sexo CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
    dt_nascimento DATE,
    castrado BOOLEAN NOT NULL DEFAULT FALSE,
    vacinas VARCHAR(200),
    vermifugado BOOLEAN NOT NULL DEFAULT FALSE,
    condicao_especial BOOLEAN NOT NULL DEFAULT FALSE, 
    medicamento_continuo BOOLEAN NOT NULL DEFAULT FALSE, 
    historico_saude TEXT, 
    microchipado BOOLEAN NOT NULL DEFAULT FALSE, 
    historia TEXT, 
    motivo_doacao TEXT, 
    personalidade TEXT, 
    cidade VARCHAR (100) NOT NULL, 
    uf CHAR(2) NOT NULL, 
    situacao VARCHAR(12) NOT NULL DEFAULT 'Disponível' CHECK (situacao IN ('Disponível', 'Em Processo', 'Adotado')), 
    id_responsavel INTEGER NOT NULL REFERENCES usuario(id_usuario)
);

CREATE TABLE adocao (
    id_adocao INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
    id_animal INTEGER NOT NULL REFERENCES animal(id_animal), 
    id_adotante INTEGER NOT NULL REFERENCES usuario(id_usuario),
    situacao VARCHAR(20) NOT NULL CHECK (situacao IN ('Pendente', 'Aprovada', 'Cancelada')),
    data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
    data_aprovacao DATE
);

CREATE UNIQUE INDEX idx_pedido_aberto ON adocao (id_animal, id_adotante) WHERE situacao IN ('Pendente', 'Aprovada'); -- garante que um adotante não possa ter mais de um pedido aberto para o mesmo animal