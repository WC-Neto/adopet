import os 
from pathlib import Path
import psycopg
from dotenv import load_dotenv

PATH = Path(__file__).parent
load_dotenv(PATH.parent / '.env')
load_dotenv(PATH / '.env')

HOST = os.environ.get('PGHOST')
PORT = os.environ.get('PGPORT')
USER = os.environ.get('PGUSER')
SENHA = os.environ.get('PGPASSWORD')
BANCO = 'adopet'

def conectar(banco: str, **opcoes) -> psycopg.Connection:
    return psycopg.connect(host=HOST, port=PORT, user=USER, password=SENHA, dbname=banco, **opcoes)

# cria banco se ainda não existir
with conectar('postgres', autocommit=True) as conn:
    exists = conn.execute('SELECT 1 FROM pg_database WHERE datname=%s', (BANCO,)).fetchone()
    if exists: 
        print(f"Banco {BANCO} já criado.")
    else:
        conn.execute(f'CREATE DATABASE "{BANCO}"')
        print(f"Banco {BANCO} criado.")

# criar e inserir dados nas tabelas        
with conectar(BANCO) as conn:
    for script in ('tables.sql', 'dados_exemplos.sql'):
        conn.execute((PATH / script).read_text(encoding='utf-8'))
        print(f"Ok {script}")
        
    print("\nAnimais cadastrados:")
    linhas = conn.execute(
        """SELECT nome, especie,
                  date_part('year',  age(dt_nascimento))::int AS anos,
                  date_part('month', age(dt_nascimento))::int AS meses
           FROM animal ORDER BY id_animal""").fetchall()
    for nome, especie, anos, meses in linhas:
        print(f"{nome} {especie} {anos} ano(s) e {meses} mês(es)")