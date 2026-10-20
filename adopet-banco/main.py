# api do cadastro de pets
# rodar: uvicorn main:app --reload --host 0.0.0.0 --port 8000

import os
import re
from datetime import date, datetime
from pathlib import Path
from typing import List, Optional

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# pega as configs do .env
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
    # se o postgres nao abrir, nao fica esperando pra sempre
    return psycopg.connect(
        host=HOST,
        port=PORT,
        user=USER,
        password=SENHA,
        dbname=banco,
        connect_timeout=3,
        **opcoes,
    )


app = FastAPI(title="Adopet API - Animais")

# pra o front conseguir chamar a api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# dados que vem do formulario
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
    # ainda nao tem login, entao usa o usuario 1
    id_responsavel: int = 1


class AnimalResponse(BaseModel):
    id_animal: int
    nome: str
    foto_url: str
    especie: str
    porte: str
    sexo: str
    dt_nascimento: Optional[date] = None
    cidade: str
    uf: str
    situacao: str
    id_responsavel: int


def converter_sexo(sexo: str) -> str:
    # no banco so entra M ou F
    valor = sexo.strip().lower()
    if valor in ("m", "macho"):
        return "M"
    if valor in ("f", "femea", "fêmea"):
        return "F"
    raise HTTPException(status_code=400, detail="Sexo deve ser Macho ou Fêmea.")


def converter_data(texto: Optional[str]) -> Optional[date]:
    # transforma a data pro formato do banco
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
    return {"message": "API de animais do Adopet rodando!"}


@app.get("/animais", response_model=List[AnimalResponse])
def listar_animais():
    try:
        with conectar(BANCO) as conn:
            linhas = conn.execute(
                """
                SELECT id_animal, nome, foto_url, especie, porte, sexo,
                       dt_nascimento, cidade, uf, situacao, id_responsavel
                FROM animal
                ORDER BY id_animal
                """
            ).fetchall()
            return [
                AnimalResponse(
                    id_animal=r[0],
                    nome=r[1],
                    foto_url=r[2],
                    especie=r[3],
                    porte=r[4],
                    sexo=r[5],
                    dt_nascimento=r[6],
                    cidade=r[7],
                    uf=r[8],
                    situacao=r[9],
                    id_responsavel=r[10],
                )
                for r in linhas
            ]
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

    # nao tem coluna de apelido, coloco em personalidade
    personalidade = None
    if animal.apelido and animal.apelido.strip():
        personalidade = f"Apelido: {animal.apelido.strip()}"

    try:
        with conectar(BANCO) as conn:
            # ve se o usuario responsavel existe
            existe = conn.execute(
                "SELECT 1 FROM usuario WHERE id_usuario = %s",
                (animal.id_responsavel,),
            ).fetchone()
            if not existe:
                raise HTTPException(
                    status_code=400,
                    detail="Responsável não encontrado. Cadastre um usuário antes.",
                )

            linha = conn.execute(
                """
                INSERT INTO animal (
                    nome, foto_url, especie, porte, sexo, dt_nascimento,
                    personalidade, cidade, uf, id_responsavel
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id_animal, nome, foto_url, especie, porte, sexo,
                          dt_nascimento, cidade, uf, situacao, id_responsavel
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

            if not linha:
                raise HTTPException(
                    status_code=500,
                    detail="Não foi possível cadastrar o animal.",
                )

            return AnimalResponse(
                id_animal=linha[0],
                nome=linha[1],
                foto_url=linha[2],
                especie=linha[3],
                porte=linha[4],
                sexo=linha[5],
                dt_nascimento=linha[6],
                cidade=linha[7],
                uf=linha[8],
                situacao=linha[9],
                id_responsavel=linha[10],
            )
    except HTTPException:
        raise
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro no PostgreSQL: {e}",
        )
