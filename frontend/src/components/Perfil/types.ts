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
  nome_usuario: string;
  email: string;
  telefone: string;
  cidade: string;
  data_nascimento: string;
  meus_pets: PetPerfil[];
  favoritos: PetPerfil[];
};
