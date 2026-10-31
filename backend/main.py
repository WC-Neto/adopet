# API do Adopet (Usuários e Animais)
# rodar: uvicorn main:app --reload --host 0.0.0.0 --port 8000

import base64
import hashlib
import os
import re
import uuid
from datetime import date, datetime
from pathlib import Path
from typing import List, Optional

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

PATH = Path(__file__).resolve().parent
for env_candidate in (PATH.parent / ".env", PATH / ".env"):
    if env_candidate.exists():
        load_dotenv(env_candidate)
        break

HOST = os.environ.get("PGHOST", "localhost")
PORT = os.environ.get("PGPORT", "5432")
USER = os.environ.get("PGUSER", "postgres")
SENHA = os.environ.get("PGPASSWORD", "")
BANCO = "adopet"


def conectar(banco: str = BANCO, **opcoes) -> psycopg.Connection:
    return psycopg.connect(
        host=HOST,
        port=PORT,
        user=USER,
        password=SENHA,
        dbname=banco,
        connect_timeout=3,
        **opcoes,
    )


app = FastAPI(title="Adopet API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FOTOS_DIR = PATH / "fotos"
FOTOS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/fotos", StaticFiles(directory=str(FOTOS_DIR)), name="fotos")


class UsuarioCreate(BaseModel):
    nome: str
    cpf: str
    email: str
    telefone: str
    senha: str
    sexo: Optional[str] = None
    data_nascimento: Optional[str] = None
    tipo_usuario: str = "Adotante"
    cidade: str = "Três Lagoas"
    uf: str = "MS"


class UsuarioResponse(BaseModel):
    id_usuario: int
    nome: str
    email: str
    cpf: str
    telefone: str
    tipo_usuario: str
    cidade: str
    uf: str


class UsuarioLogin(BaseModel):
    email: str
    senha: str


class UsuarioAlterarSenha(BaseModel):
    email: str
    nova_senha: str
    cpf: Optional[str] = None


class AnimalCreate(BaseModel):
    nome: str
    foto_url: str
    especie: str
    porte: str
    sexo: str  # Macho/Femea ou M/F
    dt_nascimento: Optional[str] = None  # DD/MM/AAAA
    apelido: Optional[str] = None
    cidade: str = "Três Lagoas"
    uf: str = "MS"
    id_responsavel: int = 1


class AnimalResponse(BaseModel):
    id_animal: int
    nome: str
    foto_url: str
    especie: str
    porte: str
    sexo: str
    dt_nascimento: Optional[date] = None
    castrado: bool = False
    vacinas: Optional[str] = None
    vermifugado: bool = False
    condicao_especial: bool = False
    medicamento_continuo: bool = False
    historico_saude: Optional[str] = None
    microchipado: bool = False
    historia: Optional[str] = None
    motivo_doacao: Optional[str] = None
    personalidade: Optional[str] = None
    cidade: str
    uf: str
    situacao: str
    id_responsavel: int
    nome_responsavel: Optional[str] = None
    telefone_responsavel: Optional[str] = None


COLUNAS_ANIMAL = """
    id_animal, nome, foto_url, especie, porte, sexo, dt_nascimento,
    castrado, vacinas, vermifugado, condicao_especial,
    medicamento_continuo, historico_saude, microchipado, historia,
    motivo_doacao, personalidade, cidade, uf, situacao, id_responsavel
"""


def resposta_animal(linha) -> AnimalResponse:
    return AnimalResponse(
        id_animal=linha[0],
        nome=linha[1],
        foto_url=linha[2],
        especie=linha[3],
        porte=linha[4],
        sexo=linha[5],
        dt_nascimento=linha[6],
        castrado=linha[7],
        vacinas=linha[8],
        vermifugado=linha[9],
        condicao_especial=linha[10],
        medicamento_continuo=linha[11],
        historico_saude=linha[12],
        microchipado=linha[13],
        historia=linha[14],
        motivo_doacao=linha[15],
        personalidade=linha[16],
        cidade=linha[17],
        uf=linha[18],
        situacao=linha[19],
        id_responsavel=linha[20],
        nome_responsavel=linha[21] if len(linha) > 21 else None,
        telefone_responsavel=linha[22] if len(linha) > 22 else None,
    )


class ItemMenu(BaseModel):
    label: str
    rota: str


MENU_ITENS: List[ItemMenu] = [
    ItemMenu(label="Início", rota="/inicio"),
    ItemMenu(label="Adotar", rota="/pet-adocao"),
    ItemMenu(label="Doar", rota="/doar"),
    ItemMenu(label="Filtros", rota="/filtro"),
    ItemMenu(label="Minha conta", rota="/conta"),
    ItemMenu(label="Sobre nós", rota="/sobreNos"),
    ItemMenu(label="FAQ", rota="/faq"),
]


class PetPerfil(BaseModel):
    id: int
    nome: str
    sexo: str
    idade: str
    localizacao: str
    foto: str
    status: Optional[str] = None


class UsuarioPerfil(BaseModel):
    id_usuario: int = 1
    nome_usuario: str
    email: str
    telefone: str
    cidade: str
    data_nascimento: str = "Não informada"
    tipo_usuario: str = "Adotante"
    meus_pets: List[PetPerfil] = []
    favoritos: List[PetPerfil] = []


def calcular_idade_pet(dt_nasc) -> str:
    if not dt_nasc:
        return "Não informado"
    hoje = date.today()
    meses = (hoje.year - dt_nasc.year) * 12 + hoje.month - dt_nasc.month
    if hoje.day < dt_nasc.day:
        meses -= 1
    if meses < 0:
        return "Não informado"
    anos = meses // 12
    if anos > 0:
        return f"{anos} {'ano' if anos == 1 else 'anos'}"
    return f"{meses} {'mês' if meses == 1 else 'meses'}"


def montar_perfil_usuario(id_usuario: int, conn) -> UsuarioPerfil:
    u = conn.execute(
        "SELECT id_usuario, nome, email, telefone, tipo_usuario, cidade, uf FROM usuario WHERE id_usuario = %s",
        (id_usuario,)
    ).fetchone()
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")

    # Meus pets: criados pelo usuario OU adotados / em processo
    pets_rows = conn.execute(
        """
        SELECT a.id_animal, a.nome, a.sexo, a.dt_nascimento, a.cidade, a.uf, a.foto_url, a.situacao
        FROM animal a
        WHERE a.id_responsavel = %s
        UNION
        SELECT a.id_animal, a.nome, a.sexo, a.dt_nascimento, a.cidade, a.uf, a.foto_url,
               CASE WHEN ad.situacao = 'Aprovada' THEN 'Adotado(a)' ELSE 'Em Processo' END as situacao
        FROM animal a
        JOIN adocao ad ON ad.id_animal = a.id_animal
        WHERE ad.id_adotante = %s AND ad.situacao IN ('Pendente', 'Aprovada')
        ORDER BY id_animal
        """,
        (id_usuario, id_usuario)
    ).fetchall()

    meus_pets = [
        PetPerfil(
            id=r[0],
            nome=r[1],
            sexo=r[2],
            idade=calcular_idade_pet(r[3]),
            localizacao=f"{r[4]}, {r[5]}",
            foto=r[6],
            status=r[7]
        )
        for r in pets_rows
    ]

    # Favoritos
    favs_rows = conn.execute(
        """
        SELECT a.id_animal, a.nome, a.sexo, a.dt_nascimento, a.cidade, a.uf, a.foto_url, a.situacao
        FROM animal a
        JOIN favorito f ON f.id_animal = a.id_animal
        WHERE f.id_usuario = %s
        ORDER BY f.data_criacao DESC
        """,
        (id_usuario,)
    ).fetchall()

    favoritos = [
        PetPerfil(
            id=r[0],
            nome=r[1],
            sexo=r[2],
            idade=calcular_idade_pet(r[3]),
            localizacao=f"{r[4]}, {r[5]}",
            foto=r[6],
            status=r[7]
        )
        for r in favs_rows
    ]

    return UsuarioPerfil(
        id_usuario=u[0],
        nome_usuario=u[1],
        email=u[2],
        telefone=u[3],
        tipo_usuario=u[4],
        cidade=f"{u[5]}, {u[6]}",
        data_nascimento="Não informada",
        meus_pets=meus_pets,
        favoritos=favoritos
    )


def converter_sexo(sexo: str) -> str:
    valor = sexo.strip().lower()
    if valor in ("m", "macho"):
        return "M"
    if valor in ("f", "femea", "fêmea"):
        return "F"
    raise HTTPException(status_code=400, detail="Sexo deve ser Macho ou Fêmea.")


def converter_data(texto: Optional[str]) -> Optional[date]:
    if not texto or not texto.strip():
        return None

    texto = texto.strip()
    for formato in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(texto, formato).date()
        except ValueError:
            pass

    raise HTTPException(
        status_code=400,
        detail="Data inválida. Use DD/MM/AAAA.",
    )


@app.get("/")
def home():
    return {"message": "API do Adopet rodando com sucesso no PostgreSQL!"}


@app.get("/usuarios", response_model=List[UsuarioResponse])
def listar_usuarios():
    try:
        with conectar(BANCO) as conn:
            linhas = conn.execute(
                """
                SELECT id_usuario, nome, email, cpf, telefone, tipo_usuario, cidade, uf
                FROM usuario
                ORDER BY id_usuario
                """
            ).fetchall()
            return [
                UsuarioResponse(
                    id_usuario=r[0],
                    nome=r[1],
                    email=r[2],
                    cpf=r[3],
                    telefone=r[4],
                    tipo_usuario=r[5],
                    cidade=r[6],
                    uf=r[7],
                )
                for r in linhas
            ]
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao consultar o PostgreSQL: {e}",
        )


