# rodar: uvicorn main:app --reload --host 0.0.0.0 --port 8000

import os 
from datetime import date 
from pathlib import Path 
from typing import List, Optional
import psycopg
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

PATH = Path(__file__).parent
load_dotenv(PATH.parent / '.env')

HOST = os.environ.get('PGHOST')
PORT = os.environ.get('PGPORT')
USER = os.environ.get('PGUSER')
SENHA = os.environ.get('PGPASSWORD')
BANCO = 'adopet'

def conectar(banco: str, **opcoes) -> psycopg.Connection:
    return psycopg.connect(host=HOST, port=PORT, user=USER, password=SENHA, dbname=banco, **opcoes)

app = FastAPI(title="Adopet API - Filtros")

# pra o front conseguir chamar a api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# faixa de idade em anos 
filhote=1
idoso=8

sexo_db = {"Macho": "M", "Fêmea": "F"}

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
    
@app.get("/pets", response_model=List[AnimalResponse])
def listar_pets(
    estado: Optional[str] = None,
    cidade: Optional[str] = None, 
    especie: Optional[str] = None,
    idade: Optional[str] = None, 
    sexo: Optional[str] = None, 
    porte: Optional[str] = None,
):
    # apenas retorna animais disponiveis 
    condicoes = ["situacao = 'Disponível'"]
    valores: list=[]
    
    if estado:
        condicoes.append("uf = %s")
        valores.append(estado.strip().upper())
        
    if cidade:
        condicoes.append("lower(cidade) = lower(%s)")
        valores.append(cidade.strip())
        
    if especie:
        condicoes.append("especie = %s")
        valores.append(especie)
        
    if porte:
        condicoes.append("porte = %s")
        valores.append(porte)
        
    if sexo in sexo_db:
        condicoes.append("sexo = %s")
        valores.append(sexo_db[sexo])
        
    if idade == "Filhote":
        condicoes.append(f"dt_nascimento > current_date - interval '{filhote} year'")
    elif idade == "Adulto":
        condicoes.append(
            f"dt_nascimento <= current_date - interval '{filhote} year'"
            f"AND dt_nascimento > current_date - interval '{idoso} year'"
        )
        
    where = " WHERE " + " AND ".join(condicoes)
    
    try:
        with conectar(BANCO) as conn:
            linhas = conn.execute(
                f'''
                    SELECT id_animal, nome, foto_url, especie, porte, sexo, dt_nascimento, cidade, uf
                    FROM animal
                    {where}
                    ORDER BY id_animal
                ''', 
                valores, 
            ).fetchall()
            return [
                AnimalResponse(
                    id_animal=r[0], 
                    nome=r[1], 
                    foto_url=r[2], 
                    especie=r[3], 
                    porte=r[4], 
                    sexo = "Macho" if r[5] == "M" else "Fêmea", 
                    dt_nascimento=r[6], 
                    cidade=r[7], 
                    uf=r[8],
                )
                for r in linhas
            ]
    except psycopg.Error as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Erro ao consultar o PostgreSQL: {e}",
        )