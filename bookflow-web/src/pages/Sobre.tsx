import { useCallback, useEffect, useState } from "react";
import { Button, PageHeader, card } from "../components/ui";
import { api } from "../lib/api";

const endpoints = [
  ["GET", "/", "Verificação de saúde"],
  ["GET", "/livros/", "Lista todos os livros"],
  ["GET", "/livros/{id}", "Busca um livro (veja a nota abaixo)"],
  ["POST", "/livros/", "Cadastra um livro"],
  ["PUT", "/livros/{id}", "Atualiza um livro"],
  ["DELETE", "/livros/{id}", "Exclui um livro (204)"],
];

export default function Sobre() {
  const [st, setSt] = useState<"checking" | "ok" | "down">("checking");
  const check = useCallback(() => {
    setSt("checking");
    api.health().then(() => setSt("ok"), () => setSt("down"));
  }, []);
  useEffect(check, [check]);

  return (
    <>
      <PageHeader title="Sobre a API" subtitle="BookFlow API 1.0.0, uma API para bibliotecas." />
      <section className={`${card} mb-6 flex flex-wrap items-center justify-between gap-3 p-5`}>
        <div>
          <p className="text-sm text-muted">Endereço configurado</p>
          <code className="text-sm">{import.meta.env.VITE_API_URL ?? "/api"}</code>
        </div>
        <div className="flex items-center gap-3">
          <span role="status" className={`rounded-full px-3 py-1 text-sm font-medium ${st === "ok" ? "bg-spruce-100 text-spruce-700" : st === "down" ? "bg-danger/10 text-danger" : "bg-line text-muted"}`}>
            {st === "ok" ? "Online" : st === "down" ? "Sem conexão" : "Verificando…"}
          </span>
          <Button variant="ghost" onClick={check}>Verificar</Button>
        </div>
      </section>

      <section className={`${card} mb-6 overflow-x-auto`}>
        <table className="w-full min-w-[28rem] text-left text-sm">
          <caption className="sr-only">Endpoints da API</caption>
          <tbody className="divide-y divide-line">
            {endpoints.map(([m, p, d]) => (
              <tr key={m + p}>
                <td className="w-24 px-4 py-3 font-medium">{m}</td>
                <td className="px-4 py-3"><code>{p}</code></td>
                <td className="px-4 py-3 text-muted">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={`${card} p-5 text-sm`}>
        <h2 className="font-display text-xl font-semibold">Particularidades da API</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          <li>Cada livro tem título e autor (1 a 150 caracteres), ano entre 1000 e 2026 e a situação de disponibilidade.</li>
          <li>Busca, filtros, ordenação e paginação não existem na API; este sistema os aplica sobre a lista completa.</li>
          <li><code>GET /livros/{"{id}"}</code> responde com corpo vazio mesmo quando o livro existe, por isso a página de detalhes usa a listagem.</li>
          <li><code>PUT</code> em um id inexistente responde 200 com corpo vazio em vez de 404; o sistema trata esse caso como “não encontrado”.</li>
          <li>Não há autenticação, então nenhuma tela de login foi criada.</li>
        </ul>
      </section>
    </>
  );
}