@app.post("/usuarios", response_model=UsuarioResponse, status_code=201)
def criar_usuario(usuario: UsuarioCreate):
    nome_limpo = usuario.nome.strip()
    email_limpo = usuario.email.strip().lower()
    cpf_limpo = re.sub(r"\D", "", usuario.cpf)
    telefone_limpo = re.sub(r"\D", "", usuario.telefone)[:11]

    if not nome_limpo or not email_limpo:
        raise HTTPException(
            status_code=400,
            detail="Nome e e-mail são obrigatórios.",
        )

    if len(cpf_limpo) != 11:
        raise HTTPException(
            status_code=400,
            detail="O CPF deve conter exatamente 11 dígitos numéricos.",
        )

    if len(telefone_limpo) < 10:
        raise HTTPException(
            status_code=400,
            detail="Informe um telefone válido com DDD (10 ou 11 dígitos).",
        )

    if len(usuario.senha) < 8:
        raise HTTPException(
            status_code=400,
            detail="A senha deve ter no mínimo 8 caracteres.",
        )

    senha_hash = hashlib.sha256(usuario.senha.encode("utf-8")).hexdigest()

    try:
        with conectar(BANCO) as conn:
            linha = conn.execute(
                """
                INSERT INTO usuario (nome, email, senha_hash, cpf, telefone, tipo_usuario, cidade, uf)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_usuario, nome, email, cpf, telefone, tipo_usuario, cidade, uf
                """,
                (
                    nome_limpo,
                    email_limpo,
                    senha_hash,
                    cpf_limpo,
                    telefone_limpo,
                    usuario.tipo_usuario,
                    usuario.cidade.strip(),
                    usuario.uf.strip().upper(),
                ),
            ).fetchone()
            conn.commit()

            if not linha:
                raise HTTPException(
                    status_code=500,
                    detail="Não foi possível criar o usuário.",
                )

            return UsuarioResponse(
                id_usuario=linha[0],
                nome=linha[1],
                email=linha[2],
                cpf=linha[3],
                telefone=linha[4],
                tipo_usuario=linha[5],
                cidade=linha[6],
                uf=linha[7],
            )
    except psycopg.errors.UniqueViolation:
        raise HTTPException(
            status_code=409,
            detail="Já existe um usuário cadastrado com este CPF ou e-mail.",
        )
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


