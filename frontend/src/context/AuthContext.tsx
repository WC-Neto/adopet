import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

export type AuthUsuario = {
  id_usuario: number;
  nome: string;
  email: string;
  cpf?: string;
  telefone?: string;
  tipo_usuario?: string;
  cidade?: string;
  uf?: string;
  [key: string]: unknown;
} | null;

type AuthContextValue = {
  usuario: AuthUsuario;
  setUsuario: (usuario: AuthUsuario) => void;
  logout: () => void;
  carregandoSessao: boolean;
};

const STORAGE_KEY = "adopet_usuario_sessao";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function lerSessaoArmazenada(): AuthUsuario {
  if (Platform.OS !== "web") return null;
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as AuthUsuario) : null;
  } catch {
    return null;
  }
}

function salvarSessao(usuario: AuthUsuario) {
  if (Platform.OS !== "web") return;
  try {
    if (usuario) {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(usuario));
    } else {
      globalThis.localStorage?.removeItem(STORAGE_KEY);
      globalThis.sessionStorage?.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignora falhas de storage
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuarioState] = useState<AuthUsuario>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    const salvo = lerSessaoArmazenada();
    if (salvo) {
      setUsuarioState(salvo);
    }
    setCarregandoSessao(false);
  }, []);

  const setUsuario = useCallback((novoUsuario: AuthUsuario) => {
    setUsuarioState(novoUsuario);
    salvarSessao(novoUsuario);
  }, []);

  const logout = useCallback(() => {
    // Limpa estado e todo armazenamento de sessão antes de qualquer navegação.
    setUsuarioState(null);
    if (Platform.OS === "web") {
      try {
        globalThis.localStorage?.removeItem(STORAGE_KEY);
        globalThis.sessionStorage?.removeItem(STORAGE_KEY);
        // Remove também chaves legadas relacionadas à sessão, se existirem.
        const chavesParaRemover: string[] = [];
        for (let i = 0; i < (globalThis.localStorage?.length ?? 0); i++) {
          const k = globalThis.localStorage?.key(i);
          if (!k) continue;
          if (/^(adopet|usuario|auth|token|sessao)/i.test(k)) {
            chavesParaRemover.push(k);
          }
        }
        chavesParaRemover.forEach((k) => globalThis.localStorage?.removeItem(k));
      } catch {
        // ignora
      }
    }
  }, []);

  const value = useMemo(
    () => ({ usuario, setUsuario, logout, carregandoSessao }),
    [usuario, setUsuario, logout, carregandoSessao]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
