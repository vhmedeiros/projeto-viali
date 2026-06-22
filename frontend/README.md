# Frontend — Viali Assessoria Contábil

Interface da landing page em **React 19 + Vite**, com **CSS Modules** para estilo
escopado e **Framer Motion** para animações. Consome a API do `backend-node`.

> Faz parte do monorepo da Viali. Veja o `README.md` da raiz para a visão geral
> e o deploy.

---

## Stack

| Item        | Tecnologia                          |
| ----------- | ----------------------------------- |
| Framework   | React 19                            |
| Build tool  | Vite                                |
| Estilo      | CSS Modules                         |
| Animações   | Framer Motion                       |
| Ícones      | react-icons, lucide-react           |

---

## Estrutura de pastas

```
frontend/src/
├── assets/                  # imagens (logo, hero, fotos da equipe)
│   └── images/
├── components/
│   ├── layout/              # Header (navbar fixa + glassmorphism ao scroll)
│   ├── sections/            # Hero, Services, About, ...
│   ├── ui/                  # Button, SectionTitle, ServiceCard (reutilizáveis)
│   └── chatbot/             # estrutura do chatbot flutuante
├── hooks/                   # ex.: useScrolled (estado de scroll)
├── services/                # api.js (camada de comunicação com o backend)
├── styles/                  # global.css (design tokens + reset)
├── utils/                   # formatters.js (máscaras, formatação)
├── App.jsx                  # composição das seções
└── main.jsx                 # ponto de entrada (monta o React no #root)
```

---

## Design System (`styles/global.css`)

Toda a identidade visual vive em **Design Tokens** (CSS Custom Properties) — mudar
um token propaga para o site inteiro (análogo a um `settings.py` do visual).

- **Paleta v2 (B2):** fundo creme/papel (`--color-bg`), tinta quase-preta
  (`--color-ink`) e azul executivo (`--color-accent`) como único acento.
- **Tipografia:** `DM Serif Display` (display, aplicada via classe `.display`) +
  `Inter` (corpo).
- **Movimento:** tokens `--duration-*` e `--ease-*` (ex.: `ease-out-expo`),
  alinhados ao Framer Motion.
- **Recuo lateral:** a margem do conteúdo é controlada por um `clamp(...)` único
  usado no Header e no Hero, mantendo logo e texto alinhados em qualquer largura.

---

## Rodando

### Via Docker (recomendado, junto do stack)

A partir da raiz do monorepo:

```bash
docker-compose up --build
# Frontend em http://localhost:5173
```

### Standalone (apenas o frontend)

```bash
cd frontend
npm install
npm run dev
```

---

## Variáveis de ambiente

| Variável        | Descrição                                   | Exemplo                    |
| --------------- | ------------------------------------------- | -------------------------- |
| `VITE_API_URL`  | URL base da API consumida pelo frontend     | dev: `http://localhost:3000` · prod: `/api` |

> **Importante:** variáveis `VITE_*` são injetadas em **tempo de build**, não de
> runtime. Em produção, `VITE_API_URL=/api` é passado como **build arg** no
> `Dockerfile.prod`, e o Caddy roteia `/api/*` para o backend.

---

## Build de produção

O `Dockerfile.prod` usa **multi-stage build**:

1. Etapa de build: `node` compila o React (`npm run build` → `dist/`).
2. Etapa de runtime: `nginx` serve os arquivos estáticos do `dist/`.

O `nginx.conf` aplica **SPA fallback** (`try_files $uri /index.html`), garantindo
que rotas do lado do cliente caiam sempre no `index.html`.

---

## Convenções e armadilhas

- **Assets devem ser importados, não referenciados por caminho literal.** Use
  `import hero from '../../assets/hero.png'` e `src={hero}`. Caminhos como
  `src="/src/assets/hero.png"` funcionam no dev server, mas **quebram no build**
  (a pasta `/src` não existe em produção — o Vite gera arquivos com hash em
  `dist/assets/`).
- **CSS Modules:** classes são escopadas automaticamente; edite o estilo de um
  componente no seu próprio `*.module.css`.
- **Animações de entrada:** preferir Framer Motion (`variants` + `whileInView`) a
  keyframes CSS, mantendo uma única fonte de verdade para o movimento.