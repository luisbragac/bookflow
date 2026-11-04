import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "./api";
import type { Livro, LivroInput } from "../types";

type Status = "loading" | "ready" | "error";
interface Ctx {
  livros: Livro[];
  status: Status;
  error: string | null;
  reload: () => Promise<void>;
  criar: (i: LivroInput) => Promise<Livro>;
  atualizar: (id: number, i: LivroInput) => Promise<Livro>;
  remover: (id: number) => Promise<void>;
}
const LivrosCtx = createContext<Ctx | null>(null);

/**
 * Estado compartilhado do acervo. GET /livros/{id} da API não devolve o livro
 * (a rota não tem `return`), então a página de detalhes lê daqui, da listagem.
 */
export function LivrosProvider({ children }: { children: ReactNode }) {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setStatus((s) => (s === "error" ? "loading" : s));
    try {
      setLivros(await api.listar());
      setStatus("ready");
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Erro inesperado.");
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);
  useEffect(() => { void reload(); }, [reload]);

  const value: Ctx = {
    livros, status, error, reload,
    async criar(i) { const n = await api.criar(i); setLivros((l) => [...l, n]); return n; },
    async atualizar(id, i) { const n = await api.atualizar(id, i); setLivros((l) => l.map((x) => (x.id_ === id ? n : x))); return n; },
    async remover(id) { await api.remover(id); setLivros((l) => l.filter((x) => x.id_ !== id)); },
  };
  return <LivrosCtx.Provider value={value}>{children}</LivrosCtx.Provider>;
}

export function useLivros() {
  const c = useContext(LivrosCtx);
  if (!c) throw new Error("useLivros fora do LivrosProvider");
  return c;
}

export const norm = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
