import os
from pathlib import Path
from typing import Optional

import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

PATH = Path(__file__).resolve().parent
load_dotenv(PATH.parent / '.env')

HOST = os.environ.get("PGHOST")
PORT = os.environ.get("PGPORT")
USER = os.environ.get("PGUSER")
SENHA = os.environ.get("PGPASSWORD")
BANCO = "adopet"

def conectar(banco: str = BANCO, **opcoes) -> psycopg.Connection:
    return psycopg.connect(host=HOST, port=PORT, user=USER, password=SENHA, dbname=banco, **opcoes)

app = FastAPI(title="Adopet API - Saúde dos Animais")

# pra o front conseguir chamar a api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# dados recebidos do formulario de saude
class SaudeCreate(BaseModel):
    castrado: str
    vacinas: str = Field(max_length=200)
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
    if valor == "não" or valor == "nao":
        return False

    raise HTTPException(
        status_code=400,
        detail="Informe Sim ou Não nos campos de seleção.",
    )

@app.get("/")
def home():
    return {"message": "API de saúde dos animais do Adopet rodando!"}

@app.put("/animais/{id_animal}/saude")
def atualizar_saude(id_animal: int, saude: SaudeCreate):
    # converte os campos sim/não para booleanos
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

    # junta a descricao da condicao ao historico,
    # pois o banco nao possui uma coluna separada para ela
    descricao = (saude.descricao_condicao or "").strip()
    historico = (saude.historico_saude or "").strip()

    partes_historico = []

    if descricao:
        partes_historico.append(
            f"Descrição da condição especial: {descricao}"
        )

    if historico:
        partes_historico.append(f"Histórico de saúde: {historico}")

    historico_final = "\n".join(partes_historico) or None

    try:
        with conectar(BANCO) as conn:
            # verifica se o animal existe
            existe = conn.execute(
                "SELECT 1 FROM animal WHERE id_animal = %s",
                (id_animal,),
            ).fetchone()

            if not existe:
                raise HTTPException(
                    status_code=404,
                    detail="Animal não encontrado.",
                )

            # atualiza os dados de saude do animal
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
