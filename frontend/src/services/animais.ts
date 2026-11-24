import { API_URL } from "./api";

export interface Animal {
  id_animal: number;
  nome: string;
  foto_url: string;
  especie: string;
  porte: string;
  sexo: string;
  dt_nascimento?: string | null;
  castrado?: boolean;
  vacinas?: string | null;
  vermifugado?: boolean;
  condicao_especial?: boolean;
  medicamento_continuo?: boolean;
  historico_saude?: string | null;
  microchipado?: boolean;
  historia?: string | null;
  motivo_doacao?: string | null;
  personalidade?: string | null;
  cidade: string;
  uf: string;
  situacao: string;
  id_responsavel: number;
  nome_responsavel?: string | null;
  telefone_responsavel?: string | null;
}

export interface FiltrosAnimais {
  especie?: string;
  porte?: string;
  sexo?: string;
  cidade?: string;
  uf?: string;
  estado?: string;
  idade?: string;
}

function parseDataNascimento(dt?: string | null): Date | null {
  if (!dt) return null;
  const valor = String(dt).trim();
  if (!valor) return null;

  // ISO / YYYY-MM-DD (backend DATE serializado)
  if (/^\d{4}-\d{2}-\d{2}/.test(valor)) {
    const d = new Date(valor);
    return isNaN(d.getTime()) ? null : d;
  }

  // DD/MM/AAAA
  const br = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (br) {
    const [, dd, mm, yyyy] = br;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(valor);
  return isNaN(d.getTime()) ? null : d;
}

export function calcularIdade(dt_nascimento?: string | null): string {
  const nascimento = parseDataNascimento(dt_nascimento);
  if (!nascimento) return "Idade não informada";

  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();

  if (hoje.getDate() < nascimento.getDate()) {
    meses -= 1;
  }
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }

  const totalMeses = anos * 12 + meses;
  if (totalMeses < 0) return "Idade não informada";

  if (anos <= 0) {
    const m = Math.max(0, meses);
    return `${m} ${m === 1 ? "mês" : "meses"}`;
  }

  if (meses <= 0) {
    return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  }

  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export function obterFaixaEtaria(dt_nascimento?: string | null): string | null {
  const nascimento = parseDataNascimento(dt_nascimento);
  if (!nascimento) return null;
  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();
  if (hoje.getDate() < nascimento.getDate()) meses -= 1;
  if (meses < 0) {
    anos -= 1;
    meses += 12;
  }
  const totalMeses = anos * 12 + meses;
  if (totalMeses < 0) return null;
  if (totalMeses < 12) return "Filhote";
  if (anos < 8) return "Adulto";
  return "Idoso";
}

export function urlDaFoto(foto_url?: string | null): string {
  if (!foto_url) return "";
  const valor = String(foto_url).trim();
  if (!valor) return "";
  if (/^https?:\/\//i.test(valor) || valor.startsWith("data:")) {
    return valor;
  }
  if (valor.startsWith("/")) return `${API_URL}${valor}`;
  return `${API_URL}/${valor}`;
}

export function formatarSexo(sexo?: string | null): string {
  if (!sexo) return "Não informado";
  const s = sexo.trim().toUpperCase();
  if (s === "M" || s === "MACHO") return "Macho";
  if (s === "F" || s === "FÊMEA" || s === "FEMEA") return "Fêmea";
  return sexo;
}

export async function listarAnimais(filtros: FiltrosAnimais = {}): Promise<Animal[]> {
  const params = new URLSearchParams();
  const uf = filtros.uf || filtros.estado;
  if (filtros.especie) params.set("especie", filtros.especie);
  if (filtros.porte) params.set("porte", filtros.porte);
  if (filtros.sexo) params.set("sexo", filtros.sexo);
  if (filtros.cidade) params.set("cidade", filtros.cidade);
  if (uf) params.set("uf", uf);

  const qs = params.toString();
  const response = await fetch(`${API_URL}/animais${qs ? `?${qs}` : ""}`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Não foi possível carregar os pets.");
  }
  return response.json();
}

export async function buscarAnimal(id: string | number): Promise<Animal> {
  const response = await fetch(`${API_URL}/animais/${id}`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Não foi possível carregar os detalhes do pet.");
  }
  return response.json();
}

export async function adicionarFavorito(id_animal: number, id_usuario: number) {
  const response = await fetch(`${API_URL}/favoritos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_animal, id_usuario }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao favoritar pet.");
  }
  return data;
}

export async function removerFavorito(id_animal: number, id_usuario: number) {
  const params = new URLSearchParams({
    id_usuario: String(id_usuario),
    id_animal: String(id_animal),
  });
  const response = await fetch(`${API_URL}/favoritos?${params.toString()}`, {
    method: "DELETE",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao remover favorito.");
  }
  return data;
}

export async function listarFavoritos(id_usuario: number): Promise<Animal[]> {
  const response = await fetch(`${API_URL}/usuarios/${id_usuario}/favoritos`);
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.detail || "Não foi possível carregar favoritos.");
  }
  return response.json();
}

export async function solicitarAdocao(id_animal: number, id_adotante: number) {
  const response = await fetch(`${API_URL}/adocoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_animal, id_adotante }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail || "Erro ao registrar solicitação de adoção.");
  }
  return data;
}

export function gerarLinkWhatsappAdocao(
  animal: Pick<Animal, "nome" | "telefone_responsavel">,
  nomeInteressado?: string
): string | null {
  const tel = (animal.telefone_responsavel || "").replace(/\D/g, "");
  if (!tel) return null;
  const numero = tel.length <= 11 ? `55${tel}` : tel;
  const quem = nomeInteressado ? `, meu nome é ${nomeInteressado}` : "";
  const msg = `Olá! Vi o pet ${animal.nome} no Adopet${quem} e tenho interesse em adotá-lo(a). Podemos conversar?`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
}
