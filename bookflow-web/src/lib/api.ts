import type { Livro, LivroInput } from "../types";

const BASE = (import.meta.env.VITE_API_URL ?? "/api").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(public status: number, message: string, public fields: Record<string, string> = {}) {
    super(message);
  }
}

const MSG: Record<number, string> = {
  400: "Requisição inválida.",
  401: "Acesso não autorizado.",
  403: "Você não tem permissão para esta ação.",
  404: "Registro não encontrado.",
  409: "Este registro entra em conflito com um já existente.",
  422: "Verifique os campos destacados.",
  500: "Erro interno no servidor. Tente novamente em instantes.",
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new ApiError(0, "Não foi possível conectar à API. Verifique se ela está em execução.");
  }
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    let message = MSG[res.status] ?? "Não foi possível concluir a operação.";
    const fields: Record<string, string> = {};
    const d = body?.detail;
    if (typeof d === "string" && (res.status === 404 || res.status === 409)) message = d;
    if (Array.isArray(d)) {
      for (const it of d) {
        const k = it?.loc?.[it.loc.length - 1];
        if (typeof k === "string" && !fields[k]) fields[k] = it.msg ?? "Valor inválido.";
      }
    }
    throw new ApiError(res.status, message, fields);
  }
  return body as T;
}

export const api = {
  health: () => request<{ Status: string }>("/"),
  // A barra final em /livros/ é obrigatória: sem ela o FastAPI responde com redirecionamento.
  listar: () => request<Livro[]>("/livros/"),
  criar: (i: LivroInput) => request<Livro>("/livros/", { method: "POST", body: JSON.stringify(i) }),
  async atualizar(id: number, i: LivroInput) {
    const r = await request<Livro | null>(`/livros/${id}`, { method: "PUT", body: JSON.stringify(i) });
    // A API responde 200 com `null` (e não 404) quando o id não existe.
    if (!r) throw new ApiError(404, "Livro não encontrado. Ele pode ter sido excluído.");
    return r;
  },
  remover: (id: number) => request<void>(`/livros/${id}`, { method: "DELETE" }),
};
