from fastapi import FastAPI
from app.rotas import livro

app = FastAPI(
    title="BookFlow API",
    description="API para Bibliotecas",
    version="1.0.0"
)

app.include_router(livro.router)

@app.get("/", status_code=200)
async def health_check():
    return {"Status": "Ok"}
