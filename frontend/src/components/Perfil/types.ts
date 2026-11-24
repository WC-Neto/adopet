export type PetPerfil = {
  id: number;
  nome: string;
  sexo: "M" | "F";
  idade: string;
  localizacao: string;
  /** Chave da foto em fotos.ts (ex.: "rai"). Sem foto cadastrada, aparece um placeholder. */
  foto: string;
  /** Só existe em "meus pets": "Disponível" ou "Adotada" */
  status?: "Disponível" | "Adotado(a)";
};

export type Usuario = {
  id_usuario?: number;
  nome_usuario: string;
  email: string;
  telefone: string;
  cidade: string;
  data_nascimento: string;
  meus_pets: PetPerfil[];
  favoritos: PetPerfil[];
  perfil_adocao_resultado?: string | null;
  perfil_adocao_respostas?: Record<string, string> | null;
  perfil_adocao_atualizado_em?: string | null;
};
