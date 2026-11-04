import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button, EmptyState, ErrorState, Loading, PageHeader, card } from "../components/ui";
import { useLivros } from "../lib/livros";

const MAX_SPINES = 28;

export default function Dashboard() {
  const { livros, status, error, reload } = useLivros();
  const s = useMemo(() => {
    const count = <K,>(keys: K[]) => {
      const m = new Map<K, number>();
      keys.forEach((k) => m.set(k, (m.get(k) ?? 0) + 1));
      return [...m];
    };
    return {
      disp: livros.filter((l) => l.disponivel).length,
      autores: count(livros.map((l) => l.autor)).sort((a, b) => b[1] - a[1]),
      seculos: count(livros.map((l) => Math.floor((l.ano_publicacao - 1) / 100) + 1)).sort((a, b) => a[0] - b[0]),
      recentes: [...livros].sort((a, b) => b.id_ - a.id_).slice(0, 5),
    };
  }, [livros]);

  if (status === "loading") return <Loading />;
  if (status === "error") return <ErrorState message={error ?? ""} onRetry={reload} />;

  const novo = <Link to="/livros/novo"><Button><Plus className="size-4" aria-hidden /> Novo livro</Button></Link>;
  if (!livros.length)
    return (
      <>
        <PageHeader title="Painel" />
        <EmptyState title="O acervo ainda está vazio">
          <p>Cadastre o primeiro livro para ver estatísticas e a estante aqui.</p>
          <div className="mt-5">{novo}</div>
        </EmptyState>
      </>
    );

  const maxSec = Math.max(...s.seculos.map((x) => x[1]));
  const maxAut = s.autores[0][1];
  const stat = (label: string, value: number) => (
    <div className={`${card} px-4 py-3`}>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-display text-3xl font-semibold">{value}</dd>
    </div>
  );

  return (
    <>
      <PageHeader title="Painel" subtitle="Um retrato do acervo, calculado a partir dos livros cadastrados na API." actions={novo} />

      <section aria-labelledby="estante" className="rounded-lg bg-spruce-900 p-5 pb-0 text-white">
        <h2 id="estante" className="font-display text-2xl">{livros.length} {livros.length === 1 ? "livro" : "livros"} na estante</h2>
        <ul className="mt-5 flex items-end gap-1.5 overflow-x-auto pb-0">
          {livros.slice(0, MAX_SPINES).map((l) => (
            <li key={l.id_}>
              <Link
                to={`/livros/${l.id_}`} title={`${l.titulo}, ${l.autor}`}
                style={{ height: 150 + ((l.id_ * 37) % 36) }}
                className={`block w-9 overflow-hidden rounded-t-sm px-1 py-2 text-xs font-medium [writing-mode:vertical-rl] hover:-translate-y-1.5 transition-transform ${l.disponivel ? "bg-spruce-700 text-white ring-1 ring-white/20" : "bg-brass-soft text-[#5c4010]"}`}
              >
                <span className="block truncate">{l.titulo}</span>
              </Link>
            </li>
          ))}
          {livros.length > MAX_SPINES && <li className="pb-2 pl-2 text-sm text-white/70">+{livros.length - MAX_SPINES}</li>}
        </ul>
        <div className="-mx-5 flex flex-wrap gap-x-5 gap-y-1 border-t-4 border-brass bg-spruce-700 px-5 py-2 text-xs text-white/80">
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-spruce-700 ring-1 ring-white/40" /> Disponível</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brass-soft" /> Indisponível</span>
        </div>
      </section>

      <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stat("Total de livros", livros.length)}
        {stat("Disponíveis", s.disp)}
        {stat("Indisponíveis", livros.length - s.disp)}
        {stat("Autores", s.autores.length)}
      </dl>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className={`${card} p-5`}>
          <h2 className="font-display text-xl font-semibold">Por século de publicação</h2>
          <ul className="mt-4 space-y-3">
            {s.seculos.map(([sec, n]) => (
              <li key={sec} className="grid grid-cols-[4.5rem_1fr_1.5rem] items-center gap-3 text-sm">
                <span>séc. {sec}</span>
                <span className="h-2 rounded-full bg-spruce-100"><span className="block h-2 rounded-full bg-spruce-700" style={{ width: `${(n / maxSec) * 100}%` }} /></span>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className={`${card} p-5`}>
          <h2 className="font-display text-xl font-semibold">Autores com mais títulos</h2>
          <ul className="mt-4 space-y-3">
            {s.autores.slice(0, 5).map(([a, n]) => (
              <li key={a} className="grid grid-cols-[minmax(0,9rem)_1fr_1.5rem] items-center gap-3 text-sm">
                <span className="truncate" title={a}>{a}</span>
                <span className="h-2 rounded-full bg-brass-soft"><span className="block h-2 rounded-full bg-brass" style={{ width: `${(n / maxAut) * 100}%` }} /></span>
                <span className="text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className={`${card} mt-6 p-5`}>
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">Últimos cadastrados</h2>
          <Link to="/livros" className="text-sm text-spruce-700 underline">Ver acervo completo</Link>
        </div>
        <ul className="mt-3 divide-y divide-line">
          {s.recentes.map((l) => (
            <li key={l.id_} className="flex justify-between gap-4 py-2 text-sm">
              <Link to={`/livros/${l.id_}`} className="font-medium hover:underline">{l.titulo}</Link>
              <span className="text-muted">{l.autor}, {l.ano_publicacao}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
