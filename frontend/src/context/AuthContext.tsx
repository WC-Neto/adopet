import { createContext, ReactNode, useContext, useState } from "react";

export type UsuarioLogado = {
  id_usuario: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipo_usuario: string;
  cidade: string;
  uf: string;
};

type AuthContextData = {
  usuario: UsuarioLogado | null;
  setUsuario: (usuario: UsuarioLogado | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({
  usuario: null,
  setUsuario: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  const logout = () => {
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
