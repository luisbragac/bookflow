import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, EmptyState, ErrorState, Field, Loading, PageHeader, card, inputCls, useToast } from "../components/ui";
import { ApiError } from "../lib/api";
import { norm, useLivros } from "../lib/livros";
import type { LivroInput } from "../types";

const ANO_MIN = 1000, ANO_MAX = 2026; // limites definidos em app/models/livro.py
type Vals = { titulo: string; autor: string; ano: string; disponivel: boolean };

function validar(v: Vals) {
  const e: Record<string, string> = {};
  const t = v.titulo.trim(), a = v.autor.trim(), n = Number(v.ano);
  if (!t) e.titulo = "Informe o título."; else if (t.length > 150) e.titulo = "Máximo de 150 caracteres.";
  if (!a) e.autor = "Informe o autor."; else if (a.length > 150) e.autor = "Máximo de 150 caracteres.";
  if (!v.ano.trim() || !Number.isInteger(n)) e.ano_publicacao = "Informe um ano válido.";
  else if (n < ANO_MIN || n > ANO_MAX) e.ano_publicacao = `O ano deve estar entre ${ANO_MIN} e ${ANO_MAX}.`;
  return e;
}

export default function LivroForm() {
  const { id } = useParams();
  return <Inner key={id ?? "novo"} editId={id ? Number(id) : null} />;
}

function Inner({ editId }: { editId: number | null }) {
  const nav = useNavigate();
  const { livros, status, error, reload, criar, atualizar } = useLivros();
  const { notify } = useToast();
  const atual = editId === null ? undefined : livros.find((l) => l.id_ === editId);
  const [v, setV] = useState<Vals>({ titulo: "", autor: "", ano: "", disponivel: true });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const preenchido = useRef(false);

  useEffect(() => {
    if (atual && !preenchido.current) {
      preenchido.current = true;
      setV({ titulo: atual.titulo, autor: atual.autor, ano: String(atual.ano_publicacao), disponivel: atual.disponivel });
    }
  }, [atual]);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error ?? ""} onRetry={reload} />;
  if (editId !== null && !atual)
    return <EmptyState title="Livro não encontrado"><Link to="/livros" className="underline">Voltar ao acervo</Link></EmptyState>;

  const duplicado = editId === null && v.titulo.trim() !== "" && livros.some((l) => norm(l.titulo) === norm(v.titulo) && norm(l.autor) === norm(v.autor));
  const set = <K extends keyof Vals>(k: K, val: Vals[K]) => setV((s) => ({ ...s, [k]: val }));
  const aria = (k: string) => ({ "aria-invalid": !!errs[k], "aria-describedby": `${k}-msg` });

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    const er = validar(v);
    setErrs(er);
    if (Object.keys(er).length) return;
    const input: LivroInput = { titulo: v.titulo.trim(), autor: v.autor.trim(), ano_publicacao: Number(v.ano), disponivel: v.disponivel };
    setBusy(true);
    try {
      const salvo = editId === null ? await criar(input) : await atualizar(editId, input);
      notify("success", editId === null ? "Livro cadastrado." : "Alterações salvas.");
      nav(`/livros/${salvo.id_}`);
    } catch (err) {
      if (err instanceof ApiError) { setErrs(err.fields); notify("error", err.message); }
      else notify("error", "Erro inesperado. Tente novamente.");
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title={editId === null ? "Novo livro" : "Editar livro"} subtitle="Campos marcados com * são obrigatórios." />
      <form onSubmit={enviar} noValidate className={`${card} max-w-2xl space-y-5 p-6`}>
        <Field id="titulo" label="Título" required error={errs.titulo} hint={`${v.titulo.length}/150`}>
          <input id="titulo" value={v.titulo} onChange={(e) => set("titulo", e.target.value)} className={inputCls} {...aria("titulo")} />
        </Field>
        <Field id="autor" label="Autor" required error={errs.autor} hint={`${v.autor.length}/150`}>
          <input id="autor" value={v.autor} onChange={(e) => set("autor", e.target.value)} className={inputCls} {...aria("autor")} />
        </Field>
        <Field id="ano_publicacao" label="Ano de publicação" required error={errs.ano_publicacao} hint={`Entre ${ANO_MIN} e ${ANO_MAX}`}>
          <input id="ano_publicacao" inputMode="numeric" value={v.ano} onChange={(e) => set("ano", e.target.value)} className={`${inputCls} max-w-40`} {...aria("ano_publicacao")} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={v.disponivel} onChange={(e) => set("disponivel", e.target.checked)} className="size-4 accent-spruce-700" />
          Disponível no acervo
        </label>
        {duplicado && <p role="status" className="rounded-md bg-brass-soft px-3 py-2 text-sm text-[#5c4010]">Já existe um livro com este título e autor. A API não impede duplicatas, então confira antes de salvar.</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-5">
          <Button type="button" variant="ghost" onClick={() => nav(-1)} disabled={busy}>Cancelar</Button>
          <Button type="submit" loading={busy}>{editId === null ? "Cadastrar livro" : "Salvar alterações"}</Button>
        </div>
      </form>
    </>
  );
}
