**CONTEXTO GERAL**

Estou desenvolvendo um projeto fullstack que serve dois propósitos simultâneos: (1) criar uma landing page real para um escritório de contabilidade com chatbot inteligente, e (2) usar esse projeto como preparação para uma entrevista técnica para a vaga de Desenvolvedor Pro Code Node/Python Pleno/Sênior na empresa L3, que constrói chatbots corporativos com Azure OpenAI, Node.js e Python.

Por isso, **cada etapa precisa ser muito bem explicada**, com o raciocínio por trás de cada decisão técnica. Não quero apenas código que funcione — quero entender o que estou fazendo e por quê, pois precisarei explicar isso numa entrevista técnica com um CTO.

---

**REQUISITOS DA VAGA QUE PRECISO DEMONSTRAR**

- Node.js com Express para APIs e integrações
- Python para IA, NLP e automações
- Azure OpenAI integrado em pipelines de produção
- LangChain e RAG (Retrieval-Augmented Generation)
- React no frontend
- Consumo de APIs externas
- Azure Cosmos DB (diferencial da vaga)
- Azure AI Search (diferencial da vaga)
- Docker e containerização
- Deploy em Linux (Ubuntu Server, Oracle Cloud VM ARM64)

---

**O QUE O PROJETO É**

Uma landing page profissional para um escritório de contabilidade chamado **Viali Assessoria Contábil**, localizado em Brasília-DF, com as seguintes informações reais:

- **Endereço:** Centro Empresarial Parque Brasília, SIG Quadra 01 Sala 112, Brasília - DF, 70610-410
- **Telefone:** (61) 3032-4349
- **Avaliação Google:** 5,0 estrelas
- **Horário:** Segunda a Sexta, 08:00 às 18:00
- **Logo:** arquivo `logo_viali.webp` fornecido — fundo azul escuro, símbolo de caduceu azul claro, nome "Viali" em branco com detalhes em azul, subtítulo "ASSESSORIA CONTÁBIL"
- **Domínio:** `viali.vhmedeiros.dev.br`

**Serviços oferecidos:**
- Abertura de empresas
- Alterações de contrato
- Contabilidade para MEI e ME
- Contabilidade para advogados
- Contabilidade para médicos, dentistas, médicos veterinários
- Contabilidade para corretores de imóveis
- Fiscal e tributário
- Departamento pessoal

**A página deve ter:**
- Visual profissional inspirado na identidade visual da logo (azul escuro, azul claro, branco)
- Seções para cada serviço com descrições relevantes
- Formulário de contato com envio de email gratuito
- Chatbot flutuante no canto da tela usando Azure OpenAI com RAG
- Integração com API pública de CNPJ (publica.cnpj.ws) e ViaCEP
- Exibição das avaliações do Google e informações de contato reais

---

**ARQUITETURA DO PROJETO**

```
projeto-viali/
├── frontend/           # React
├── backend-node/       # Node.js + Express (API Gateway)
├── backend-python/     # Python + FastAPI + LangChain + Azure OpenAI
├── docker-compose.yml  # Orquestração de todos os serviços
├── docker-compose.prod.yml
└── docs/               # Documentos da contabilidade para o RAG
    ├── servicos.md
    ├── faq.md
    ├── tributario.md
    └── sobre.md
```

**Fluxo do chatbot:**
```
Usuário digita pergunta no React
    → Node.js recebe e encaminha
    → Python processa com RAG
        → Azure AI Search ou FAISS busca contexto relevante
        → Azure OpenAI gera resposta com o contexto
    → Resposta volta pro React
    → Conversa salva no Azure Cosmos DB
```

**Fluxo do formulário de contato:**
```
Usuário preenche formulário no React
    → Node.js recebe os dados
    → Lead salvo no Azure Cosmos DB
    → Node.js envia email via Resend (gratuito)
    → Confirmação volta pro usuário
```

**Fluxo CNPJ:**
```
Usuário digita CNPJ no chatbot ou formulário
    → Node.js consulta https://publica.cnpj.ws/cnpj/{cnpj}
    → Retorna situação e dados da empresa formatados
```

---

