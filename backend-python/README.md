# 🧠 Viali Assessoria Contábil — Backend Python (IA Service)

> Serviço de **Inteligência Artificial** com **FastAPI**, responsável exclusivamente pelo **chatbot com RAG** (Retrieval-Augmented Generation) da Viali. Recebe perguntas do usuário, busca contexto nos documentos da empresa e retorna respostas inteligentes via LLM.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Arquitetura](#-arquitetura)
- [O que é RAG?](#-o-que-é-rag)
- [Guia de Arquivos](#-guia-de-arquivos)
  - [Configuração e Build](#1-configuração-e-build)
  - [Ponto de Entrada (main.py)](#2-ponto-de-entrada-mainpy)
  - [Scripts Auxiliares](#3-scripts-auxiliares)
  - [Documentos (docs/)](#4-documentos-docs)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Como Rodar](#-como-rodar)
- [Comandos Úteis](#-comandos-úteis)

---

## 🎯 Visão Geral

Este backend Python é o **serviço de IA** da Viali — um microserviço **100% focado no chatbot inteligente**. Ele **não** lida com autenticação, CRUD, nem envio de e-mails. Sua única responsabilidade é **responder perguntas** usando RAG.

### Papel de cada serviço na arquitetura

| Responsabilidade | Frontend React | Backend Node | Backend Python |
|-----------------|---------------|--------------|----------------|
| Interface do usuário | ✅ | ❌ | ❌ |
| Formulário de contato / e-mail | ❌ | ✅ | ❌ |
| Health check | ❌ | ✅ | ✅ |
| **Chatbot com IA (RAG)** | ❌ | ❌ | **✅** |
| Indexação de documentos | ❌ | ❌ | **✅** |
| Busca semântica | ❌ | ❌ | **✅** |
| Integração com LLM | ❌ | ❌ | **✅** |

### Fluxo típico do Chatbot

```
Visitante abre o chat no site (Frontend React)
  │
  ├─ Digita: "Como abrir uma empresa MEI?"
  │
  ▼
Frontend faz POST para Backend Python (/chat)
  │
  ▼
Backend Python:
  1. Recebe a pergunta
  2. Busca nos documentos da Viali (RAG) os trechos mais relevantes
  3. Monta um prompt com contexto + pergunta
  4. Envia para o LLM (ex: OpenAI, Gemini, Ollama)
  5. Retorna a resposta gerada
  │
  ▼
Frontend exibe a resposta no chat
```

### Por que Python para IA?

- **Ecossistema líder**: 95% das bibliotecas de IA/ML são Python (LangChain, LlamaIndex, OpenAI SDK, etc.)
- **FastAPI**: framework moderno, assíncrono, com tipagem e documentação automática
- **Separação total**: o serviço de IA escala independentemente dos outros backends

---

## 🛠 Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Python** | 3.11 (Alpine) | Linguagem principal do serviço de IA |
| **FastAPI** | 0.111.0 | Framework web assíncrono com docs automáticas |
| **Uvicorn** | 0.29.0 | Servidor ASGI de alta performance para FastAPI |
| **Pydantic** | (via FastAPI) | Validação e tipagem de dados (schemas) |
| **python-dotenv** | 1.0.1 | Carrega variáveis de ambiente de `.env` |
| **httpx** | 0.27.0 | Cliente HTTP assíncrono (chamadas a APIs externas / LLM) |
| **Docker** | — | Containerização para ambiente consistente |

### Por que essas escolhas?

- **FastAPI** → 3x mais rápido que Flask, tipagem nativa, gera Swagger automático em `/docs`
- **Uvicorn** → Servidor ASGI padrão para FastAPI, suporta async/await nativo
- **Pydantic** → Valida request/response automaticamente com type hints do Python
- **httpx** → Substituto moderno do `requests`, com suporte a `async` (essencial para chamar LLMs sem bloquear)
- **python-dotenv** → Mesmo padrão do Node — credenciais fora do código

### Comparação FastAPI vs Express (Node)

| Aspecto | FastAPI (Python) | Express (Node) |
|---------|-----------------|----------------|
| Tipagem | Nativa (type hints + Pydantic) | Manual (sem validação built-in) |
| Docs automática | ✅ Swagger + ReDoc em `/docs` | ❌ Precisa instalar swagger-jsdoc |
| Validação | ✅ Automática via Pydantic | ❌ Manual ou express-validator |
| Async | ✅ `async/await` nativo | ✅ Event loop nativo |
| Performance | Muito alta (Starlette + Uvicorn) | Alta (V8 engine) |
| Ecossistema IA | ✅ Líder absoluto | ❌ Limitado |

---

## 📁 Estrutura de Pastas

```
backend-python/
├── Dockerfile                # Imagem Docker do serviço Python
├── requirements.txt          # Dependências pip (equivalente ao package.json)
├── main.py                   # Ponto de entrada — app FastAPI, rotas e schemas
├── criar_indice.py           # Script para indexar documentos (criar base vetorial)
├── test_search.py            # Script para testar busca semântica no índice
├── .env                      # Variáveis de ambiente (NÃO vai pro Git)
├── README.md                 # 📌 Este arquivo
│
├── docs/                     # Documentos-fonte da Viali para o RAG
│   └── (arquivos .txt, .pdf, .md com conteúdo da empresa)
│
├── __pycache__/              # Cache do Python (ignorado pelo Git)
└── node_modules/             # (pode ignorar — provavelmente resíduo)
```

### Comparação de Nomenclatura com Node

| Python (FastAPI) | Node (Express) | Função |
|-----------------|----------------|--------|
| `main.py` | `src/server.js` | Ponto de entrada da aplicação |
| `requirements.txt` | `package.json` | Lista de dependências |
| `pip install` | `npm install` | Instala dependências |
| `uvicorn main:app` | `node src/server.js` | Inicia o servidor |
| Pydantic `BaseModel` | — (manual) | Validação de dados |
| Decorators `@app.get()` | `router.get()` | Define rotas |

---

## 🏗 Arquitetura

### Estrutura atual (monolito simples)

```
Request HTTP
  │
  ▼
┌──────────────────────────────────────────────┐
│  main.py                                     │
│                                              │
│  ┌─────────────┐                             │
│  │  FastAPI()   │  ← Cria app, configura CORS│
│  └──────┬──────┘                             │
│         │                                    │
│  ┌──────▼──────┐                             │
│  │   Schemas   │  ← Pydantic (ChatRequest,   │
│  │  (classes)  │    ChatResponse)             │
│  └──────┬──────┘                             │
│         │                                    │
│  ┌──────▼──────┐                             │
│  │   Rotas     │  ← @app.get, @app.post      │
│  │ (funções)   │    /health, /chat, /         │
│  └──────┬──────┘                             │
│         │                                    │
│  ┌──────▼──────┐                             │
│  │  (TODO)     │  ← RAG: busca + LLM         │
│  │  Services   │    (será implementado)       │
│  └─────────────┘                             │
└──────────────────────────────────────────────┘
```

### Arquitetura futura (quando o RAG estiver completo)

```
POST /chat  { pergunta: "Como abrir MEI?" }
  │
  ▼
┌─────────────────────────────────────────────────────────┐
│  main.py → rota /chat                                   │
│    │                                                    │
│    ▼                                                    │
│  1. RETRIEVAL (Busca)                                   │
│    ├─ Converte pergunta em vetor (embedding)            │
│    ├─ Busca documentos similares no índice vetorial     │
│    └─ Retorna top-K trechos mais relevantes             │
│    │                                                    │
│    ▼                                                    │
│  2. AUGMENTED (Contexto)                                │
│    ├─ Monta prompt: "Dado este contexto: {trechos}..."  │
│    └─ Adiciona: "Responda a pergunta: {pergunta}"       │
│    │                                                    │
│    ▼                                                    │
│  3. GENERATION (Resposta)                               │
│    ├─ Envia prompt para o LLM (OpenAI / Gemini / local) │
│    └─ Retorna resposta gerada                           │
└─────────────────────────────────────────────────────────┘
  │
  ▼
{ resposta: "Para abrir um MEI, você precisa..." }
```

---

## 🤖 O que é RAG?

**RAG = Retrieval-Augmented Generation** (Geração Aumentada por Recuperação)

É a técnica que permite um chatbot responder com base nos **documentos reais da empresa**, em vez de "inventar" respostas.

### Problema sem RAG

```
Pergunta: "Qual o horário de atendimento da Viali?"
LLM genérico: "Geralmente escritórios funcionam de 9h às 18h" ← CHUTE
```

### Solução com RAG

```
Pergunta: "Qual o horário de atendimento da Viali?"

1. BUSCA nos documentos da Viali → encontra:
   "Atendimento de segunda a sexta, das 8h às 17h30"

2. MONTA prompt:
   "Com base neste trecho: 'Atendimento de segunda a sexta, das 8h às 17h30',
    responda: Qual o horário de atendimento da Viali?"

3. LLM gera:
   "A Viali atende de segunda a sexta-feira, das 8h às 17h30." ← PRECISO
```

### O pipeline em 3 etapas

| Etapa | Nome | O que faz | Quando roda |
|-------|------|-----------|-------------|
| 0 | **Indexação** | Lê documentos da pasta `docs/`, cria vetores e salva o índice | Uma vez (ou quando docs mudam) |
| 1 | **Retrieval** | Busca trechos relevantes no índice vetorial | A cada pergunta |
| 2 | **Augmentation** | Monta prompt com contexto + pergunta | A cada pergunta |
| 3 | **Generation** | Envia prompt ao LLM, recebe resposta | A cada pergunta |

### Pasta `docs/`

Contém os **documentos-fonte** da Viali que alimentam o RAG:

- Informações sobre serviços oferecidos
- FAQ de contabilidade
- Dados da empresa (horário, endereço, contato)
- Processos comuns (abrir empresa, MEI, impostos, etc.)

> **Quanto mais documentos de qualidade nessa pasta, melhor o chatbot responde.**

### Script `criar_indice.py`

Responsável pela **Etapa 0 — Indexação**:

1. Lê todos os arquivos da pasta `docs/`
2. Divide o conteúdo em chunks (pedaços menores)
3. Gera embeddings (vetores numéricos) de cada chunk
4. Salva o índice vetorial para busca rápida

> Roda **uma vez** ou sempre que os documentos mudarem. Não roda a cada pergunta.

### Script `test_search.py`

Script de **teste manual** para verificar se a busca semântica está funcionando:

1. Faz uma pergunta de teste
2. Busca no índice vetorial
3. Mostra os trechos mais relevantes encontrados

> Usado em desenvolvimento para validar a qualidade da indexação.

---

## 📖 Guia de Arquivos

### 1. Configuração e Build

#### `Dockerfile`
```
Propósito: Define a imagem Docker do serviço Python
```

**Camadas da imagem:**

```dockerfile
FROM python:3.11-alpine          # 1. Base: Python 3.11 em Alpine Linux (~50MB)

WORKDIR /app                     # 2. Diretório de trabalho dentro do container

RUN apk add --no-cache \         # 3. Instala compiladores C necessários para
    gcc musl-dev libffi-dev      #    algumas libs Python (numpy, etc.)

COPY requirements.txt .          # 4. Copia só o requirements primeiro
RUN pip install --no-cache-dir \ # 5. Instala dependências (camada cacheada)
    -r requirements.txt

COPY . .                         # 6. Copia o restante do código

EXPOSE 8001                      # 7. Documenta a porta exposta

CMD ["uvicorn", "main:app", \    # 8. Comando de inicialização:
     "--host", "0.0.0.0", \      #    - main:app → arquivo main.py, objeto app
     "--port", "8001", \          #    - porta 8001
     "--reload"]                  #    - reload automático (dev)
```

**Por que `apk add gcc musl-dev libffi-dev`?**

Alpine Linux é minimalista — não vem com compiladores. Algumas bibliotecas Python (numpy, cryptography, etc.) precisam compilar código C durante a instalação. Esses pacotes fornecem o necessário.

**Comparação com o Dockerfile do Node:**

| Aspecto | Node (backend-node) | Python (backend-python) |
|---------|---------------------|------------------------|
| Base | `node:20-alpine` | `python:3.11-alpine` |
| Instalar deps | `npm install` | `pip install -r requirements.txt` |
| Dependências de sistema | Não precisa | `gcc musl-dev libffi-dev` (compiladores C) |
| Comando de início | `node src/server.js` | `uvicorn main:app --host 0.0.0.0 --port 8001` |
| Porta | 3000 | 8001 |
| Auto-reload | `--watch` (Node 20+) | `--reload` (Uvicorn) |

---

#### `requirements.txt`
```
Propósito: Lista de dependências Python com versões fixas (equivalente ao package.json)
```

| Pacote | Versão | Propósito |
|--------|--------|-----------|
| `fastapi` | 0.111.0 | Framework web (rotas, validação, docs automáticas) |
| `uvicorn[standard]` | 0.29.0 | Servidor ASGI que roda o FastAPI |
| `python-dotenv` | 1.0.1 | Carrega `.env` para `os.environ` |
| `httpx` | 0.27.0 | Cliente HTTP assíncrono (para chamar APIs de LLM) |

**Por que versões fixas (pinned)?**
Garante que todos (devs, Docker, produção) usam exatamente as mesmas versões. Evita bugs por atualização inesperada.

**O que é `uvicorn[standard]`?**
O `[standard]` instala extras opcionais (websockets, auto-reload com `watchfiles`, etc.). Sem ele, o `--reload` seria mais lento.

**Comparação com npm:**

| pip (Python) | npm (Node) |
|-------------|-----------|
| `requirements.txt` | `package.json` (dependencies) |
| `pip install -r requirements.txt` | `npm install` |
| `pip install fastapi` | `npm install express` |
| `pip freeze > requirements.txt` | `npm init` / editar package.json |

---

### 2. Ponto de Entrada (`main.py`)

```
Propósito: Arquivo ÚNICO que configura o app FastAPI, define schemas e rotas
```

O `main.py` concentra tudo em um só arquivo (por enquanto). Conforme o RAG crescer, será dividido em módulos (`routes/`, `services/`, `schemas/`).

**Seções do arquivo:**

#### Seção 1 — Imports e Setup

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()  # carrega .env → os.environ
```

- `load_dotenv()` → Lê o `.env` e injeta as variáveis em `os.environ`
- Equivalente Node: `require('dotenv').config()`

#### Seção 2 — Criação do App

```python
app = FastAPI(
    title="Viali IA Service",
    description="Serviço de IA com RAG para chatbot da Viali Assessoria Contábil",
    version="1.0.0"
)
```

- `title`, `description`, `version` → Aparecem na **documentação automática** em `/docs`
- Equivalente Node: `const app = express()` (mas sem docs automáticas)

#### Seção 3 — CORS

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # TODO: restringir em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

- Mesma necessidade do Node: frontend (porta 5173) precisa fazer requests para a API (porta 8001)
- `allow_origins=["*"]` → Aceita qualquer origem (temporário para desenvolvimento)
- Em produção: trocar por `["https://viali.com.br", "http://localhost:5173"]`

**Equivalente Node:**
```js
const cors = require('cors');
app.use(cors());
```

#### Seção 4 — Schemas (Pydantic)

```python
class ChatRequest(BaseModel):
    pergunta: str
    sessao_id: str | None = None

class ChatResponse(BaseModel):
    resposta: str
    sessao_id: str | None = None
```

**O que são Schemas Pydantic?**

Classes que definem a **forma** dos dados. FastAPI usa para:
1. **Validar** automaticamente o request body
2. **Documentar** os campos no Swagger
3. **Serializar** a resposta no formato correto

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `pergunta` | `str` | ✅ Sim | Texto da pergunta do usuário |
| `sessao_id` | `str \| None` | ❌ Não | ID da sessão (para manter contexto entre perguntas) |
| `resposta` | `str` | ✅ Sim | Texto da resposta gerada pela IA |

**Por que `sessao_id`?**
Permite manter **histórico de conversa**. O chatbot pode lembrar o que foi dito antes na mesma sessão, gerando respostas mais contextuais.

**Equivalente Node (sem validação automática):**
```js
// No Node, faria manual:
const { pergunta, sessao_id } = req.body;
if (!pergunta) return res.status(400).json({ error: '...' });
```

Com Pydantic, se `pergunta` não vier, o FastAPI retorna `422 Unprocessable Entity` **automaticamente** com detalhes do erro.

#### Seção 5 — Rotas

**Rota `GET /`** — Página inicial informativa:
```python
@app.get("/")
def root():
    return {
        "message": "Viali IA Service - Python rodando!",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": ["/health", "/chat", "/docs"]
    }
```

**Rota `GET /health`** — Health check padrão:
```python
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "backend-python",
        "timestamp": datetime.utcnow().isoformat(),
        "enviroment": os.getenv("NODE_ENV", "development")
    }
```

**Rota `POST /chat`** — Endpoint principal do chatbot:
```python
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    # TODO: integrar com RAG / LLM aqui
    resposta = f"[Python recebeu] Pergunta: {request.pergunta}"
    return ChatResponse(resposta=resposta, sessao_id=request.sessao_id)
```

- `response_model=ChatResponse` → FastAPI valida e documenta a resposta automaticamente
- Atualmente retorna um **echo** (placeholder). Será substituído pela lógica RAG.

**Decorators `@app.get()` vs Express:**

| FastAPI | Express |
|---------|---------|
| `@app.get("/health")` | `router.get('/health', handler)` |
| `@app.post("/chat")` | `router.post('/chat', handler)` |
| `def chat(request: ChatRequest)` | `function chat(req, res)` |
| Validação automática via type hint | Validação manual no controller |

---

### 3. Scripts Auxiliares

#### `criar_indice.py`
```
Propósito: Indexa os documentos da pasta docs/ para busca vetorial (RAG - Etapa 0)
```

**Quando executar:**
- Na primeira vez que configurar o projeto
- Sempre que adicionar/alterar documentos na pasta `docs/`
- **NÃO** roda automaticamente com o servidor

**Como executar:**
```bash
# Com Docker
docker compose exec backend-python python criar_indice.py

# Sem Docker
cd backend-python && python criar_indice.py
```

---

#### `test_search.py`
```
Propósito: Testa a busca semântica no índice vetorial criado
```

**Para que serve:**
- Validar que a indexação funcionou
- Testar se perguntas retornam trechos relevantes
- Ajustar parâmetros de busca (número de resultados, threshold de similaridade)

**Como executar:**
```bash
# Com Docker
docker compose exec backend-python python test_search.py

# Sem Docker
cd backend-python && python test_search.py
```

---

### 4. Documentos (`docs/`)

```
Propósito: Pasta com documentos-fonte que alimentam a base de conhecimento do RAG
```

**O que colocar aqui:**
- Textos sobre serviços da Viali (contabilidade, fiscal, trabalhista, etc.)
- FAQ de perguntas frequentes dos clientes
- Informações institucionais (endereço, horário, equipe)
- Guias de processos (como abrir MEI, como emitir nota fiscal, etc.)
- Qualquer conhecimento que o chatbot precisa saber

**Formatos aceitos:** `.txt`, `.md`, `.pdf` (depende da lib de indexação usada)

**Regra de ouro:** A qualidade do chatbot é **diretamente proporcional** à qualidade dos documentos nesta pasta.

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env.example`

```env
# Servidor
PORT=8001
NODE_ENV=development

# LLM / IA (para integração futura)
OPENAI_API_KEY=sua-chave-aqui
# ou
GOOGLE_API_KEY=sua-chave-aqui

# RAG
DOCS_PATH=./docs
INDEX_PATH=./index
```

### Descrição de cada variável

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `PORT` | Não (default: 8001) | Porta do servidor Uvicorn |
| `NODE_ENV` | Não (default: development) | Ambiente de execução |
| `OPENAI_API_KEY` | Depende do LLM | Chave da API OpenAI (se usar GPT) |
| `GOOGLE_API_KEY` | Depende do LLM | Chave da API Google (se usar Gemini) |
| `DOCS_PATH` | Não (default: ./docs) | Caminho da pasta de documentos |
| `INDEX_PATH` | Não (default: ./index) | Caminho onde o índice vetorial é salvo |

---

## 🌐 Endpoints da API

### Documentação Automática (Swagger)

O FastAPI gera **documentação interativa** automaticamente:

| URL | Interface | Descrição |
|-----|-----------|-----------|
| `http://localhost:8001/docs` | **Swagger UI** | Documentação interativa — teste endpoints direto no browser |
| `http://localhost:8001/redoc` | **ReDoc** | Documentação em formato mais limpo para leitura |

> **Isso é um diferencial do FastAPI**: não precisa instalar nada extra, as docs vêm prontas.

---

### `GET /`

**Página inicial informativa.**

| Item | Valor |
|------|-------|
| Método | `GET` |
| URL | `http://localhost:8001/` |
| Auth | Nenhuma |

**Response 200:**
```json
{
  "message": "Viali IA Service - Python rodando!",
  "version": "1.0.0",
  "docs": "/docs",
  "endpoints": ["/health", "/chat", "/docs"]
}
```

**Teste com cURL:**
```bash
curl http://localhost:8001/
```

---

### `GET /health`

**Verificação de saúde do serviço.**

| Item | Valor |
|------|-------|
| Método | `GET` |
| URL | `http://localhost:8001/health` |
| Auth | Nenhuma |

**Response 200:**
```json
{
  "status": "ok",
  "service": "backend-python",
  "timestamp": "2026-06-17T22:30:00.000000",
  "enviroment": "development"
}
```

**Teste com cURL:**
```bash
curl http://localhost:8001/health
```

---

### `POST /chat`

**Endpoint principal — recebe pergunta e retorna resposta da IA.**

| Item | Valor |
|------|-------|
| Método | `POST` |
| URL | `http://localhost:8001/chat` |
| Auth | Nenhuma (por enquanto) |
| Content-Type | `application/json` |

**Request Body:**
```json
{
  "pergunta": "Como abrir uma empresa MEI?",
  "sessao_id": "abc-123-def"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `pergunta` | string | ✅ Sim | Pergunta do usuário |
| `sessao_id` | string \| null | ❌ Não | ID da sessão de chat (para contexto) |

**Response 200 (sucesso):**
```json
{
  "resposta": "[Python recebeu] Pergunta: Como abrir uma empresa MEI?",
  "sessao_id": "abc-123-def"
}
```

> **Nota:** Atualmente retorna um echo (placeholder). Quando o RAG estiver integrado, retornará respostas inteligentes baseadas nos documentos da Viali.

**Response 422 (validação — automática do FastAPI):**
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "pergunta"],
      "msg": "Field required",
      "input": {}
    }
  ]
}
```

> O FastAPI retorna `422` automaticamente quando o body não bate com o schema Pydantic. Não precisa validar manualmente.

**Teste com cURL:**
```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{
    "pergunta": "Quais serviços a Viali oferece?",
    "sessao_id": "sessao-001"
  }'
```

**Teste pelo Swagger (mais fácil):**
1. Acesse `http://localhost:8001/docs` no browser
2. Clique em `POST /chat`
3. Clique em "Try it out"
4. Preencha o body JSON
5. Clique em "Execute"

---

## 🚀 Como Rodar

### Com Docker (Recomendado)

```powershell
# Na raiz do projeto (onde está o docker-compose.yml)
docker compose up -d --build backend-python

# Verificar se está rodando
curl http://localhost:8001/health

# Acessar docs interativas
# Abra no browser: http://localhost:8001/docs
```

### Sem Docker (Desenvolvimento Local)

```powershell
# Entrar na pasta do backend-python
cd backend-python

# Criar ambiente virtual (recomendado)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependências
pip install -r requirements.txt

# Criar arquivo .env
cp .env.example .env
# (editar .env com suas chaves de API)

# Iniciar em modo desenvolvimento (auto-reload)
uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# Acessar docs: http://localhost:8001/docs
```

---

## 🔧 Comandos Úteis

```powershell
# ═══════════════════════════════════════
# DOCKER
# ═══════════════════════════════════════

# Ver logs do container
docker compose logs -f backend-python

# Reiniciar apenas o backend-python
docker compose restart backend-python

# Reconstruir após mudanças no Dockerfile ou requirements.txt
docker compose up -d --build backend-python

# Acessar terminal dentro do container
docker compose exec backend-python sh

# Instalar nova dependência (dentro do container)
docker compose exec backend-python pip install nome-do-pacote

# ═══════════════════════════════════════
# RAG / INDEXAÇÃO
# ═══════════════════════════════════════

# Criar/atualizar índice vetorial dos documentos
docker compose exec backend-python python criar_indice.py

# Testar busca semântica
docker compose exec backend-python python test_search.py

# ═══════════════════════════════════════
# TESTES E DEBUG
# ═══════════════════════════════════════

# Testar health check
curl http://localhost:8001/health

# Testar chat
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"pergunta": "O que é MEI?"}'

# Abrir Swagger UI (documentação interativa)
# → http://localhost:8001/docs

# Abrir ReDoc (documentação alternativa)
# → http://localhost:8001/redoc

# ═══════════════════════════════════════
# DEPENDÊNCIAS
# ═══════════════════════════════════════

# Listar dependências instaladas
docker compose exec backend-python pip list

# Exportar dependências atuais para requirements.txt
docker compose exec backend-python pip freeze > requirements.txt

# Parar todos os serviços
docker compose down
```

---

## 🗺 Próximas Etapas

### RAG Pipeline
- [ ] **Escolher lib de RAG** — LangChain, LlamaIndex ou implementação manual
- [ ] **Escolher LLM** — OpenAI GPT-4, Google Gemini, ou modelo local (Ollama)
- [ ] **Escolher embedding model** — OpenAI text-embedding-3-small, Sentence Transformers
- [ ] **Escolher vector store** — ChromaDB, FAISS, ou Pinecone
- [ ] **Implementar indexação completa** no `criar_indice.py`
- [ ] **Implementar busca + geração** na rota `/chat`

### Funcionalidades
- [ ] **Histórico de sessão** — Manter contexto entre perguntas da mesma sessão
- [ ] **Streaming de resposta** — Retornar tokens conforme o LLM gera (Server-Sent Events)
- [ ] **Feedback do usuário** — Botão 👍/👎 para melhorar respostas
- [ ] **Rate limiting** — Limitar requests por IP/sessão

### Estrutura
- [ ] **Modularizar** — Separar em `routes/`, `services/`, `schemas/`, `core/`
- [ ] **Testes automatizados** — pytest com cobertura dos endpoints
- [ ] **CI/CD** — GitHub Actions para lint + test + deploy

### Segurança
- [ ] **Autenticação** — Proteger endpoint `/chat` (API key ou JWT via Node)
- [ ] **Input sanitization** — Prevenir prompt injection
- [ ] **CORS restrito** — Limitar origens em produção
- [ ] **Rate limiting** — slowapi ou middleware customizado

---

## 📝 Padrões do Projeto

### Regras de Código

1. **Tipagem sempre** — Usar type hints em todas as funções e parâmetros
2. **Pydantic para dados** — Nunca usar `dict` puro para request/response
3. **Docstrings nas rotas** — FastAPI usa como descrição no Swagger
4. **Variáveis sensíveis no `.env`** — Nunca hardcoded
5. **Documentos no `docs/`** — Fonte única de verdade para o RAG

### Padrão de uma Rota

```python
@app.post("/endpoint", response_model=ResponseSchema)
def nome_da_rota(request: RequestSchema):
    """
    Descrição que aparece no Swagger.
    """
    # 1. Dados já validados pelo Pydantic (automático)
    # 2. Chama o service/lógica de negócio
    resultado = algum_service(request.campo)
    # 3. Retorna o schema de resposta
    return ResponseSchema(campo=resultado)
```

### Padrão de um Schema

```python
class NomeSchema(BaseModel):
    campo_obrigatorio: str                    # obrigatório
    campo_opcional: str | None = None         # opcional, default None
    campo_com_default: int = 10               # opcional, default 10
    campo_lista: list[str] = []               # lista opcional
```

---

## 🔒 Segurança

### Implementado

| Medida | Como |
|--------|------|
| **CORS** | Middleware FastAPI (`CORSMiddleware`) |
| **Validação automática** | Pydantic rejeita dados inválidos (422) |
| **Variáveis de ambiente** | Credenciais fora do código-fonte |
| **Tipagem forte** | Type hints previnem erros de tipo |

### Planejado

| Medida | Ferramenta |
|--------|------------|
| **Rate limiting** | `slowapi` — limita requests por IP |
| **Auth** | API key ou JWT validado pelo Node |
| **Prompt injection** | Sanitização e guardrails na entrada |
| **CORS restrito** | Lista de origens permitidas em produção |
| **HTTPS** | Nginx reverse proxy com SSL |

---

## 📊 Portas do Projeto (Resumo)

| Serviço | Porta | URL |
|---------|-------|-----|
| Frontend React | 5173 | `http://localhost:5173` |
| Backend Node | 3000 | `http://localhost:3000/api` |
| **Backend Python** | **8001** | **`http://localhost:8001`** |
| Python Swagger Docs | 8001 | `http://localhost:8001/docs` |

---

> **Desenvolvido com 🧠 para a Viali Assessoria Contábil**
> *Backend Python + FastAPI | RAG Chatbot | Docker containerizado*
