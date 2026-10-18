from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Adopet API")

# Habilita o CORS para o React conseguir se comunicar com o FastAPI sem bloqueios
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de Dados (Pydantic)
class Pet(BaseModel):
    id: Optional[int] = None
    nome: str
    especie: str  # ex: Cachorro, Gato
    idade: str
    descricao: str
    imagem_url: Optional[str] = None

# "Banco de dados" temporário em memória
db_pets: List[Pet] = [
    Pet(id=1, nome="Thor", especie="Cachorro", idade="2 anos", descricao="Muito brincalhão e carinhoso.", imagem_url="https://via.placeholder.com/150"),
    Pet(id=2, nome="Mia", especie="Gato", idade="1 ano", descricao="Calma e gosta de sachê.", imagem_url="https://via.placeholder.com/150")
]

@app.get("/")
def home():
    return {"message": "API do Adopet rodando com sucesso!"}

@app.get("/pets", response_model=List[Pet])
def listar_pets():
    return db_pets

@app.post("/pets", response_model=Pet, status_code=201)
def cadastrar_pet(pet: Pet):
    pet.id = len(db_pets) + 1
    db_pets.append(pet)
    return pet

@app.get("/pets/{pet_id}", response_model=Pet)
def obter_pet(pet_id: int):
    for pet in db_pets:
        if pet.id == pet_id:
            return pet
    raise HTTPException(status_code=404, detail="Pet não encontrado")

# ---------- Menu lateral ----------
class ItemMenu(BaseModel):
    label: str
    rota: str


MENU_ITENS: List[ItemMenu] = [
    ItemMenu(label="Início", rota="/"),
    ItemMenu(label="Adotar", rota="/adotar"),
    ItemMenu(label="Doar", rota="/doar"),
    ItemMenu(label="Minha conta", rota="/conta"),
    ItemMenu(label="Sobre nós", rota="/sobre"),
    ItemMenu(label="FAQ", rota="/faq"),
]


@app.get("/menu", response_model=List[ItemMenu])
def listar_itens_menu():
    return MENU_ITENS