-- dados de exemplo pra testar o cadastro de pet

-- precisa de pelo menos 1 usuario (responsavel do animal)
INSERT INTO usuario (nome, email, senha_hash, cpf, telefone, tipo_usuario, cidade, uf) VALUES
    ('ONG Patas Amigas', 'ong@gmail.com', 'hashed_password1', '12345678901', '11999999999', 'ONG', 'Três Lagoas', 'MS');

-- exemplos de animais
INSERT INTO animal (
    nome, foto_url, especie, porte, sexo, dt_nascimento,
    castrado, vacinas, vermifugado, personalidade, cidade, uf, situacao, id_responsavel
) VALUES
    ('Felix', '/fotos/felix.jpg', 'Cachorro', 'Médio', 'M', '2021-10-18', TRUE, 'V10, Antirrábica', TRUE, 'Calmo e carinhoso', 'Três Lagoas', 'MS', 'Disponível', 1),
    ('Jana', '/fotos/jana.jpg', 'Gato', 'Pequeno', 'F', '2025-10-18', TRUE, 'Tríplice felina', TRUE, 'Curiosa e brincalhona', 'Três Lagoas', 'MS', 'Disponível', 1);