@app.post("/login", response_model=UsuarioResponse)
def login_usuario(credenciais: UsuarioLogin):
    email_limpo = credenciais.email.strip().lower()
    senha = credenciais.senha

    if not email_limpo or not senha:
        raise HTTPException(
            status_code=400,
            detail="Informe o e-mail e a senha.",
        )

    senha_hash = hashlib.sha256(senha.encode("utf-8")).hexdigest()

    try:
        with conectar(BANCO) as conn:
            linha = conn.execute(
                """
                SELECT id_usuario, nome, email, cpf, telefone, tipo_usuario, cidade, uf, senha_hash
                FROM usuario
                WHERE LOWER(email) = %s
                """,
                (email_limpo,),
            ).fetchone()

            if not linha or (linha[8] != senha_hash and linha[8] != senha):
                raise HTTPException(
                    status_code=401,
                    detail="E-mail ou senha incorretos.",
                )

            return UsuarioResponse(
                id_usuario=linha[0],
                nome=linha[1],
                email=linha[2],
                cpf=linha[3],
                telefone=linha[4],
                tipo_usuario=linha[5],
                cidade=linha[6],
                uf=linha[7],
            )
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


@app.put("/usuarios/senha")
def alterar_senha(dados: UsuarioAlterarSenha):
    email_limpo = dados.email.strip().lower()
    cpf_limpo = re.sub(r"\D", "", dados.cpf) if dados.cpf else None

    if not email_limpo:
        raise HTTPException(
            status_code=400,
            detail="Informe o e-mail.",
        )

    if len(dados.nova_senha) < 8:
        raise HTTPException(
            status_code=400,
            detail="A nova senha deve ter no mínimo 8 caracteres.",
        )

    nova_senha_hash = hashlib.sha256(dados.nova_senha.encode("utf-8")).hexdigest()

    try:
        with conectar(BANCO) as conn:
            linha = conn.execute(
                """
                SELECT id_usuario, cpf
                FROM usuario
                WHERE LOWER(email) = %s
                """,
                (email_limpo,),
            ).fetchone()

            if not linha:
                raise HTTPException(
                    status_code=404,
                    detail="Nenhum usuário encontrado com este e-mail.",
                )

            if cpf_limpo and linha[1] != cpf_limpo:
                raise HTTPException(
                    status_code=400,
                    detail="O CPF informado não corresponde a este e-mail.",
                )

            conn.execute(
                """
                UPDATE usuario
                SET senha_hash = %s
                WHERE id_usuario = %s
                """,
                (nova_senha_hash, linha[0]),
            )
            conn.commit()

            return {"message": "Senha alterada com sucesso!"}
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


