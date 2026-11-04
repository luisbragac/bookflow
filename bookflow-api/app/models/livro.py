from pydantic import BaseModel, Field, field_validator

class Livro(BaseModel):
    id_: int
    titulo: str
    autor: str
    ano_publicacao: int
    disponivel: bool


class LivroCriarAtualizar(BaseModel):
    # Field define regras dentro do campo. No campo título, por exemplo, o tamanho minimo é 1 e o máximo é 150
    titulo: str = Field(min_length = 1, max_length = 150)
    autor: str = Field(min_length = 1, max_length = 150)
    ano_publicacao: int = Field(ge= 1000, le= 2026)
    disponivel: bool = True

    # A resposta pode ter passado das regras do campo, mas não significa que estão de acordo com as regras gerais. Por isso o field_validator permite criar validações personalizadas.
    @field_validator("titulo", "autor")
    @classmethod
    def validar_texto(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("O campo não pode estar vazio")

        return valor