**STACK TÉCNICA COMPLETA**

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, Vite, CSS Modules |
| Backend principal | Node.js 20, Express |
| Backend IA | Python 3.11, FastAPI, LangChain |
| LLM | Azure OpenAI (GPT-4o-mini) |
| Embeddings | Azure OpenAI (text-embedding-ada-002) |
| Banco de conversas e leads | Azure Cosmos DB (NoSQL) |
| Busca vetorial | Azure AI Search OU FAISS local |
| Email | Resend (gratuito, 3000/mês) |
| Containerização | Docker + Docker Compose |
| Deploy | Oracle Cloud VM A1 (ARM64, Ubuntu 22.04) |
| Proxy reverso | Caddy (HTTPS automático) |
| Domínio | viali.vhmedeiros.dev.br |

---

**SOBRE OS SERVIÇOS AZURE QUE QUERO USAR**

A vaga pede Azure e Cosmos DB como diferencial. Quero usar o máximo possível do Azure com meus USD 200 de crédito:

**1. Azure OpenAI** — Motor do chatbot
- Deploy do modelo GPT-4o-mini para geração de respostas
- Deploy do text-embedding-ada-002 para embeddings do RAG

**2. Azure Cosmos DB** — Banco de dados NoSQL
- Salvar histórico de conversas do chatbot (collection: `conversas`)
- Salvar leads do formulário de contato (collection: `leads`)
- Isso demonstra diretamente o diferencial pedido na vaga

**3. Azure AI Search** (opcional, se o crédito permitir) — Busca vetorial
- Indexar os documentos da Viali para o RAG
- Alternativa mais robusta ao FAISS local
- Se o custo for alto, usar FAISS local e mencionar o Azure AI Search como evolução

**Para cada serviço Azure, preciso:**
- Passo a passo para criar o recurso no portal Azure
- Como obter as credenciais (connection strings, api keys)
- Como configurar no código Python ou Node.js
- Como testar que a conexão está funcionando

---

**SOBRE O AZURE COSMOS DB**

Usar a API NoSQL do Cosmos DB. Estrutura dos documentos:

```json
// Collection: conversas
{
  "id": "uuid",
  "sessionId": "uuid-da-sessao",
  "timestamp": "2024-01-01T10:00:00Z",
  "pergunta": "Como abrir uma empresa em Brasília?",
  "resposta": "Para abrir uma empresa...",
  "servico_relacionado": "abertura_empresas"
}

// Collection: leads
{
  "id": "uuid",
  "timestamp": "2024-01-01T10:00:00Z",
  "nome": "João Silva",
  "email": "joao@empresa.com",
  "telefone": "(61) 99999-9999",
  "servico_interesse": "abertura_empresas",
  "mensagem": "Quero saber mais sobre abertura de empresa",
  "cnpj": "00.000.000/0001-00",
  "status": "novo"
}
```

---

**SOBRE O RAG**

O RAG vai usar documentos sobre a Viali como base de conhecimento. Vou criar arquivos `.md` com:
- Descrição detalhada de cada serviço
- Perguntas frequentes
- Diferenças entre MEI, ME, Lucro Presumido, Lucro Real
- Informações sobre Brasília-DF (onde a Viali atua)
- Preços e condições (quando eu fornecer)

**Se usar Azure AI Search:**
- Indexar os documentos no Azure AI Search
- Usar o LangChain com o retriever do Azure AI Search
- Mais robusto e demonstra mais conhecimento Azure para a entrevista

**Se usar FAISS (fallback local):**
- Gerar embeddings com Azure OpenAI
- Salvar índice FAISS localmente
- Mencionar Azure AI Search como evolução natural

---

**SOBRE O EMAIL GRATUITO**

Usar Resend (resend.com):
- Criar conta gratuita
- Obter API key
- No Node.js: `npm install resend`
- Enviar email para contato@viali.com.br quando formulário for submetido
- Enviar email de confirmação para o lead
- Limite gratuito: 3000 emails/mês

---

**SOBRE O DEPLOY**

VM Oracle Cloud A1:
- 4 OCPUs ARM64 (Ampere Altra)
- 24 GB RAM
- Ubuntu 22.04
- Docker instalado
- IP público fixo
- Domínio: `viali.vhmedeiros.dev.br` apontando para o IP da VM

**Caddy como proxy reverso** (mais simples que Nginx para HTTPS automático):
```
viali.vhmedeiros.dev.br → container React (porta 80)
viali.vhmedeiros.dev.br/api → container Node.js (porta 3000)
```

