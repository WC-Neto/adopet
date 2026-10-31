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
  nome_responsavel?: string | null;
  telefone_responsavel?: string | null;
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

export interface FiltrosAnimais {
  especie?: string;
  porte?: string;
  sexo?: string;
  cidade?: string;
  uf?: string;
  estado?: string;
  idade?: string;
  [key: string]: string | undefined;
}

export function listarAnimais(filtros?: FiltrosAnimais): Promise<Animal[]> {
  const params = new URLSearchParams();
  if (filtros) {
    if (filtros.especie?.trim()) params.set("especie", filtros.especie.trim());
    if (filtros.porte?.trim()) params.set("porte", filtros.porte.trim());
    if (filtros.sexo?.trim()) params.set("sexo", filtros.sexo.trim());
    if (filtros.cidade?.trim()) params.set("cidade", filtros.cidade.trim());
    const uf = (filtros.uf || filtros.estado)?.trim();
    if (uf) params.set("uf", uf);
  }
  const query = params.toString();
  return requisicao<Animal[]>(`/animais${query ? `?${query}` : ""}`);
}

export function buscarAnimal(id: string | number): Promise<Animal> {
  return requisicao<Animal>(`/animais/${encodeURIComponent(String(id))}`);
}

export function urlDaFoto(fotoUrl: string): string {
  if (!fotoUrl) return "";
  if (/^(https?|file|content|blob|data):/i.test(fotoUrl)) return fotoUrl;
  return `${API_URL}/${fotoUrl.replace(/^\/+/, "")}`;
}

export function obterFaixaEtaria(
  dataNascimento: string | null
): "Filhote" | "Adulto" | "Idoso" | null {
  if (!dataNascimento) return null;

  const [ano, mes, dia] = dataNascimento.slice(0, 10).split("-").map(Number);
  if (!ano || !mes || !dia) return null;

  const hoje = new Date();
  let meses = (hoje.getFullYear() - ano) * 12 + hoje.getMonth() + 1 - mes;
  if (hoje.getDate() < dia) meses -= 1;
  if (meses < 0) return null;

  const anos = Math.floor(meses / 12);
  if (anos < 1) return "Filhote";
  if (anos < 8) return "Adulto";
  return "Idoso";
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

export async function solicitarAdocao(
  id_animal: number,
  id_adotante: number
): Promise<{ mensagem: string; id_adocao?: number; ja_existia?: boolean }> {
  const resposta = await fetch(`${API_URL}/adocoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_animal, id_adotante }),
  });
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(corpo?.detail || "Erro ao solicitar adoção.");
  }
  return corpo;
}

export async function adicionarFavorito(
  id_animal: number,
  id_usuario: number
): Promise<{ mensagem: string }> {
  const resposta = await fetch(`${API_URL}/favoritos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_animal, id_usuario }),
  });
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(corpo?.detail || "Erro ao adicionar aos favoritos.");
  }
  return corpo;
}

export async function removerFavorito(
  id_animal: number,
  id_usuario: number
): Promise<{ mensagem: string }> {
  const resposta = await fetch(
    `${API_URL}/favoritos?id_usuario=${id_usuario}&id_animal=${id_animal}`,
    { method: "DELETE" }
  );
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(corpo?.detail || "Erro ao remover dos favoritos.");
  }
  return corpo;
}

export async function obterPerfilUsuario(id_usuario?: number): Promise<any> {
  const rota = id_usuario ? `/usuarios/${id_usuario}/perfil` : "/usuarios/me";
  return requisicao<any>(rota);
}

export function gerarLinkWhatsappAdocao(
  animal: Animal,
  nomeInteressado?: string | null
): string | null {
  const digitos = (animal.telefone_responsavel || "").replace(/\D/g, "");
  if (!digitos) return null;

  const numeroComDdi =
    digitos.startsWith("55") && digitos.length >= 12 ? digitos : `55${digitos}`;

  const idadeTexto = calcularIdade(animal.dt_nascimento);
  const sexoTexto = formatarSexo(animal.sexo);
  const localTexto = [animal.cidade, animal.uf].filter(Boolean).join(" - ");
  const saudacaoNome = animal.nome_responsavel
    ? `, ${animal.nome_responsavel}`
    : "";
  const identificacao = nomeInteressado?.trim()
    ? ` Me chamo ${nomeInteressado.trim()}.`
    : "";

  const mensagem = `Olá${saudacaoNome}! Tudo bem?${identificacao} Vi o anúncio no Adopet e tenho interesse em adotar o(a) ${animal.nome} (${animal.especie}, ${sexoTexto}, porte ${animal.porte.toLowerCase()}, idade: ${idadeTexto}, localizado em ${localTexto}). Podemos conversar sobre a adoção? 🐾`;

  return `https://wa.me/${numeroComDdi}?text=${encodeURIComponent(mensagem)}`;
}
