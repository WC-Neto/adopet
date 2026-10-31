import Constants from "expo-constants";
import { Platform } from "react-native";
import type { DadosPet } from "../context/CadastroPetContext";

// endereco da api
const debuggerHost = Constants.expoConfig?.hostUri?.split(":")[0];
export const API_URL =
  Platform.OS === "web"
    ? "http://127.0.0.1:8000"
    : debuggerHost
      ? `http://${debuggerHost}:8000`
      : "http://192.168.1.179:8000";

type Resultado = { ok: true } | { ok: false; erro: string };

// manda o pet completo pra api
export async function cadastrarAnimal(dados: DadosPet): Promise<Resultado> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_URL}/animais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(dados),
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detalhe = data?.detail;
      return {
        ok: false,
        erro:
          typeof detalhe === "string"
            ? detalhe
            : "Erro ao cadastrar o pet. Confira os dados e tente de novo.",
      };
    }

    return { ok: true };
  } catch (e: any) {
    clearTimeout(timeoutId);
    // se demorar muito provavelmente e o banco
    if (e?.name === "AbortError") {
      return {
        ok: false,
        erro: "A API demorou demais. Confira se o PostgreSQL está ligado e a senha no .env do backend.",
      };
    }
    return {
      ok: false,
      erro: "Não foi possível conectar ao servidor FastAPI (porta 8000). Verifique se o uvicorn está rodando.",
    };
  }
}
