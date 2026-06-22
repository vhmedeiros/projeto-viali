# ⚡ Viali Assessoria Contábil — Backend Node

> API de suporte em **Node.js** com **Express**, responsável por funcionalidades auxiliares como disparo de e-mails, integrações com serviços externos e endpoints leves. Roda em container **Docker** ao lado do backend principal (Django).

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Arquitetura](#-arquitetura)
- [Guia de Arquivos](#-guia-de-arquivos)
  - [Configuração e Build](#1-configuração-e-build)
  - [Ponto de Entrada](#2-ponto-de-entrada)
  - [Rotas](#3-rotas)
  - [Controllers](#4-controllers)
  - [Services](#5-services)
  - [Middlewares](#6-middlewares)
  - [Utils](#7-utils)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Endpoints da API](#-endpoints-da-api)
- [Como Rodar](#-como-rodar)
- [Comandos Úteis](#-comandos-úteis)

---

## 🎯 Visão Geral

Este backend Node.js é uma **API auxiliar** dentro da arquitetura multi-serviço da Viali. Ele **não substitui** o backend Django — complementa-o com responsabilidades específicas:

| Responsabilidade | Backend Django | Backend Node |
|-----------------|----------------|--------------|
| Autenticação / Usuários | ✅ | ❌ |
| CRUD de dados principais | ✅ | ❌ |
| Admin panel | ✅ | ❌ |
| Disparo de e-mails | ❌ | ✅ |
| Integrações leves (webhooks) | ❌ | ✅ |
| Endpoints de contato/formulário | ❌ | ✅ |
| Health check | ✅ | ✅ |

### Por que um backend Node separado?

- **Performance I/O**: Node.js é excelente para operações assíncronas (enviar e-mail, chamar APIs externas)
- **Simplicidade**: Express é minimalista — ideal para APIs leves sem ORM pesado
- **Separação de responsabilidades**: cada serviço faz o que faz de melhor
- **Escalabilidade independente**: pode escalar o Node sem mexer no Django

### Fluxo típico

```
Visitante preenche formulário no Frontend (React)
  → Frontend faz POST para o Backend Node (/api/contact)
    → Node valida os dados
      → Node dispara e-mail via serviço de e-mail
        → Node retorna resposta ao Frontend
```

---

## 🛠 Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 20.x (Alpine) | Runtime JavaScript no servidor |
| **Express** | 4.x | Framework web minimalista para APIs |
| **Nodemailer** | 6.x | Envio de e-mails (SMTP) |
| **cors** | 2.x | Middleware para Cross-Origin Resource Sharing |
| **dotenv** | 16.x | Carrega variáveis de ambiente de `.env` |
| **Docker** | — | Containerização para ambiente consistente |

### Por que essas escolhas?

- **Express** → Padrão da indústria para APIs Node, leve (~2MB), vasta documentação
- **Nodemailer** → Biblioteca mais madura para e-mail em Node (15+ anos, 10M+ downloads/semana)
- **cors** → Necessário para o frontend (porta 5173) se comunicar com a API (porta 3000)
- **dotenv** → Credenciais sensíveis fora do código (e-mail, senhas SMTP)

---

## 📁 Estrutura de Pastas

```
backend-node/
├── Dockerfile                    # Imagem Docker do backend Node
├── package.json                  # Dependências e scripts npm
├── .env                          # Variáveis de ambiente (NÃO vai pro Git)
├── .env.example                  # Modelo de variáveis (vai pro Git)
├── README.md                     # 📌 Este arquivo
│
└── src/
    ├── server.js                 # Ponto de entrada — inicia o Express
    │
    ├── routes/
    │   ├── index.js              # Agregador de rotas (router principal)
    │   ├── healthRoutes.js       # Rota GET /api/health
    │   └── contactRoutes.js      # Rota POST /api/contact
    │
    ├── controllers/
    │   ├── healthController.js   # Lógica do health check
    │   └── contactController.js  # Lógica do formulário de contato
    │
    ├── services/
    │   └── emailService.js       # Envio de e-mails via Nodemailer
    │
    ├── middlewares/
    │   └── errorHandler.js       # Middleware global de tratamento de erros
    │
    └── utils/
        └── logger.js             # Utilitário de log formatado com timestamp
```

### Convenção de Nomes

| Padrão | Exemplo | Motivo |
|--------|---------|--------|
| camelCase para arquivos | `emailService.js` | Padrão Node.js/Express |
| camelCase para variáveis | `sendEmail`, `contactData` | Padrão JavaScript |
| UPPER_CASE para env vars | `SMTP_HOST`, `PORT` | Convenção universal de variáveis de ambiente |
| Sufixo por responsabilidade | `*Routes`, `*Controller`, `*Service` | Identifica o papel do arquivo imediatamente |

---

## 🏗 Arquitetura

O projeto segue o padrão **MVC simplificado** (sem o "V" de View, pois é uma API):

```
Request HTTP
  │
  ▼
┌──────────────┐
│   server.js  │  ← Configura Express, middlewares globais, inicia servidor
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   routes/    │  ← Define QUAIS endpoints existem e QUAL método HTTP
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ controllers/ │  ← Recebe o request, valida dados, chama services, retorna response
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  services/   │  ← Lógica de negócio pura (enviar e-mail, integrar API externa)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   utils/     │  ← Funções auxiliares (logger, formatação)
└──────────────┘
```

### Analogia com Django

| Conceito Express | Equivalente Django | Função |
|-----------------|-------------------|--------|
| `server.js` | `manage.py` + `settings.py` | Inicia o app, configura middlewares |
| `routes/` | `urls.py` | Mapeia URLs para funções |
| `controllers/` | `views.py` | Recebe request, retorna response |
| `services/` | `services.py` / utils | Lógica de negócio isolada |
| `middlewares/` | `middleware.py` | Intercepta request/response |
| `utils/` | `utils.py` | Funções auxiliares reutilizáveis |

---

## 📖 Guia de Arquivos

### 1. Configuração e Build

#### `Dockerfile`
```
Propósito: Define a imagem Docker do backend Node
```

- Usa `node:20-alpine` como base (imagem leve ~50MB)
- Define `/app` como diretório de trabalho
- Copia `package.json` e `package-lock.json` primeiro (otimiza cache de camadas Docker)
- Executa `npm install` para instalar dependências
- Copia o restante do código-fonte
- Expõe porta `3000` (padrão da API)
- Comando de entrada: `node src/server.js`

**Por que Alpine?** Imagem Linux mínima (~5MB vs ~900MB do Ubuntu). Ideal para containers de produção.

**Por que copiar package.json primeiro?** Se o código mudar mas as dependências não, o Docker reutiliza o cache da camada `npm install`, acelerando o build.

---

#### `package.json`
```
Propósito: Manifesto do projeto — dependências e scripts
```

| Campo | Função |
|-------|--------|
| `name` | `viali-backend-node` — identificador do projeto |
| `main` | `src/server.js` — ponto de entrada |
| `scripts.start` | `node src/server.js` — inicia em produção |
| `scripts.dev` | `node --watch src/server.js` — inicia com auto-reload (Node 20+) |
| `dependencies` | Pacotes de runtime (express, nodemailer, cors, dotenv) |

**Nota sobre `--watch`**: A partir do Node 18.11+, o flag `--watch` substitui o `nodemon` para desenvolvimento — reinicia o servidor automaticamente quando arquivos mudam.

---

#### `.env` / `.env.example`
```
Propósito: Variáveis de ambiente sensíveis (credenciais)
```

O `.env` contém valores reais (senhas SMTP, etc.) e **nunca vai para o Git**.
O `.env.example` é um modelo com valores fictícios que **vai para o Git**, servindo de referência.

---

### 2. Ponto de Entrada

#### `src/server.js`
```
Propósito: Inicializa o Express, configura middlewares e sobe o servidor
```

**O que faz, passo a passo:**

1. **Carrega variáveis de ambiente** com `dotenv.config()`
2. **Cria a instância Express** com `express()`
3. **Registra middlewares globais** (na ordem):
   - `cors()` — permite requests do frontend (porta diferente)
   - `express.json()` — parseia body JSON automaticamente
4. **Monta as rotas** com `app.use('/api', routes)`
5. **Registra o error handler** (deve ser o último middleware)
6. **Inicia o servidor** com `app.listen(PORT)` e loga a URL

**Conceitos importantes:**

- **Middleware**: função que intercepta o request antes de chegar na rota. Como um "filtro" em cadeia.
- **Ordem importa**: middlewares são executados na ordem em que são registrados. O `cors()` precisa vir antes das rotas; o `errorHandler` precisa vir depois.

**Analogia Django:**
```python
# Django equivalente:
# dotenv.config()        → django-environ / os.environ
# express()              → get_wsgi_application()
# cors()                 → django-cors-headers middleware
# express.json()         → DRF parsers (JSONParser)
# app.use('/api', routes)→ path('api/', include('app.urls'))
# app.listen(PORT)       → python manage.py runserver PORT
```

---

### 3. Rotas

#### `src/routes/index.js`
```
Propósito: Agregador central de rotas — importa e monta todas as sub-rotas
```

```js
// Estrutura:
router.use('/health', healthRoutes);   // → /api/health
router.use('/contact', contactRoutes); // → /api/contact
```

**Por que um agregador?**
Mantém o `server.js` limpo. Em vez de registrar 10 rotas no server, registra uma única (`/api`) que internamente distribui para sub-routers.

**Analogia Django:**
```python
# urls.py raiz:
urlpatterns = [
    path('api/health/', include('health.urls')),
    path('api/contact/', include('contact.urls')),
]
```

---

#### `src/routes/healthRoutes.js`
```
Propósito: Rota de verificação de saúde do serviço
Endpoint: GET /api/health
```

Define um `Router()` com uma única rota `GET /` que delega para `healthController.check`.

**Para que serve health check?**
- **Docker**: `docker compose` pode usar para saber se o container está saudável
- **Load Balancer**: verifica se a instância pode receber tráfego
- **Monitoramento**: ferramentas como UptimeRobot pingam essa rota periodicamente

---

#### `src/routes/contactRoutes.js`
```
Propósito: Rota para recebimento de formulário de contato
Endpoint: POST /api/contact
```

Define um `Router()` com uma única rota `POST /` que delega para `contactController.send`.

**Apenas define a rota** — toda a lógica está no controller.

---

### 4. Controllers

#### `src/controllers/healthController.js`
```
Propósito: Retorna o status de saúde do serviço
```

**Resposta:**
```json
{
  "status": "ok",
  "service": "viali-backend-node",
  "timestamp": "2026-06-17T22:30:00.000Z"
}
```

| Campo | Função |
|-------|--------|
| `status` | `"ok"` indica que o serviço está rodando |
| `service` | Identifica qual serviço respondeu (útil em arquitetura com vários backends) |
| `timestamp` | Data/hora da resposta (debug e monitoramento) |

**Analogia Django:**
```python
# views.py
def health_check(request):
    return JsonResponse({"status": "ok", "service": "viali-backend-django"})
```

---

#### `src/controllers/contactController.js`
```
Propósito: Recebe dados do formulário, valida e dispara e-mail
```

**Fluxo interno:**

```
1. Recebe req.body com { name, email, phone, message }
     │
2. Valida campos obrigatórios (name, email, message)
     │  → Se inválido: retorna 400 com erro
     │
3. Chama emailService.sendContactEmail(data)
     │  → Se falhar: retorna 500 com erro
     │
4. Retorna 200 com mensagem de sucesso
```

**Validação:**
- `name` — obrigatório, não pode ser vazio
- `email` — obrigatório, não pode ser vazio
- `phone` — opcional
- `message` — obrigatório, não pode ser vazio

**Tratamento de erros:**
- Usa `try/catch` para capturar falhas no envio de e-mail
- Loga o erro com o `logger` utilitário
- Retorna resposta genérica ao cliente (não expõe detalhes internos)

**Analogia Django:**
```python
# views.py
class ContactView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        send_contact_email(serializer.validated_data)
        return Response({"message": "Enviado com sucesso"})
```

---

### 5. Services

#### `src/services/emailService.js`
```
Propósito: Envia e-mails via SMTP usando Nodemailer
```

**Responsabilidades:**
1. Cria um **transporter** Nodemailer configurado com variáveis de ambiente
2. Expõe função `sendContactEmail(data)` que monta e dispara o e-mail
3. Formata o corpo do e-mail em HTML com os dados do formulário

**Configuração do Transporter:**

| Variável | Função |
|----------|--------|
| `SMTP_HOST` | Servidor SMTP (ex: `smtp.gmail.com`) |
| `SMTP_PORT` | Porta SMTP (ex: `587` para TLS) |
| `SMTP_USER` | E-mail de autenticação |
| `SMTP_PASS` | Senha ou App Password |
| `SMTP_FROM` | Endereço remetente ("De:") |
| `SMTP_TO` | Endereço destinatário ("Para:") |

**Template do E-mail:**
```
Assunto: [Viali Site] Nova mensagem de {nome}

Corpo HTML:
- Nome do contato
- E-mail do contato
- Telefone (se fornecido)
- Mensagem completa
- Data/hora do envio
```

**Por que um Service separado do Controller?**
- **Responsabilidade única**: controller lida com HTTP, service lida com e-mail
- **Testabilidade**: pode testar o envio de e-mail isoladamente
- **Reutilização**: outros controllers podem usar o mesmo service

**Analogia Django:**
```python
# services/email_service.py
from django.core.mail import send_mail

def send_contact_email(data):
    send_mail(
        subject=f"[Viali Site] Mensagem de {data['name']}",
        message=data['message'],
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.CONTACT_EMAIL],
    )
```

---

### 6. Middlewares

#### `src/middlewares/errorHandler.js`
```
Propósito: Captura erros não tratados e retorna resposta padronizada
```

**Como funciona:**
- Express identifica middlewares de erro pela **assinatura com 4 parâmetros**: `(err, req, res, next)`
- Qualquer `throw` ou `next(err)` em rotas/controllers cai aqui
- Loga o erro completo no servidor (para debug)
- Retorna ao cliente uma resposta JSON genérica (sem expor stack trace)

**Resposta de erro:**
```json
{
  "error": "Erro interno do servidor"
}
```

**Status code:** Usa `err.status` se definido, senão `500`.

**Por que não expor detalhes do erro?**
Em produção, mostrar stack traces é uma **vulnerabilidade de segurança** — revela estrutura interna do código, caminhos de arquivos, versões de bibliotecas. O erro completo fica apenas nos logs do servidor.

**Analogia Django:**
```python
# middleware.py
class ErrorHandlerMiddleware:
    def process_exception(self, request, exception):
        logger.error(str(exception))
        return JsonResponse({"error": "Erro interno"}, status=500)
```

---

### 7. Utils

#### `src/utils/logger.js`
```
Propósito: Funções de log padronizadas com timestamp e prefixo colorido
```

**Funções exportadas:**

| Função | Prefixo | Cor | Uso |
|--------|---------|-----|-----|
| `logger.info(msg)` | `[INFO]` | 🔵 Azul/Ciano | Eventos normais (servidor iniciou, e-mail enviado) |
| `logger.warn(msg)` | `[WARN]` | 🟡 Amarelo | Situações inesperadas não-críticas |
| `logger.error(msg)` | `[ERROR]` | 🔴 Vermelho | Erros que precisam de atenção |

**Formato de saída:**
```
[2026-06-17T22:30:00.000Z] [INFO] Servidor rodando em http://localhost:3000
[2026-06-17T22:30:05.123Z] [ERROR] Falha ao enviar e-mail: Connection refused
```

**Por que um logger customizado?**
- `console.log()` não inclui timestamp nem categorização
- Em produção, logs precisam de data/hora para debug
- Preparado para substituir por Winston/Pino no futuro sem mudar chamadas

---

## 🔐 Variáveis de Ambiente

### Arquivo `.env.example`

```env
# Servidor
PORT=3000
NODE_ENV=development

# SMTP — Configuração de e-mail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com
SMTP_TO=contato@viali.com.br
```

### Descrição de cada variável

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `PORT` | Não (default: 3000) | Porta em que o servidor Express escuta |
| `NODE_ENV` | Não (default: development) | Ambiente de execução (`development` / `production`) |
| `SMTP_HOST` | Sim | Endereço do servidor SMTP |
| `SMTP_PORT` | Sim | Porta do servidor SMTP (587=TLS, 465=SSL) |
| `SMTP_USER` | Sim | Usuário de autenticação SMTP |
| `SMTP_PASS` | Sim | Senha ou App Password do SMTP |
| `SMTP_FROM` | Sim | E-mail remetente (campo "De:") |
| `SMTP_TO` | Sim | E-mail destinatário (quem recebe as mensagens do site) |

### Configurar Gmail como SMTP

1. Ative a **verificação em 2 etapas** na conta Google
2. Acesse [Senhas de App](https://myaccount.google.com/apppasswords)
3. Gere uma senha para "Outro (nome personalizado)" → "Viali Site"
4. Use essa senha de 16 caracteres no `SMTP_PASS`

---

## 🌐 Endpoints da API

### `GET /api/health`

**Verificação de saúde do serviço.**

| Item | Valor |
|------|-------|
| Método | `GET` |
| URL | `http://localhost:3000/api/health` |
| Auth | Nenhuma |
| Body | Nenhum |

**Response 200:**
```json
{
  "status": "ok",
  "service": "viali-backend-node",
  "timestamp": "2026-06-17T22:30:00.000Z"
}
```

**Teste com cURL:**
```bash
curl http://localhost:3000/api/health
```

---

### `POST /api/contact`

**Recebe dados do formulário de contato e dispara e-mail.**

| Item | Valor |
|------|-------|
| Método | `POST` |
| URL | `http://localhost:3000/api/contact` |
| Auth | Nenhuma |
| Content-Type | `application/json` |

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com",
  "phone": "(61) 99999-9999",
  "message": "Gostaria de abrir minha empresa. Podem me ajudar?"
}
```

| Campo | Tipo | Obrigatório | Validação |
|-------|------|-------------|-----------|
| `name` | string | ✅ Sim | Não pode ser vazio |
| `email` | string | ✅ Sim | Não pode ser vazio |
| `phone` | string | ❌ Não | — |
| `message` | string | ✅ Sim | Não pode ser vazio |

**Response 200 (sucesso):**
```json
{
  "message": "Mensagem enviada com sucesso"
}
```

**Response 400 (validação):**
```json
{
  "error": "Os campos name, email e message são obrigatórios"
}
```

**Response 500 (erro interno):**
```json
{
  "error": "Erro ao enviar mensagem. Tente novamente mais tarde."
}
```

**Teste com cURL:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Victor",
    "email": "victor@teste.com",
    "phone": "(61) 91234-5678",
    "message": "Quero abrir minha empresa!"
  }'
```

---

## 🚀 Como Rodar

### Com Docker (Recomendado)

```powershell
# Na raiz do projeto (onde está o docker-compose.yml)
docker compose up -d --build backend-node

# Verificar se está rodando
curl http://localhost:3000/api/health
```

### Sem Docker (Desenvolvimento Local)

```powershell
# Entrar na pasta do backend-node
cd backend-node

# Instalar dependências
npm install

# Criar arquivo .env a partir do exemplo
cp .env.example .env
# (editar .env com suas credenciais SMTP)

# Iniciar em modo desenvolvimento (auto-reload)
npm run dev

# Ou iniciar em modo produção
npm start
```

---

## 🔧 Comandos Úteis

```powershell
# Ver logs do container backend-node
docker compose logs -f backend-node

# Reiniciar apenas o backend-node
docker compose restart backend-node

# Reconstruir após mudanças no Dockerfile ou package.json
docker compose up -d --build backend-node

# Acessar o terminal dentro do container
docker compose exec backend-node sh

# Instalar nova dependência (com Docker)
docker compose exec backend-node npm install nome-do-pacote

# Instalar nova dependência (sem Docker)
cd backend-node && npm install nome-do-pacote

# Testar health check
curl http://localhost:3000/api/health

# Testar envio de contato
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@x.com","message":"Olá!"}'

# Parar todos os serviços
docker compose down
```

---

## 🗺 Próximas Etapas

- [ ] **Validação avançada** — Regex de e-mail, sanitização de HTML (XSS)
- [ ] **Rate limiting** — Limitar requests por IP (evitar spam no formulário)
- [ ] **Helmet.js** — Headers de segurança HTTP
- [ ] **Testes** — Jest/Vitest para unit tests dos services e controllers
- [ ] **Templates de e-mail** — HTML responsivo com logo da Viali
- [ ] **Fila de e-mails** — Bull/BullMQ para retry automático em caso de falha
- [ ] **Logs em arquivo** — Winston com rotação de logs
- [ ] **Swagger/OpenAPI** — Documentação interativa dos endpoints
- [ ] **CI/CD** — GitHub Actions para lint + test + deploy

---

## 📝 Padrões do Projeto

### Regras de Código

1. **Separação por camada** — Rotas não contêm lógica; Controllers não enviam e-mail; Services não lidam com HTTP
2. **Um arquivo, uma responsabilidade** — cada arquivo faz UMA coisa
3. **Erros nunca expostos ao cliente** — stack traces ficam nos logs do servidor
4. **Variáveis sensíveis no `.env`** — nunca hardcoded no código
5. **Respostas padronizadas** — sempre JSON, sempre com campo `message` ou `error`

### Estrutura de um Controller

```js
// 1. Importa services e utils necessários
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

// 2. Exporta objeto com métodos nomeados
module.exports = {
  async send(req, res, next) {
    try {
      // 3. Extrai dados do request
      const { name, email, message } = req.body;

      // 4. Valida
      if (!name || !email || !message) {
        return res.status(400).json({ error: '...' });
      }

      // 5. Chama o service
      await emailService.sendContactEmail({ name, email, message });

      // 6. Retorna sucesso
      return res.status(200).json({ message: 'Sucesso' });

    } catch (err) {
      // 7. Delega erro para o error handler
      next(err);
    }
  }
};
```

### Estrutura de uma Rota

```js
// 1. Importa Router do Express
const { Router } = require('express');
const router = Router();

// 2. Importa o controller
const controller = require('../controllers/nomeController');

// 3. Define a rota com método HTTP + handler
router.post('/', controller.metodo);

// 4. Exporta o router
module.exports = router;
```

### Fluxo completo de um Request

```
Cliente (Browser/Frontend)
  │
  │  POST /api/contact  { name, email, message }
  ▼
┌─────────────────────────────────────────────────────┐
│  server.js                                          │
│  ├─ cors()             → Verifica origem permitida  │
│  ├─ express.json()     → Parseia body JSON          │
│  └─ routes             → Encaminha para sub-router  │
│       │                                             │
│       ▼                                             │
│  routes/contactRoutes.js                            │
│  └─ POST /             → Chama contactController    │
│       │                                             │
│       ▼                                             │
│  controllers/contactController.js                   │
│  ├─ Valida campos      → 400 se inválido            │
│  ├─ Chama emailService → Envia e-mail               │
│  └─ Retorna 200        → { message: "Sucesso" }     │
│       │                                             │
│       ▼ (se erro)                                   │
│  middlewares/errorHandler.js                        │
│  ├─ Loga erro completo                              │
│  └─ Retorna 500        → { error: "Erro interno" } │
└─────────────────────────────────────────────────────┘
  │
  ▼
Cliente recebe a resposta JSON
```

---

## 🔒 Segurança

### Implementado

| Medida | Como |
|--------|------|
| **CORS** | Apenas origens permitidas podem fazer requests |
| **Variáveis de ambiente** | Credenciais fora do código-fonte |
| **Error sanitization** | Stack traces nunca expostos ao cliente |
| **JSON parsing** | Express parseia e valida o formato do body |

### Planejado (próximas etapas)

| Medida | Ferramenta |
|--------|------------|
| **Rate limiting** | `express-rate-limit` — limita requests por IP |
| **Security headers** | `helmet` — configura headers HTTP seguros |
| **Input sanitization** | `express-validator` — previne XSS e injection |
| **HTTPS** | Nginx reverse proxy com certificado SSL |

---

> **Desenvolvido com ⚡ para a Viali Assessoria Contábil**
> *Backend Node.js + Express | API REST | Docker containerizado*






































# Backend Node — API Gateway (Viali)

Serviço em **Node.js 20 + Express** que atua como **API Gateway / BFF (Backend For
Frontend)**: é a única porta de entrada do frontend. Ele valida requisições,
orquestra o serviço de IA (Python), consulta APIs externas, persiste dados no
Cosmos DB e dispara e-mails.

> Faz parte do monorepo da Viali. Veja o `README.md` da raiz para a visão geral.

---

## Stack

| Item            | Tecnologia            |
| --------------- | --------------------- |
| Runtime         | Node.js 20            |
| Framework       | Express               |
| HTTP client     | axios                 |
| IDs             | uuid                  |
| CORS            | cors                  |

---

## Estrutura

```
backend-node/src/
├── index.js              # bootstrap do Express (middlewares + rotas + handlers)
├── routes/
│   ├── health.js         # GET  /api/health
│   ├── chat.js           # POST /api/chat
│   ├── contato.js        # POST /api/contato
│   ├── cnpj.js           # GET  /api/cnpj/:cnpj
│   └── cep.js            # GET  /api/cep/:cep
├── services/
│   ├── cosmosdb.js       # persistência (conversas e leads)
│   └── email.js          # envio via Resend
└── config/
    └── features.js       # feature flags (ex.: chatbot on/off)
```

> Em Express, um `Router` é um mini-app isolado para um grupo de rotas — análogo
> ao `include()` no `urls.py` do Django.

---

## Rotas

| Método | Rota               | Descrição                                                       |
| ------ | ------------------ | --------------------------------------------------------------- |
| GET    | `/api/health`      | Health check (status, ambiente, uptime, feature flags)          |
| POST   | `/api/chat`        | Recebe a pergunta, encaminha ao Python, salva a conversa        |
| POST   | `/api/contato`     | Valida e salva o lead, dispara e-mails (notificação + confirmação) |
| GET    | `/api/cnpj/:cnpj`  | Consulta dados de empresa em `publica.cnpj.ws`                  |
| GET    | `/api/cep/:cep`    | Consulta endereço na ViaCEP                                     |

### Exemplos

```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/cnpj/00000000000191
curl http://localhost:3000/api/cep/70610410
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"pergunta": "Como abrir uma empresa em Brasília?"}'
```

---

## Rodando

### Via Docker (junto do stack, a partir da raiz)

```bash
docker-compose up --build
# API em http://localhost:3000
```

### Standalone

```bash
cd backend-node
npm install
npm run dev   # nodemon
```

---

## Variáveis de ambiente relevantes

| Variável                     | Descrição                                      |
| ---------------------------- | ---------------------------------------------- |
| `PORT`                       | Porta do servidor (padrão 3000)                |
| `NODE_ENV`                   | `development` / `production`                   |
| `PYTHON_SERVICE_URL`         | URL interna do serviço de IA                   |
| `COSMOS_DB_*`                | Credenciais e nomes de containers do Cosmos DB |
| `RESEND_API_KEY`             | Chave da API do Resend                         |
| `EMAIL_TO` / `EMAIL_FROM`    | Destinatário e remetente dos e-mails           |
| `CHATBOT_ENABLED`            | Feature flag do chatbot                        |

---

## Padrões técnicos aplicados

- **API Gateway / BFF** — ponto único de entrada; o frontend nunca fala direto
  com o Python nem com APIs externas.
- **API Proxy** — CNPJ e CEP são consultados pelo backend (inclui headers de
  navegador para passar pelo Cloudflare na API de CNPJ).
- **DTO / Response Shaping** — respostas externas são remodeladas para um formato
  estável (isola o frontend de mudanças das APIs).
- **Input sanitization & validation** — limpeza (regex) e validação de CNPJ, CEP,
  e-mail e campos do formulário antes de processar.
- **Fire-and-forget** — a conversa é salva no Cosmos em paralelo, sem atrasar a
  resposta ao usuário.
- **Tratamento de erros granular** — distingue timeout, conexão recusada, rate
  limit (429), 403 do Cloudflare, etc., devolvendo o status HTTP adequado.
- **Feature flags** — liga/desliga funcionalidades por variável de ambiente.

> Analogias com Django: as `routes` equivalem a *views*; `services` a funções de
> domínio; o error handler global a um middleware de exception handling.