**Atenção ARM64:** todos os containers precisam ter build para `linux/arm64` ou usar imagens multi-arch.

---

**COMO QUERO QUE VOCÊ ME AJUDE**

Quero que você me guie em **baby steps**, uma etapa de cada vez, sempre:

1. Explicando o que vamos fazer e por quê
2. Mostrando o código completo da etapa
3. Explicando cada parte importante do código com comentários
4. Dizendo exatamente como testar se funcionou
5. Avisando sobre erros comuns em ARM64 especificamente
6. Me dizendo o **nome técnico correto** do que estou implementando (preciso usar na entrevista)

**Não avance para a próxima etapa sem eu confirmar que a atual funcionou.**

---

**ORDEM DAS ETAPAS**

**FASE 1 — Estrutura base**
1. Criar estrutura de pastas do monorepo
2. Inicializar React com Vite
3. Inicializar Node.js com Express
4. Inicializar Python com FastAPI
5. Criar docker-compose.yml base com os 3 serviços
6. Testar que os 3 containers sobem e se comunicam

**FASE 2 — Azure (do zero, passo a passo no portal)**
7. Criar recurso Azure OpenAI + deploy dos modelos
8. Criar recurso Azure Cosmos DB + configurar collections
9. (Opcional) Criar Azure AI Search
10. Testar conexão com cada serviço

**FASE 3 — Backend Node.js**
11. Rota health check
12. Rota chatbot (recebe pergunta, encaminha ao Python, salva no Cosmos DB)
13. Rota formulário de contato (salva no Cosmos DB + envia email Resend)
14. Rota consulta CNPJ (publica.cnpj.ws)
15. Rota consulta CEP (ViaCEP)
16. Testar todas as rotas

**FASE 4 — RAG com LangChain + Azure**
17. Criar documentos de conhecimento da Viali
18. Script de indexação (Azure AI Search ou FAISS)
19. Endpoint FastAPI com RAG completo
20. Integrar com Azure OpenAI para geração de resposta
21. Testar com perguntas reais sobre contabilidade

**FASE 5 — Frontend React**
22. Layout base com identidade visual da Viali (azul escuro #0a1628, azul claro #1e90ff, branco)
23. Header com logo `logo_viali.webp`
24. Seção Hero
25. Seção de serviços (card para cada serviço)
26. Seção sobre a Viali (endereço, telefone, avaliação 5 estrelas)
27. Formulário de contato com campo de CNPJ e consulta automática
28. Componente chatbot flutuante
29. Responsividade mobile

**FASE 6 — Deploy na VM Oracle Cloud A1**
30. Preparar servidor (firewall, domínio, dependências)
31. Configurar variáveis de ambiente em produção
32. Build ARM64 de todos os containers
33. docker-compose.prod.yml com Caddy
34. Configurar DNS para viali.vhmedeiros.dev.br
35. HTTPS automático com Caddy
36. Testar tudo em produção

---

**VARIÁVEIS DE AMBIENTE**

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

# Azure AI Search (se usar)
AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_KEY=
AZURE_SEARCH_INDEX=viali-docs

# Resend (email)
RESEND_API_KEY=
EMAIL_TO=contato@vialicontabilidade.com.br
EMAIL_FROM=noreply@viali.vhmedeiros.dev.br

# URLs internas Docker
PYTHON_SERVICE_URL=http://python-service:8001
NODE_SERVICE_URL=http://node-service:3000

# Ambiente
NODE_ENV=production
DOMAIN=viali.vhmedeiros.dev.br
```

---

**CONTEXTO ADICIONAL**

- Tenho 2 anos de experiência, sou forte em Python/Django, mas estou aprendendo Node.js, Azure e LangChain (sempre que possível, usar analogias do django para explicar algum conceiro Node.js)
- Esse projeto precisa funcionar de verdade — é meu portfólio e prova prática para entrevista
- Prefiro soluções simples que eu consiga explicar do que soluções sofisticadas que não entendo
- Se houver duas formas de fazer algo, mostre a mais simples primeiro e mencione a mais robusta como evolução
- Sempre me diga os termos técnicos corretos — precisarei usá-los na entrevista com o CTO
- Comente o código em português para facilitar meu aprendizado

---
