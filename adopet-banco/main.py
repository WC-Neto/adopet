import hashlib
import os
import re
from pathlib import Path
from typing import List, Optional
import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
