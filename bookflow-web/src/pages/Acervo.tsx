import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, EmptyState, ErrorState, Loading, PageHeader, card, inputCls, useToast } from "../components/ui";
import { ApiError } from "../lib/api";
import { norm, useLivros } from "../lib/livros";
import type { Livro } from "../types";

const PER_PAGE = 10;
type Col = "titulo" | "autor" | "ano_publicacao" | "id_";
const cols: { key: Col; label: string }[] = [
  { key: "titulo", label: "Título" },
  { key: "autor", label: "Autor" },
  { key: "ano_publicacao", label: "Ano" },
];

export default function Acervo() {
  const { livros, status, error, reload, remover } = useLivros();
  const { notify } = useToast();
  const [sp, setSp] = useSearchParams();
  const [alvo, setAlvo] = useState<Livro | null>(null);
  const [busy, setBusy] = useState(false);

  const q = sp.get("q") ?? "";
  const disp = sp.get("disp") ?? "todos";
  const ord = (sp.get("ord") ?? "titulo") as Col;
  const dir = sp.get("dir") === "desc" ? "desc" : "asc";
  const page = Math.max(1, Number(sp.get("p")) || 1);

  // Filtros e ordem ficam na URL: voltar da página de detalhes mantém o contexto.
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp);
    if (v) n.set(k, v); else n.delete(k);
    if (k !== "p") n.delete("p");
    setSp(n, { replace: true });
  };
  const sortBy = (c: Col) => {
    const n = new URLSearchParams(sp);
    n.set("ord", c); n.set("dir", ord === c && dir === "asc" ? "desc" : "asc"); n.delete("p");
    setSp(n, { replace: true });
  };

  const lista = useMemo(() => {
    const t = norm(q);
    const f = livros.filter((l) => (!t || norm(l.titulo).includes(t) || norm(l.autor).includes(t)) && (disp === "todos" || l.disponivel === (disp === "sim")));
    const m = dir === "asc" ? 1 : -1;
    return f.sort((a, b) => {
      const x = a[ord], y = b[ord];
      return (typeof x === "string" ? x.localeCompare(y as string, "pt-BR") : (x as number) - (y as number)) * m;
    });
  }, [livros, q, disp, ord, dir]);

  const paginas = Math.max(1, Math.ceil(lista.length / PER_PAGE));
  const atual = Math.min(page, paginas);
  const fatia = lista.slice((atual - 1) * PER_PAGE, atual * PER_PAGE);

  async function excluir() {
    if (!alvo) return;
    setBusy(true);
    try {
      await remover(alvo.id_);
      notify("success", `“${alvo.titulo}” foi excluído.`);
      setAlvo(null);
    } catch (e) {
      notify("error", e instanceof ApiError ? e.message : "Não foi possível excluir.");
      if (e instanceof ApiError && e.status === 404) { setAlvo(null); void reload(); }
    } finally { setBusy(false); }
  }

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error ?? ""} onRetry={reload} />;

  return (
    <>
      <PageHeader title="Acervo" subtitle="Pesquise, filtre e gerencie todos os livros." actions={<Link to="/livros/novo"><Button><Plus className="size-4" aria-hidden /> Novo livro</Button></Link>} />

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted" aria-hidden />
          <input type="search" aria-label="Pesquisar por título ou autor" placeholder="Pesquisar por título ou autor" value={q} onChange={(e) => set("q", e.target.value)} className={`${inputCls} pl-9`} />
        </div>
        <select aria-label="Filtrar por disponibilidade" value={disp} onChange={(e) => set("disp", e.target.value === "todos" ? "" : e.target.value)} className={`${inputCls} w-auto`}>
          <option value="todos">Todos</option>
          <option value="sim">Disponíveis</option>
          <option value="nao">Indisponíveis</option>
        </select>
      </div>

      <div className={`${card} overflow-x-auto`}>
        {!fatia.length ? (
          <EmptyState title={livros.length ? "Nenhum livro encontrado" : "O acervo está vazio"}>
            {livros.length ? <p>Tente outro termo ou limpe os filtros.</p> : <p>Cadastre o primeiro livro para começar.</p>}
          </EmptyState>
        ) : (
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-line bg-paper/60">
              <tr>
                {cols.map((c) => (
                  <th key={c.key} scope="col" aria-sort={ord === c.key ? (dir === "asc" ? "ascending" : "descending") : "none"} className="px-4 py-3 font-medium">
                    <button onClick={() => sortBy(c.key)} className="inline-flex items-center gap-1 hover:underline">
                      {c.label}
                      {ord === c.key && (dir === "asc" ? <ArrowUp className="size-3.5" aria-hidden /> : <ArrowDown className="size-3.5" aria-hidden />)}
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 font-medium">Situação</th>
                <th scope="col" className="px-4 py-3 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {fatia.map((l) => (
                <tr key={l.id_} className="hover:bg-spruce-100/40">
                  <td className="px-4 py-3 font-medium"><Link to={`/livros/${l.id_}`} className="hover:underline">{l.titulo}</Link></td>
                  <td className="px-4 py-3">{l.autor}</td>
                  <td className="px-4 py-3 tabular-nums">{l.ano_publicacao}</td>
                  <td className="px-4 py-3"><Badge ok={l.disponivel} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link to={`/livros/${l.id_}`} aria-label={`Ver ${l.titulo}`} className="rounded p-2 hover:bg-spruce-100"><Eye className="size-4" /></Link>
                      <Link to={`/livros/${l.id_}/editar`} aria-label={`Editar ${l.titulo}`} className="rounded p-2 hover:bg-spruce-100"><Pencil className="size-4" /></Link>
                      <button onClick={() => setAlvo(l)} aria-label={`Excluir ${l.titulo}`} className="rounded p-2 text-danger hover:bg-danger/10"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {lista.length > PER_PAGE && (
        <nav aria-label="Paginação" className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted">{lista.length} livros · página {atual} de {paginas}</span>
          <div className="flex gap-2">
            <Button variant="ghost" disabled={atual <= 1} onClick={() => set("p", String(atual - 1))} aria-label="Página anterior"><ChevronLeft className="size-4" /></Button>
            <Button variant="ghost" disabled={atual >= paginas} onClick={() => set("p", String(atual + 1))} aria-label="Próxima página"><ChevronRight className="size-4" /></Button>
          </div>
        </nav>
      )}

      <ConfirmDialog open={!!alvo} busy={busy} title="Excluir livro?" confirmLabel="Excluir" onConfirm={excluir} onCancel={() => setAlvo(null)}
        message={alvo ? `“${alvo.titulo}” será removido do acervo. Esta ação não pode ser desfeita.` : ""} />
    </>
  );
}
