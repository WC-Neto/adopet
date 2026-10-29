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

# ---------- Perfil do usuário ----------
class PetPerfil(BaseModel):
    id: int
    nome: str
    sexo: str  # "M" ou "F"
    idade: str
    localizacao: str
    foto: str  # chave da foto no front (ex.: "rai")
    status: Optional[str] = None  # "Disponível" ou "Adotada" (só em meus_pets)


class UsuarioPerfil(BaseModel):
    nome_usuario: str
    email: str
    telefone: str
    cidade: str
    data_nascimento: str
    meus_pets: List[PetPerfil]
    favoritos: List[PetPerfil]


# Usuário "logado" de exemplo (sem autenticação por enquanto)
USUARIO_LOGADO = UsuarioPerfil(
    nome_usuario="Usuario_Silva",
    email="emailusuario@gmail.com",
    telefone="(12) 34567-8910",
    cidade="Três Lagoas, MS",
    data_nascimento="27/10/2026",
    meus_pets=[
        PetPerfil(id=1, nome="Thor", sexo="M", idade="5 anos", localizacao="Três Lagoas, MS", foto="luna", status="Disponível"),
        PetPerfil(id=2, nome="Joe", sexo="M", idade="9 anos", localizacao="Três Lagoas, MS", foto="joe", status="Adotada"),
    ],
    favoritos=[
        PetPerfil(id=3, nome="Jana", sexo="F", idade="1 ano", localizacao="Três Lagoas, MS", foto="jana"),
        PetPerfil(id=4, nome="Sam", sexo="M", idade="3 meses", localizacao="Três Lagoas, MS", foto="sam"),
        PetPerfil(id=5, nome="Rai", sexo="M", idade="8 anos", localizacao="Três Lagoas, MS", foto="rai"),
    ],
)


@app.get("/usuarios/me", response_model=UsuarioPerfil)
def obter_usuario_logado():
    return USUARIO_LOGADO
