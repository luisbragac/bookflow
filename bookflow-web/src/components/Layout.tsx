import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Info, LayoutGrid, Library, Menu, Plus, X } from "lucide-react";

const items = [
  { to: "/", label: "Painel", icon: LayoutGrid, on: (p: string) => p === "/" },
  { to: "/livros", label: "Acervo", icon: Library, on: (p: string) => p.startsWith("/livros") && p !== "/livros/novo" },
  { to: "/livros/novo", label: "Novo livro", icon: Plus, on: (p: string) => p === "/livros/novo" },
  { to: "/sobre", label: "Sobre a API", icon: Info, on: (p: string) => p === "/sobre" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">Ir para o conteúdo</a>
      <header className="sticky top-0 z-30 flex items-center justify-between bg-spruce-900 px-4 py-3 text-white md:hidden">
        <span className="font-display text-xl font-semibold">BookFlow</span>
        <button onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Fechar menu" : "Abrir menu"}>
          {open ? <X /> : <Menu />}
        </button>
      </header>
      <aside className={`${open ? "block" : "hidden"} bg-spruce-900 px-4 py-6 text-white md:sticky md:top-0 md:block md:h-dvh`}>
        <Link to="/" className="mb-8 hidden px-2 font-display text-2xl font-semibold md:block">BookFlow</Link>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {items.map(({ to, label, icon: Icon, on }) => (
            <Link
              key={to} to={to} onClick={() => setOpen(false)} aria-current={on(pathname) ? "page" : undefined}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${on(pathname) ? "bg-white/12 font-medium" : "text-white/70 hover:bg-white/8 hover:text-white"}`}
            >
              <Icon className="size-4" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main id="conteudo" className="mx-auto w-full max-w-5xl px-4 py-8 md:px-10 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
