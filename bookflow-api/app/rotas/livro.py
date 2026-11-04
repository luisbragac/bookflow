from fastapi import APIRouter
from app.models.livro import Livro, LivroCriarAtualizar
from app.banco_de_dados.livro_repositorio import LivroRepositorio
from fastapi import HTTPException, Response

router = APIRouter(
    prefix="/livros"
)

@router.get("/", response_model = list[Livro])
async def listar_livros():
    repositorio = LivroRepositorio()
    return await repositorio.listar_livros()

@router.get("/{livro_id}", response_model = Livro | None)
async def buscar_livro(livro_id: int):
    repositorio = LivroRepositorio()
    livro_buscado = await repositorio.buscar_livro(livro_id)

    if livro_buscado is None:
        raise HTTPException(
            status_code=404,
            detail="Livro não encontrado"
        )
    
    return livro_buscado

@router.post("/", response_model = Livro)
async def criar_livro(livro: LivroCriarAtualizar):
    repositorio = LivroRepositorio()
    return await repositorio.adicionar_livros(livro = livro)

@router.put("/{livro_id}", response_model = Livro)
async def atualizar_livro(livro: LivroCriarAtualizar, livro_id: int):
    repositorio = LivroRepositorio()

    livro_atualizado = await repositorio.atualizar_livro(livro, livro_id)

    if livro_atualizado is None:
        raise HTTPException(
            status_code=404,
            detail="Livro não encontrado"
        )

    return livro_atualizado

@router.delete("/{livro_id}", status_code=204)
async def deletar_livro(livro_id: int):
    repositorio = LivroRepositorio()
    deletado =  await repositorio.deletar_livros(livro_id)

    if not deletado:
        raise HTTPException(
            status_code= 404,
            detail="Livro não encontrado"
        )