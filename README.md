# Viali Assessoria Contábil - Sistema Web + Chatbot IA

Landing page profissional com chatbot inteligente usando RAG + Azure OpenAI.

## Stack:
- **Frontend:** React 18 + Vite
- **Backend:** Node.js 20 + Express (API Gateway)
- **AI:** Python 3.11 + FastAPI + LangChain + Azure OpenAI
- **Banco:** Azure Cosmos DB (NoSQL)
- **Busca Vetorial:** Azure AI Search / FAISS
- **Deploy:** Oracle Cloud A1 (ARM64) + Docker + Caddy

## Como rodar localmente

### Pré-requisitos:
- Docker Desktop instalado
- Arquivo `.env` configurado (veja `.env.example`)

### Subir todos os serviços
```bash
docker-compose up --build
```
