import { Usuario } from "./types";

// Usado quando o backend (GET /usuarios/me) não está acessível.
export const USUARIO_PADRAO: Usuario = {
  nome_usuario: "Usuario_Silva",
  email: "emailusuario@gmail.com",
  telefone: "(12) 34567-8910",
  cidade: "Três Lagoas, MS",
  data_nascimento: "27/10/2026",
  meus_pets: [
    { id: 1, nome: "Thor", sexo: "M", idade: "5 anos", localizacao: "Três Lagoas, MS", foto: "luna", status: "Disponível" },
    { id: 2, nome: "Joe", sexo: "M", idade: "9 anos", localizacao: "Três Lagoas, MS", foto: "joe", status: "Adotado(a)" },
  ],
  favoritos: [
    { id: 3, nome: "Jana", sexo: "F", idade: "1 ano", localizacao: "Três Lagoas, MS", foto: "jana" },
    { id: 4, nome: "Sam", sexo: "M", idade: "3 meses", localizacao: "Três Lagoas, MS", foto: "sam" },
    { id: 5, nome: "Rai", sexo: "M", idade: "8 anos", localizacao: "Três Lagoas, MS", foto: "rai" },
  ],
};
