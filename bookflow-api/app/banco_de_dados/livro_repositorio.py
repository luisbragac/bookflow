from app.banco_de_dados.local import BancoLocal
from app.models.livro import Livro, LivroCriarAtualizar

class LivroRepositorio:
    def __init__(self):
        self.banco = BancoLocal()


    async def listar_livros(self) -> list[Livro]:
        with self.banco.conectar() as conexao:

            cursor = conexao.cursor()

            cursor.execute("""
            SELECT * FROM LIVROS
            """)

            # Essa variável é uma lista com todas as linhas retornadas pelo cursor
            livros = cursor.fetchall()

            lista_livros = []

            for livro in livros:
                objeto_livro = Livro(
                    id_=livro[0], 
                    titulo=livro[1], 
                    autor=livro[2], 
                    ano_publicacao=livro[3], 
                    disponivel=livro[4]
                    )

                lista_livros.append(objeto_livro)

            return lista_livros

    async def buscar_livro(self, livro_id: int) -> Livro | None:
        with self.banco.conectar() as conexao:

            cursor = conexao.cursor()

            cursor.execute("""
                SELECT * FROM livros WHERE id = ?
            """, (livro_id, ))

            livro = cursor.fetchone()
            if livro:
                return Livro(id_ = livro[0], titulo = livro[1], autor = livro[2], 
                             ano_publicacao = livro[3], disponivel = livro[4])
            else:
                return None
            

    async def adicionar_livros(self, livro: LivroCriarAtualizar ) -> Livro:
        with self.banco.conectar() as conexao:

            cursor = conexao.cursor()

            cursor.execute("""
            INSERT INTO livros(titulo, autor, ano_publicacao, disponivel) VALUES (?, ?, ?, ?)
            """, (livro.titulo, livro.autor, livro.ano_publicacao, livro.disponivel))

            livro_id = cursor.lastrowid

            livro_criado = Livro(
                id_ = livro_id,
                titulo = livro.titulo,
                autor = livro.autor,
                ano_publicacao= livro.ano_publicacao,
                disponivel = livro.disponivel
            )

            return livro_criado

    async def atualizar_livros(self, livro: LivroCriarAtualizar, livro_id: int) -> Livro | None:
        with self.banco.conectar() as conexao:

            cursor = conexao.cursor()

            cursor.execute("""
            UPDATE livros SET titulo = ?, autor = ?, ano_publicacao = ?, disponivel = ? WHERE id = ?
            """, (livro.titulo, livro.autor, livro.ano_publicacao, livro.disponivel, livro_id))

            if cursor.rowcount == 0:
                return None
            else:
                return Livro(id_ = livro_id, titulo = livro.titulo, autor = livro.autor, ano_publicacao = livro.ano_publicacao, disponivel = livro.disponivel)

    async def deletar_livros(self, livro_id:int) -> bool:
        with self.banco.conectar() as conexao:

            cursor = conexao.cursor()

            cursor.execute("DELETE FROM livros WHERE id = ?", (livro_id, ))

            return cursor.rowcount > 0