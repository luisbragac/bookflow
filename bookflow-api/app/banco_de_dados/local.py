import sqlite3
from contextlib import contextmanager

class BancoLocal():
    def __init__(self, nome_arquivo = "bookflow.db"):
        self.nome_arquivo = nome_arquivo
        self.inicializar_banco()

    @contextmanager
    def conectar(self):
        #Conecta ao banco
        conexao = sqlite3.connect(self.nome_arquivo)

        try:
            yield conexao

            conexao.commit()

        except Exception as e:
            conexao.rollback()
            raise e

        finally:
            conexao.close()

    def inicializar_banco(self):
        with self.conectar() as conexao:
            cursor = conexao.cursor()

            cursor.execute("""
            CREATE TABLE IF NOT EXISTS livros(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                ano_publicacao INT NOT NULL,
                disponivel BOOLEAN NOT NULL
            )
            """)