@app.get("/menu", response_model=List[ItemMenu])
def listar_itens_menu():
    return MENU_ITENS


@app.get("/usuarios/me", response_model=UsuarioPerfil)
def obter_usuario_logado(id_usuario: Optional[int] = None):
    try:
        with conectar(BANCO) as conn:
            if not id_usuario:
                padrao = conn.execute("SELECT id_usuario FROM usuario WHERE id_usuario = 2").fetchone()
                if not padrao:
                    padrao = conn.execute("SELECT id_usuario FROM usuario ORDER BY id_usuario LIMIT 1").fetchone()
                id_usuario = padrao[0] if padrao else 1
            return montar_perfil_usuario(id_usuario, conn)
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"Erro ao consultar perfil: {e}")


@app.get("/usuarios/{id_usuario}/perfil", response_model=UsuarioPerfil)
def obter_perfil_usuario_por_id(id_usuario: int):
    try:
        with conectar(BANCO) as conn:
            return montar_perfil_usuario(id_usuario, conn)
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"Erro ao consultar perfil: {e}")


@app.get("/animais", response_model=List[AnimalResponse])
def listar_animais(
    especie: Optional[str] = None,
    porte: Optional[str] = None,
    sexo: Optional[str] = None,
    cidade: Optional[str] = None,
    uf: Optional[str] = None,
):
    try:
        with conectar(BANCO) as conn:
            query = """
                SELECT a.id_animal, a.nome, a.foto_url, a.especie, a.porte, a.sexo, a.dt_nascimento,
                       a.castrado, a.vacinas, a.vermifugado, a.condicao_especial,
                       a.medicamento_continuo, a.historico_saude, a.microchipado, a.historia,
                       a.motivo_doacao, a.personalidade, a.cidade, a.uf, a.situacao, a.id_responsavel,
                       u.nome as nome_resp, u.telefone as tel_resp
                FROM animal a
                LEFT JOIN usuario u ON u.id_usuario = a.id_responsavel
                WHERE a.situacao = 'Disponível'
            """
            condicoes = []
            params = []

            if especie and especie.strip():
                esp = especie.strip().lower()
                if esp == "outro":
                    condicoes.append("LOWER(a.especie) NOT IN ('cachorro', 'gato')")
                else:
                    condicoes.append("LOWER(a.especie) = LOWER(%s)")
                    params.append(especie.strip())

            if porte and porte.strip():
                condicoes.append("LOWER(a.porte) = LOWER(%s)")
                params.append(porte.strip())

            if sexo and sexo.strip():
                s = sexo.strip()
                sb = converter_sexo(s)
                condicoes.append("(a.sexo = %s OR a.sexo = %s)")
                params.extend([sb, s])

            if cidade and cidade.strip():
                condicoes.append("LOWER(a.cidade) = LOWER(%s)")
                params.append(cidade.strip())

            if uf and uf.strip():
                condicoes.append("UPPER(a.uf) = UPPER(%s)")
                params.append(uf.strip())

            if condicoes:
                query += " AND " + " AND ".join(condicoes)

            query += " ORDER BY a.id_animal"
            linhas = conn.execute(query, tuple(params)).fetchall()
            return [resposta_animal(linha) for linha in linhas]
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao consultar o PostgreSQL: {e}",
        )


