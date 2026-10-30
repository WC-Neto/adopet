import { API_URL } from "./api";

export interface Animal {
  id_animal: number;
  nome: string;
  foto_url: string;
  especie: string;
  porte: string;
  sexo: string;
  dt_nascimento: string | null;
  castrado: boolean;
  vacinas: string | null;
  vermifugado: boolean;
  condicao_especial: boolean;
  medicamento_continuo: boolean;
  historico_saude: string | null;
  microchipado: boolean;
  historia: string | null;
  motivo_doacao: string | null;
  personalidade: string | null;
  cidade: string;
  uf: string;
  situacao: string;
  id_responsavel: number;
}

async function requisicao<T>(rota: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const resposta = await fetch(`${API_URL}${rota}`, {
      signal: controller.signal,
    });
    const corpo = await resposta.json().catch(() => null);

    if (!resposta.ok) {
      throw new Error(
        typeof corpo?.detail === "string"
          ? corpo.detail
          : `A API respondeu com erro (${resposta.status}).`,
      );
    }

    return corpo as T;
  } catch (erro) {
    if (erro instanceof Error && erro.name === "AbortError") {
      throw new Error("A conexão com a API demorou demais. Tente novamente.");
    }
    if (erro instanceof TypeError) {
      throw new Error("Não foi possível conectar à API de animais.");
    }
    throw erro;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function listarAnimais(): Promise<Animal[]> {
  return requisicao<Animal[]>("/animais");
}

export function buscarAnimal(id: string | number): Promise<Animal> {
  return requisicao<Animal>(`/animais/${encodeURIComponent(String(id))}`);
}

export function urlDaFoto(fotoUrl: string): string {
  if (/^(https?|file|content|blob):/i.test(fotoUrl)) return fotoUrl;
  return `${API_URL}/${fotoUrl.replace(/^\/+/, "")}`;
}

export function calcularIdade(dataNascimento: string | null): string {
  if (!dataNascimento) return "Não informado";

  const [ano, mes, dia] = dataNascimento.slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return "Não informado";

  const hoje = new Date();
  let meses =
    (hoje.getFullYear() - ano) * 12 + hoje.getMonth() + 1 - mes;
  if (hoje.getDate() < dia) meses -= 1;
  if (meses < 0) return "Não informado";

  const anos = Math.floor(meses / 12);
  return anos > 0
    ? `${anos} ${anos === 1 ? "ano" : "anos"}`
    : `${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export function formatarSexo(sexo: string): string {
  const valor = sexo.trim().toUpperCase();
  return valor === "M" ? "Macho" : valor === "F" ? "Fêmea" : sexo;
}
