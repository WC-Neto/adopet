# Adopet

## Iniciar no Windows

Inicie o serviço do PostgreSQL. Na primeira configuração, abra o PowerShell nesta pasta e crie o arquivo de acesso ao banco:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Preencha `PGPASSWORD` com a senha do PostgreSQL. Instale as dependências e prepare o banco:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe backend\criar_banco.py
```

O preparo inicial recria as tabelas e os dados de exemplo. Não o execute novamente se quiser manter dados cadastrados.

Inicie a API:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Em outro PowerShell, inicie o app:

```powershell
cd frontend
npm install
npm run web
```
