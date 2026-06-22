# Viali Assessoria Contábil — Sistema Web + Chatbot IA

Landing page profissional para um escritório de contabilidade em Brasília-DF,
com chatbot inteligente (RAG + Azure OpenAI), formulário de contato com envio de
e-mail, consulta de CNPJ/CEP e integração com serviços Azure.

> Projeto full-stack em arquitetura de **monorepo** com três serviços
> independentes orquestrados via Docker, em produção numa VM **Oracle Cloud A1
> (ARM64)** atrás de um proxy reverso **Caddy** com HTTPS automático.

**Produção:** https://viali.vhmedeiros.dev.br

---

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Stack técnica](#stack-técnica)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Rodando localmente (desenvolvimento)](#rodando-localmente-desenvolvimento)
- [Deploy em produção](#deploy-em-produção)
- [Funcionalidades](#funcionalidades)
- [Padrões técnicos aplicados](#padrões-técnicos-aplicados)
- [Roadmap](#roadmap)
- [Autor](#autor)

---

## Visão geral

A Viali é uma landing page que funciona também como **funil de vendas**: apresenta
os serviços contábeis, gera confiança com prova social e captura leads. Por trás
da página existe uma camada de inteligência (chatbot com RAG) e integrações com
APIs públicas e serviços Azure.

O projeto é dividido em três serviços que conversam entre si:

| Serviço          | Papel                                                        |
| ---------------- | ------------------------------------------------------------ |
| `frontend`       | Interface em React (landing page + chatbot + formulários)    |
| `backend-node`   | **API Gateway** — recebe o frontend, valida, orquestra       |
| `backend-python` | Serviço de **IA** — processa perguntas com RAG + Azure OpenAI |

---

## Arquitetura

O `backend-node` atua como **API Gateway / BFF (Backend For Frontend)**: o
frontend nunca fala direto com o serviço de IA nem com APIs externas — tudo passa
pelo Node, que valida, padroniza e orquestra.

### Fluxo do chatbot

```
Usuário (React)
  → POST /api/chat (Node)
    → Node encaminha para o serviço Python (HTTP interno)
      → Python processa com RAG (FAISS / Azure AI Search)
        → Azure OpenAI gera a resposta com o contexto recuperado
    → Node salva a conversa no Azure Cosmos DB (fire-and-forget)
  → Resposta volta para o React
```

### Fluxo do formulário de contato

```
Usuário (React)
  → POST /api/contato (Node)
    → Node valida os dados
    → Salva o lead no Azure Cosmos DB
    → Dispara e-mails via Resend (notificação + confirmação)
  → Confirmação volta para o usuário
```

### Topologia em produção

```
Internet → Caddy (80/443, HTTPS automático)
             ├─ viali.vhmedeiros.dev.br
             │     ├─ /api/*  → viali-node:3000
             │     └─ /*      → viali-frontend:80 (estático via nginx)
             └─ (outros domínios no mesmo proxy)

viali-node ←→ viali-python   (rede interna Docker, não exposta)
```

---

## Stack técnica

| Camada              | Tecnologia                                             |
| ------------------- | ------------------------------------------------------ |
| Frontend            | React 19, Vite, CSS Modules, Framer Motion             |
| Backend (Gateway)   | Node.js 20, Express                                    |
| Backend (IA)        | Python 3.11, FastAPI, LangChain                        |
| LLM                 | Azure OpenAI (GPT-4o-mini)                             |
| Embeddings          | Azure OpenAI (text-embedding-ada-002)                  |
| Banco de dados      | Azure Cosmos DB (API NoSQL)                            |
| Busca vetorial      | FAISS (local) / Azure AI Search (evolução)             |
| E-mail              | Resend                                                 |
| APIs públicas       | publica.cnpj.ws (CNPJ), ViaCEP (CEP)                   |
| Containerização     | Docker + Docker Compose                                |
| Proxy reverso       | Caddy (HTTPS automático via Let's Encrypt)             |
| Deploy              | Oracle Cloud A1 (ARM64, Ubuntu)                        |

---

## Estrutura de pastas

```
projeto-viali/
├── frontend/                 # React 19 + Vite
├── backend-node/             # Node.js 20 + Express (API Gateway)
├── backend-python/           # Python 3.11 + FastAPI (IA / RAG)
├── docs/                     # Base de conhecimento para o RAG (.md)
├── docker-compose.yml        # Orquestração — desenvolvimento
├── docker-compose.prod.yml   # Orquestração — produção
├── arquitetura.md            # Documento de arquitetura / roadmap
└── README.md
```

Cada serviço tem seu próprio `README.md` com detalhes específicos.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use o `.env.example` como base). Ele **não é
versionado** (está no `.gitignore`) e precisa ser criado também no servidor de
produção.

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
AZURE_OPENAI_EMBEDDING_DEPLOYMENT=text-embedding-ada-002
AZURE_OPENAI_API_VERSION=2024-02-01

# Azure Cosmos DB
COSMOS_DB_ENDPOINT=
COSMOS_DB_KEY=
COSMOS_DB_DATABASE=viali
COSMOS_DB_CONTAINER_CONVERSAS=conversas
COSMOS_DB_CONTAINER_LEADS=leads

# Azure AI Search (opcional)
AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_KEY=
AZURE_SEARCH_INDEX=viali-docs

# Resend (e-mail)
RESEND_API_KEY=
EMAIL_TO=contato@vialicontabilidade.com.br
EMAIL_FROM=noreply@viali.vhmedeiros.dev.br

# URLs internas (rede Docker)
PYTHON_SERVICE_URL=http://backend-python:8001

# Ambiente
NODE_ENV=production
DOMAIN=viali.vhmedeiros.dev.br
```

---

## Rodando localmente (desenvolvimento)

**Pré-requisitos:** Docker + Docker Compose e um `.env` configurado.

```bash
docker-compose up --build
```

| Serviço          | URL local                       |
| ---------------- | ------------------------------- |
| Frontend (Vite)  | http://localhost:5173           |
| API (Node)       | http://localhost:3000/api/health |
| IA (FastAPI)     | http://localhost:8001           |

> **Nota (Docker + Vite):** se as alterações de código não aparecerem no
> navegador, o watcher do Vite dentro do container pode não estar detectando
> mudanças do host. Reinicie o serviço (`docker-compose restart frontend`),
> rode o frontend fora do Docker durante o desenvolvimento, ou habilite polling
> no `vite.config`.

---

## Deploy em produção

A VM já roda outras aplicações atrás de um **único Caddy** (dono das portas
80/443). A Viali **não sobe um segundo proxy** — ela se conecta ao Caddy
existente através de uma **rede Docker externa compartilhada** (`web`). Assim,
nada das outras aplicações é afetado.

```bash
# 1. Rede compartilhada (uma vez)
docker network create web

# 2. Conectar o Caddy existente à rede web (e persistir no compose dele)
docker network connect web <nome-do-container-caddy>

# 3. Bloco no Caddyfile (proxy por domínio)
#    viali.vhmedeiros.dev.br {
#        handle /api/* { reverse_proxy viali-node:3000 }
#        handle        { reverse_proxy viali-frontend:80 }
#    }

# 4. Subir a Viali (build arm64 nativo na A1)
docker compose -f docker-compose.prod.yml up -d --build

# 5. Recarregar o Caddy (zero downtime)
docker exec <container-caddy> caddy reload --config /etc/caddy/Caddyfile
```

Diferenças do compose de produção:

- O **frontend** é compilado (`npm run build`) e servido como estático via
  **nginx** (`Dockerfile.prod`, multi-stage build) — não usa o Vite dev server.
- Nenhuma porta é publicada no host: todo o tráfego entra pelo Caddy.
- `VITE_API_URL=/api` (mesma origem) é passado como **build arg**, pois variáveis
  `VITE_*` são injetadas em tempo de **build**, não de runtime.

---

## Funcionalidades

- **Landing page** com identidade visual própria (design system v2): hero,
  serviços, sobre, quem somos e contato.
- **Chatbot flutuante** com RAG + Azure OpenAI (estrutura preparada).
- **Formulário de contato** com persistência no Cosmos DB e envio de e-mail
  (Resend).
- **Consulta de CNPJ** via `publica.cnpj.ws`.
- **Consulta de CEP** via ViaCEP.
- **Botão flutuante de WhatsApp** com link direto para atendimento.

---

## Padrões técnicos aplicados

- **API Gateway / BFF** — o Node centraliza e orquestra; o frontend não fala com
  serviços internos diretamente.
- **API Proxy** — consultas a APIs externas (CNPJ/CEP) passam pelo backend.
- **DTO / Response Shaping** — respostas de APIs externas são remodeladas para um
  formato estável próprio.
- **Input sanitization & validation** — limpeza e validação antes de processar.
- **Fire-and-forget** — persistência no banco sem bloquear a resposta ao usuário.
- **Design Tokens / CSS Custom Properties** — identidade visual centralizada.
- **Multi-stage build** + **SPA fallback** — build de produção enxuto servido por nginx.
- **RAG (Retrieval-Augmented Generation)** — recuperação de contexto + geração.

---

## Roadmap

- [ ] RAG completo (indexação dos documentos da Viali em FAISS / Azure AI Search)
- [ ] Blog com área administrativa
- [ ] Newsletter com double opt-in e entregabilidade (SPF/DKIM/DMARC)
- [ ] Carrossel de últimos artigos na home
- [ ] Refinamento da versão mobile
- [ ] Migração de SEO do blog para SSR/SSG (avaliar Next.js)

---

## Autor

Desenvolvido por **VH.Medeiros** — [vhmedeiros.dev.br](https://vhmedeiros.dev.br)