@app.get("/animais/{id_animal}", response_model=AnimalResponse)
def buscar_animal(id_animal: int):
    try:
        with conectar(BANCO) as conn:
            linha = conn.execute(
                f"""
                SELECT a.id_animal, a.nome, a.foto_url, a.especie, a.porte, a.sexo, a.dt_nascimento,
                       a.castrado, a.vacinas, a.vermifugado, a.condicao_especial,
                       a.medicamento_continuo, a.historico_saude, a.microchipado, a.historia,
                       a.motivo_doacao, a.personalidade, a.cidade, a.uf, a.situacao, a.id_responsavel,
                       u.nome as nome_resp, u.telefone as tel_resp
                FROM animal a
                LEFT JOIN usuario u ON u.id_usuario = a.id_responsavel
                WHERE a.id_animal = %s
                """,
                (id_animal,),
            ).fetchone()

        if linha is None:
            raise HTTPException(status_code=404, detail="Pet não encontrado.")
        resp = resposta_animal(linha)
        resp.nome_responsavel = linha[21] if len(linha) > 21 else None
        resp.telefone_responsavel = linha[22] if len(linha) > 22 else None
        return resp
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao consultar o PostgreSQL: {e}",
        )


@app.post("/animais", response_model=AnimalResponse, status_code=201)
def criar_animal(animal: AnimalCreate):
    nome_limpo = animal.nome.strip()
    foto = animal.foto_url.strip()
    especie = animal.especie.strip()
    porte = animal.porte.strip()
    sexo_banco = converter_sexo(animal.sexo)
    data_nasc = converter_data(animal.dt_nascimento)
    cidade = animal.cidade.strip() or "Três Lagoas"
    uf = animal.uf.strip().upper() or "MS"

    if not nome_limpo:
        raise HTTPException(status_code=400, detail="O nome do pet é obrigatório.")

    if not foto:
        raise HTTPException(status_code=400, detail="A foto do pet é obrigatória.")

    if foto.startswith("data:image") or (len(foto) > 500 and not foto.startswith("http")):
        try:
            if "," in foto:
                cabecalho, conteudo = foto.split(",", 1)
                ext = "png" if "png" in cabecalho else "jpg"
            else:
                conteudo = foto
                ext = "jpg"
            dados_img = base64.b64decode(conteudo)
            nome_arquivo = f"pet_{uuid.uuid4().hex[:12]}.{ext}"
            caminho_arquivo = FOTOS_DIR / nome_arquivo
            caminho_arquivo.write_bytes(dados_img)
            foto = f"/fotos/{nome_arquivo}"
        except Exception:
            pass

    if especie not in ("Cachorro", "Gato", "Outro"):
        raise HTTPException(
            status_code=400,
            detail="Espécie inválida. Use Cachorro, Gato ou Outro.",
        )

    if porte not in ("Pequeno", "Médio", "Grande"):
        raise HTTPException(
            status_code=400,
            detail="Porte inválido. Use Pequeno, Médio ou Grande.",
        )

    if not re.fullmatch(r"[A-Z]{2}", uf):
        raise HTTPException(status_code=400, detail="UF inválida.")

    personalidade = None
    if animal.apelido and animal.apelido.strip():
        personalidade = f"Apelido: {animal.apelido.strip()}"

    try:
        with conectar(BANCO) as conn:
            existe = conn.execute(
                "SELECT 1 FROM usuario WHERE id_usuario = %s",
                (animal.id_responsavel,),
            ).fetchone()
            if not existe:
                raise HTTPException(
                    status_code=400,
                    detail="Responsável não encontrado. Cadastre um usuário antes.",
                )

            novo_id = conn.execute(
                """
                INSERT INTO animal (
                    nome, foto_url, especie, porte, sexo, dt_nascimento,
                    personalidade, cidade, uf, id_responsavel
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_animal
                """,
                (
                    nome_limpo,
                    foto,
                    especie,
                    porte,
                    sexo_banco,
                    data_nasc,
                    personalidade,
                    cidade,
                    uf,
                    animal.id_responsavel,
                ),
            ).fetchone()
            conn.commit()

            if not novo_id:
                raise HTTPException(
                    status_code=500,
                    detail="Não foi possível cadastrar o animal.",
                )

            linha = conn.execute(
                f"SELECT {COLUNAS_ANIMAL} FROM animal WHERE id_animal = %s",
                (novo_id[0],),
            ).fetchone()
            return resposta_animal(linha)
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


