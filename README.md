# BookFlow

Aplicação de gerenciamento de livros desenvolvida com Python, FastAPI e React.

**O backend e a API foram desenvolvidos por mim, enquanto o frontend foi desenvolvido inteiramente pelo Claude, com base na API que criei.**

O projeto começou como um estudo pessoal para praticar desenvolvimento de APIs com Python e FastAPI. Posteriormente, decidi levá-lo adiante, utilizando inteligência artificial para desenvolver uma interface que permitisse interagir com os recursos da API.

## Sobre o projeto

O BookFlow é uma aplicação de gerenciamento de livros que permite cadastrar, consultar, editar e excluir livros, utilizando uma API REST para comunicação entre o frontend e o backend.

O desenvolvimento foi dividido em duas partes:

- **Backend:** desenvolvido por mim, utilizando Python, FastAPI, Pydantic e SQLite. Foi a parte central do estudo, com foco na construção de APIs REST, validação de dados e persistência.
- **Frontend:** desenvolvido inteiramente pelo Claude, com base na API que desenvolvi. A interface foi criada para consumir os endpoints existentes e permitir a utilização das funcionalidades do sistema.

O projeto não possui commits anteriores que representem seu histórico inicial de desenvolvimento, pois começou como um estudo pessoal antes de receber o frontend e ser preparado para publicação.

## Tecnologias utilizadas

### Backend
- Python
- FastAPI
- Pydantic
- SQLite
- Uvicorn

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

## Funcionalidades implementadas

- Cadastro de livros.
- Listagem do acervo.
- Consulta de detalhes de um livro.
- Edição de informações.
- Exclusão de livros.
- Pesquisa por título e autor.
- Filtro por disponibilidade.
- Ordenação dos livros.
- Paginação local.
- Validação de dados com Pydantic.
- Persistência de dados utilizando SQLite.

A pesquisa, os filtros, a ordenação e a paginação são realizados no frontend, a partir dos dados retornados pela API.

## Estrutura do projeto

```text
BookFlow/
├── bookflow-api/
│   ├── app/
│   │   ├── banco_de_dados/
│   │   ├── models/
│   │   ├── rotas/
│   │   └── main.py
│   ├── requirements.txt
│   └── bookflow.db
│
├── bookflow-web/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.ts
│
└── .gitignore
```

## Como executar o projeto

### Pré-requisitos

- Python instalado.
- Node.js e npm instalados.
- Git instalado.

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd BookFlow
```

### 2. Configurar o backend

Entre na pasta do backend:

```bash
cd bookflow-api
```

Crie um ambiente virtual:

```bash
python -m venv .venv
```

Ative o ambiente virtual no Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Instale as dependências:

```bash
python -m pip install -r requirements.txt
```

Inicie o servidor:

```bash
python -m uvicorn app.main:app --reload
```

A API estará disponível em:

http://127.0.0.1:8000

A documentação interativa estará disponível em:

http://127.0.0.1:8000/docs

### 3. Configurar o frontend

Abra outro terminal e entre na pasta do frontend:

```bash
cd bookflow-web
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` com as seguintes configurações:

```env
VITE_API_URL=/api
API_PROXY_TARGET=http://127.0.0.1:8000
```

Inicie o frontend:

```bash
npm run dev
```

O Vite exibirá o endereço local da aplicação, geralmente:

http://localhost:5173

Mantenha o backend e o frontend em execução para utilizar a aplicação.

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | Endereço da API utilizado pelo frontend. |
| `API_PROXY_TARGET` | Endereço do backend para o proxy de desenvolvimento do Vite. |

O arquivo `.env` contém configurações locais e não deve ser enviado ao repositório. Utilize o `.env.example` como referência.

## Melhorias futuras

- Implementar busca, filtros, ordenação e paginação no servidor.
- Retornar o total de registros para permitir o cálculo das páginas no frontend.
- Substituir o limite fixo de ano de publicação por uma validação dinâmica.
- Impedir o cadastro de livros duplicados com uma restrição `UNIQUE(titulo, autor)`.
- Retornar HTTP 409 quando houver conflito de duplicidade.
- Padronizar o identificador dos livros como `id`, preservando a compatibilidade com o banco.
- Revisar e reduzir as dependências do backend.
- Melhorar a organização e os testes automatizados do projeto.

## Créditos e uso de inteligência artificial

O frontend do BookFlow foi desenvolvido inteiramente com auxílio de inteligência artificial. Inicialmente, este projeto era apenas um estudo pessoal para praticar desenvolvimento de APIs com Python e FastAPI. Posteriormente, decidi levá-lo adiante e transformá-lo em uma aplicação mais completa. Por esse motivo, o repositório não possui commits anteriores que representem o histórico inicial de desenvolvimento.
