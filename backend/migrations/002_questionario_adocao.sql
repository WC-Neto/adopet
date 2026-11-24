-- Migration: questionário de perfil de adoção
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS perfil_adocao_resultado TEXT;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS perfil_adocao_respostas JSONB;
ALTER TABLE usuario ADD COLUMN IF NOT EXISTS perfil_adocao_atualizado_em TIMESTAMP;