# ---------- saude (julia) ----------

class SaudeUpdate(BaseModel):
    castrado: str
    vacinas: str
    vermifugado: str
    condicao_especial: str
    descricao_condicao: Optional[str] = None
    medicamento_continuo: str
    historico_saude: Optional[str] = None
    microchipado: str


def converter_sim_nao(valor: str) -> bool:
    valor = valor.strip().lower()
    if valor == "sim":
        return True
    if valor in ("não", "nao"):
        return False
    raise HTTPException(
        status_code=400,
        detail="Informe Sim ou Não nos campos de seleção.",
    )


@app.put("/animais/{id_animal}/saude")
def atualizar_saude(id_animal: int, saude: SaudeUpdate):
    castrado = converter_sim_nao(saude.castrado)
    vermifugado = converter_sim_nao(saude.vermifugado)
    condicao_especial = converter_sim_nao(saude.condicao_especial)
    medicamento_continuo = converter_sim_nao(saude.medicamento_continuo)
    microchipado = converter_sim_nao(saude.microchipado)

    vacinas = saude.vacinas.strip()
    if len(vacinas) > 200:
        raise HTTPException(
            status_code=400,
            detail="A lista de vacinas deve ter no máximo 200 caracteres.",
        )

    # junta descricao da condicao ao historico
    descricao = (saude.descricao_condicao or "").strip()
    historico = (saude.historico_saude or "").strip()
    partes_historico = []
    if descricao:
        partes_historico.append(f"Descrição da condição especial: {descricao}")
    if historico:
        partes_historico.append(f"Histórico de saúde: {historico}")
    historico_final = "\n".join(partes_historico) or None

    try:
        with conectar(BANCO) as conn:
            existe = conn.execute(
                "SELECT 1 FROM animal WHERE id_animal = %s",
                (id_animal,),
            ).fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Animal não encontrado.")

            conn.execute(
                """
                UPDATE animal
                SET castrado = %s,
                    vacinas = %s,
                    vermifugado = %s,
                    condicao_especial = %s,
                    medicamento_continuo = %s,
                    historico_saude = %s,
                    microchipado = %s
                WHERE id_animal = %s
                """,
                (
                    castrado,
                    vacinas,
                    vermifugado,
                    condicao_especial,
                    medicamento_continuo,
                    historico_final,
                    microchipado,
                    id_animal,
                ),
            )
            conn.commit()

        return {
            "mensagem": "Dados de saúde atualizados com sucesso.",
            "id_animal": id_animal,
        }
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


# ---------- comportamento (pedro) ----------

