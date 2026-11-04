# BookFlow Web

Frontend do BookFlow API: React + TypeScript + Vite + Tailwind CSS 4 + React Router.

## Como rodar
1. Suba a API: `uvicorn app.main:app --reload` (porta 8000).
2. Aqui: `npm install` e `npm run dev` (http://localhost:5173).

O `.env` já vem pronto. Por padrão o Vite repassa `/api` para a API, então **não precisa de CORS**.
Para apontar direto (`VITE_API_URL=http://127.0.0.1:8000`) habilite CORS no `app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])
```

## Estrutura
`src/lib/api.ts` (única camada HTTP), `src/lib/livros.tsx` (estado do acervo), `src/components` (UI e layout), `src/pages`.

## Limitações da API que o frontend contorna (backend intocado)
- `GET /livros/{id}` não tem `return` em `buscar_livro` e sempre responde `null`; o detalhe lê da listagem. Correção: acrescentar `return livro_buscado`.
- `PUT` com id inexistente responde 200 `null` (sem 404).
- Sem busca/filtro/ordenação/paginação no servidor: feitos no cliente.
- O limite de ano 2026 é fixo no modelo.
