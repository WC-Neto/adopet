-- Migration: favoritos (relação usuário x pet)
CREATE TABLE IF NOT EXISTS favorito (
    id_favorito   SERIAL PRIMARY KEY,
    id_usuario    INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_animal     INT NOT NULL REFERENCES animal(id_animal) ON DELETE CASCADE,
    data_criacao  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT favorito_usuario_animal_unico UNIQUE (id_usuario, id_animal)
);
