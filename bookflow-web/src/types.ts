// Espelha app/models/livro.py da API. Note que o identificador se chama `id_`.
export interface Livro {
  id_: number;
  titulo: string;
  autor: string;
  ano_publicacao: number;
  disponivel: boolean;
}
export type LivroInput = Omit<Livro, "id_">;