class ComportamentoUpdate(BaseModel):
    historia: Optional[str] = None
    motivo_doacao: Optional[str] = None
    personalidade: Optional[str] = None


@app.put("/animais/{id_animal}/comportamento")
def atualizar_comportamento(id_animal: int, dados: ComportamentoUpdate):
    historia = (dados.historia or "").strip() or None
    motivo = (dados.motivo_doacao or "").strip() or None
    personalidade = (dados.personalidade or "").strip() or None

    try:
        with conectar(BANCO) as conn:
            existe = conn.execute(
                "SELECT 1 FROM animal WHERE id_animal = %s",
                (id_animal,),
            ).fetchone()
            if not existe:
                raise HTTPException(status_code=404, detail="Animal não encontrado.")

            conn.execute(
                """
                UPDATE animal
                SET historia = %s,
                    motivo_doacao = %s,
                    personalidade = %s
                WHERE id_animal = %s
                """,
                (historia, motivo, personalidade, id_animal),
            )
            conn.commit()

        return {
            "mensagem": "Dados de comportamento atualizados com sucesso.",
            "id_animal": id_animal,
        }
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )


# ---------- adocoes e favoritos ----------

class AdocaoCreate(BaseModel):
    id_animal: int
    id_adotante: int


@app.post("/adocoes", status_code=201)
def solicitar_adocao(dados: AdocaoCreate):
    try:
        with conectar(BANCO) as conn:
            pet = conn.execute(
                "SELECT id_animal, nome, situacao FROM animal WHERE id_animal = %s",
                (dados.id_animal,),
            ).fetchone()
            if not pet:
                raise HTTPException(status_code=404, detail="Animal não encontrado.")
            user = conn.execute(
                "SELECT id_usuario FROM usuario WHERE id_usuario = %s",
                (dados.id_adotante,),
            ).fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="Usuário adotante não encontrado.")

            existente = conn.execute(
                "SELECT id_adocao, situacao FROM adocao WHERE id_animal = %s AND id_adotante = %s AND situacao IN ('Pendente', 'Aprovada')",
                (dados.id_animal, dados.id_adotante),
            ).fetchone()
            if existente:
                return {
                    "mensagem": f"Você já possui uma solicitação ({existente[1]}) para este pet.",
                    "id_adocao": existente[0],
                    "ja_existia": True,
                }

            novo_id = conn.execute(
                """
                INSERT INTO adocao (id_animal, id_adotante, situacao, data_solicitacao)
                VALUES (%s, %s, 'Pendente', CURRENT_DATE)
                RETURNING id_adocao
                """,
                (dados.id_animal, dados.id_adotante),
            ).fetchone()[0]

            # Adiciona também aos favoritos automaticamente
            conn.execute(
                """
                INSERT INTO favorito (id_usuario, id_animal)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (dados.id_adotante, dados.id_animal),
            )
            conn.commit()
            return {
                "mensagem": "Solicitação de adoção enviada com sucesso! O pet foi salvo nos seus favoritos.",
                "id_adocao": novo_id,
                "ja_existia": False,
            }
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500, detail=f"Erro no banco ao registrar adoção: {e}"
        )


class FavoritoCreate(BaseModel):
    id_usuario: int
    id_animal: int


@app.post("/favoritos", status_code=201)
def adicionar_favorito(dados: FavoritoCreate):
    try:
        with conectar(BANCO) as conn:
            conn.execute(
                """
                INSERT INTO favorito (id_usuario, id_animal)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
                """,
                (dados.id_usuario, dados.id_animal),
            )
            conn.commit()
            return {"mensagem": "Pet adicionado aos favoritos com sucesso!"}
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"Erro ao salvar favorito: {e}")


@app.delete("/favoritos")
def remover_favorito(id_usuario: int, id_animal: int):
    try:
        with conectar(BANCO) as conn:
            conn.execute(
                "DELETE FROM favorito WHERE id_usuario = %s AND id_animal = %s",
                (id_usuario, id_animal),
            )
            conn.commit()
            return {"mensagem": "Pet removido dos favoritos com sucesso!"}
    except psycopg.Error as e:
        raise HTTPException(status_code=500, detail=f"Erro ao remover favorito: {e}")

