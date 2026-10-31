import { createContext, ReactNode, useContext, useState } from "react";

// dados do pet que vao sendo juntados nas 3 telas do cadastro
export type DadosPet = {
  // informacoes basicas
  nome?: string;
  apelido?: string | null;
  foto_url?: string;
  especie?: string;
  porte?: string;
  sexo?: string;
  dt_nascimento?: string | null;
  // saude e bem-estar
  castrado?: boolean;
  vacinas?: string | null;
  vermifugado?: boolean;
  descricao_condicao?: string | null;
  descricao_medicamento?: string | null;
  historico_saude?: string | null;
  microchipado?: boolean;
  // comportamento
  historia?: string | null;
  motivo_doacao?: string | null;
  personalidade?: string | null;
};

type CadastroPetContextType = {
  dados: DadosPet;
  atualizar: (parcial: DadosPet) => void;
  limpar: () => void;
};

const CadastroPetContext = createContext<CadastroPetContextType | null>(null);

export function CadastroPetProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosPet>({});

  const atualizar = (parcial: DadosPet) =>
    setDados((atual) => ({ ...atual, ...parcial }));

  const limpar = () => setDados({});

  return (
    <CadastroPetContext.Provider value={{ dados, atualizar, limpar }}>
      {children}
    </CadastroPetContext.Provider>
  );
}

export function useCadastroPet() {
  const contexto = useContext(CadastroPetContext);
  if (!contexto) {
    throw new Error("useCadastroPet precisa estar dentro do CadastroPetProvider");
  }
  return contexto;
}
