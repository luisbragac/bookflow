import { Route, Routes, Link } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastProvider, EmptyState } from "./components/ui";
import { LivrosProvider } from "./lib/livros";
import Dashboard from "./pages/Dashboard";
import Acervo from "./pages/Acervo";
import Detalhe from "./pages/Detalhe";
import LivroForm from "./pages/LivroForm";
import Sobre from "./pages/Sobre";

export default function App() {
  return (
    <ToastProvider>
      <LivrosProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="livros" element={<Acervo />} />
            <Route path="livros/novo" element={<LivroForm />} />
            <Route path="livros/:id" element={<Detalhe />} />
            <Route path="livros/:id/editar" element={<LivroForm />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="*" element={<EmptyState title="Página não encontrada"><Link className="underline" to="/">Voltar ao painel</Link></EmptyState>} />
          </Route>
        </Routes>
      </LivrosProvider>
    </ToastProvider>
  );
}
