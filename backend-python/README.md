# Backend Python — Serviço de IA (Viali)

Serviço em **Python 3.11 + FastAPI** responsável pela inteligência do chatbot:
recebe perguntas do `backend-node`, recupera contexto relevante (**RAG**) e gera a
resposta com **Azure OpenAI**. É um serviço **interno** — não é exposto à internet
e só conversa com o Node pela rede Docker.

> Faz parte do monorepo da Viali. Veja o `README.md` da raiz para a visão geral.

---

## Stack

| Item            | Tecnologia                              |
| --------------- | --------------------------------------- |
| Linguagem       | Python 3.11                             |
| Framework       | FastAPI                                 |
| Servidor ASGI   | Uvicorn                                 |
| Orquestração IA | LangChain                               |
| LLM             | Azure OpenAI (GPT-4o-mini)              |
| Embeddings      | Azure OpenAI (text-embedding-ada-002)   |
| Busca vetorial  | FAISS (local) / Azure AI Search (evolução) |

---

## Papel no sistema

```
backend-node  → POST /chat  → backend-python
                               ├─ recupera contexto (RAG) dos documentos da Viali
                               ├─ monta o prompt com o contexto
                               └─ chama o Azure OpenAI e retorna a resposta
```

A base de conhecimento fica em `docs/` (montada como volume read-only) e contém
arquivos `.md` sobre os serviços da Viali, FAQ, regimes tributários e informações
locais — usados para fundamentar as respostas.

---

## Endpoint principal

| Método | Rota     | Descrição                                       |
| ------ | -------- | ----------------------------------------------- |
| POST   | `/chat`  | Recebe `{ pergunta, session_id }` e devolve `{ resposta, servico_relacionado, fontes }` |

```bash
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"pergunta": "Qual a diferença entre MEI e ME?", "session_id": "abc"}'
```

---

## Rodando

### Via Docker (junto do stack, a partir da raiz)

```bash
docker-compose up --build
# Serviço em http://localhost:8001
```

### Standalone

```bash
cd backend-python
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

---

## Variáveis de ambiente relevantes

| Variável                              | Descrição                              |
| ------------------------------------- | -------------------------------------- |
| `AZURE_OPENAI_ENDPOINT`               | Endpoint do recurso Azure OpenAI       |
| `AZURE_OPENAI_API_KEY`                | Chave da API                           |
| `AZURE_OPENAI_DEPLOYMENT_NAME`        | Deployment do modelo de chat           |
| `AZURE_OPENAI_EMBEDDING_DEPLOYMENT`   | Deployment do modelo de embeddings     |
| `AZURE_OPENAI_API_VERSION`            | Versão da API                          |
| `AZURE_SEARCH_*`                      | Credenciais do Azure AI Search (se usado) |
| `COSMOS_DB_*`                         | Acesso ao Cosmos DB (se aplicável)     |

---

## RAG — estado atual

O endpoint `/chat` está integrado ao fluxo do Node. A **indexação completa dos
documentos** (geração de embeddings + índice vetorial) está no roadmap:

- **Versão simples (atual/inicial):** FAISS local — gera os embeddings com Azure
  OpenAI e mantém o índice em disco.
- **Evolução:** Azure AI Search como retriever do LangChain — mais robusto e
  demonstra mais integração com o ecossistema Azure.

---

## Conceitos / termos técnicos

- **RAG (Retrieval-Augmented Generation):** recupera trechos relevantes da base de
  conhecimento e os injeta no prompt antes da geração — reduz alucinação e mantém
  as respostas fiéis às informações da Viali.
- **Embeddings:** representação vetorial do texto, usada para busca por
  similaridade semântica.
- **Retriever:** componente que, dada uma pergunta, devolve os documentos mais
  relevantes do índice vetorial.
- **ASGI / Uvicorn:** o FastAPI roda sobre ASGI (assíncrono), servido pelo Uvicorn.