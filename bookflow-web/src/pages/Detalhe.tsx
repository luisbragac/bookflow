import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, EmptyState, ErrorState, Loading, card, useToast } from "../components/ui";
import { ApiError } from "../lib/api";
import { useLivros } from "../lib/livros";

export default function Detalhe() {
  const { id } = useParams();
  const nav = useNavigate();
  const { livros, status, error, reload, remover } = useLivros();
  const { notify } = useToast();
  const [confirmar, setConfirmar] = useState(false);
  const [busy, setBusy] = useState(false);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error ?? ""} onRetry={reload} />;
  const l = livros.find((x) => x.id_ === Number(id));
  if (!l)
    return (
      <EmptyState title="Livro não encontrado">
        <p>Ele pode ter sido excluído. <Link to="/livros" className="underline">Voltar ao acervo</Link></p>
      </EmptyState>
    );

  async function excluir() {
    setBusy(true);
    try {
      await remover(l!.id_);
      notify("success", "Livro excluído.");
      nav("/livros", { replace: true });
    } catch (e) {
      notify("error", e instanceof ApiError ? e.message : "Não foi possível excluir.");
      setBusy(false);
      setConfirmar(false);
    }
  }

  const row = (k: string, v: ReactNode) => (
    <div className="flex justify-between gap-6 py-3">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );

  return (
    <>
      <Link to="/livros" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" aria-hidden /> Acervo</Link>
      <article className={`${card} max-w-2xl overflow-hidden`}>
        <header className="border-b-4 border-brass bg-spruce-900 p-6 text-white">
          <Badge ok={l.disponivel} />
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">{l.titulo}</h1>
          <p className="mt-1 text-white/75">{l.autor}</p>
        </header>
        <dl className="divide-y divide-line px-6 text-sm">
          {row("Autor", l.autor)}
          {row("Ano de publicação", l.ano_publicacao)}
          {row("Situação", l.disponivel ? "Disponível no acervo" : "Indisponível")}
          {row("Código", `#${l.id_}`)}
        </dl>
        <footer className="flex justify-end gap-2 border-t border-line p-4">
          <Link to={`/livros/${l.id_}/editar`}><Button variant="ghost"><Pencil className="size-4" aria-hidden /> Editar</Button></Link>
          <Button variant="danger" onClick={() => setConfirmar(true)}><Trash2 className="size-4" aria-hidden /> Excluir</Button>
        </footer>
      </article>
      <ConfirmDialog open={confirmar} busy={busy} title="Excluir livro?" confirmLabel="Excluir" onConfirm={excluir} onCancel={() => setConfirmar(false)}
        message={`“${l.titulo}” será removido do acervo. Esta ação não pode ser desfeita.`} />
    </>
  );
}
