# 🏢 Viali Assessoria Contábil — Frontend

> Interface web moderna da Viali Assessoria Contábil, construída com **React 18** + **Vite**, rodando em container **Docker**.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias](#-tecnologias)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Arquitetura CSS](#-arquitetura-css)
- [Guia de Arquivos](#-guia-de-arquivos)
  - [Configuração e Build](#1-configuração-e-build)
  - [Estilos Globais](#2-estilos-globais)
  - [Ponto de Entrada](#3-ponto-de-entrada)
  - [Componente Raiz](#4-componente-raiz)
  - [Componentes de Layout](#5-componentes-de-layout)
  - [Componentes de Seção](#6-componentes-de-seção)
  - [Componentes de UI](#7-componentes-de-ui-reutilizáveis)
- [Design System](#-design-system)
- [Responsividade](#-responsividade)
- [Como Rodar](#-como-rodar)
- [Comandos Úteis](#-comandos-úteis)

---

## 🎯 Visão Geral

Este frontend é uma **landing page profissional** para um escritório de contabilidade localizado em Brasília-DF. O site foi pensado para:

- **Transmitir credibilidade** através de design limpo e profissional
- **Converter visitantes em leads** com CTAs estratégicos (WhatsApp, formulário)
- **Carregar rápido** com Vite (build otimizado) e CSS leve (sem frameworks pesados)
- **Funcionar em qualquer dispositivo** com abordagem mobile-first

### Fluxo do Usuário

```
Página carrega
  → Hero com proposta de valor + CTA
    → Seção Serviços (o que a empresa faz)
      → Seção Sobre (quem é a empresa)
        → Seção Contato (conversão final)
```

---

## 🛠 Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **React** | 18.x | Biblioteca para construção de UI com componentes |
| **Vite** | 5.x | Bundler ultrarrápido (substitui Webpack/CRA) |
| **CSS Modules** | nativo | Escopo local de estilos (evita conflitos) |
| **React Icons** | 5.x | Biblioteca de ícones (FontAwesome, etc.) |
| **Docker** | — | Containerização para ambiente consistente |
| **Node** | 20-alpine | Runtime JavaScript para build e dev server |

### Por que essas escolhas?

- **React** → Componentização, ecossistema gigante, padrão de mercado
- **Vite** → HMR instantâneo, build 10-100x mais rápido que CRA
- **CSS Modules** → Escopo automático, sem conflito de classes, zero config no Vite
- **Sem Tailwind/Bootstrap** → CSS puro para aprendizado real + controle total
- **Docker** → Mesmo ambiente em qualquer máquina, pronto para deploy

---

## 📁 Estrutura de Pastas

```
frontend/
├── Dockerfile                    # Imagem Docker do frontend
├── package.json                  # Dependências e scripts npm
├── vite.config.js                # Configurações do Vite (bundler)
├── index.html                    # HTML raiz (entry point do Vite)
├── README.md                     # 📌 Este arquivo
│
└── src/
    ├── main.jsx                  # Ponto de entrada React (monta a árvore)
    ├── App.jsx                   # Componente raiz (orquestra tudo)
    │
    ├── styles/
    │   ├── variables.css         # Design tokens (cores, fontes, espaçamentos)
    │   ├── reset.css             # Reset CSS (normaliza entre navegadores)
    │   └── global.css            # Estilos globais e classes utilitárias
    │
    ├── components/
    │   ├── layout/               # Componentes estruturais (aparecem em todas as páginas)
    │   │   ├── Header.jsx        # Barra de navegação fixa
    │   │   └── Header.module.css
    │   │
    │   ├── sections/             # Seções da landing page (ordem de aparição)
    │   │   ├── Hero.jsx          # Banner principal com CTA
    │   │   ├── Hero.module.css
    │   │   ├── Services.jsx      # Grid de serviços oferecidos
    │   │   ├── Services.module.css
    │   │   ├── About.jsx         # Sobre a empresa + card visual
    │   │   └── About.module.css
    │   │
    │   └── ui/                   # Componentes reutilizáveis (building blocks)
    │       ├── SectionTitle.jsx  # Título padronizado de seção
    │       ├── SectionTitle.module.css
    │       ├── ServiceCard.jsx   # Card individual de serviço
    │       └── ServiceCard.module.css
    │
    └── assets/                   # Imagens, SVGs, fontes (futuro)
```

### Convenção de Nomes

| Padrão | Exemplo | Motivo |
|--------|---------|--------|
| PascalCase para componentes | `ServiceCard.jsx` | Padrão React — diferencia de funções comuns |
| `NomeDoComponente.module.css` | `Header.module.css` | CSS Module vinculado ao componente de mesmo nome |
| camelCase para variáveis/funções | `navLinks`, `handleClick` | Padrão JavaScript |
| UPPER_CASE para constantes | `SERVICES`, `VALUES` | Destaca dados estáticos que não mudam |
| kebab-case para CSS | `.hero-overlay`, `--color-primary` | Padrão CSS universal |

---

## 🎨 Arquitetura CSS

O projeto usa uma arquitetura em **3 camadas**, carregadas nesta ordem:

```
1. variables.css  →  Design Tokens (variáveis CSS custom properties)
2. reset.css      →  Reset/Normalização (base consistente)
3. global.css     →  Estilos globais + utilitários
4. *.module.css   →  Estilos por componente (escopo local)
```

### Por que CSS Modules?

```jsx
// Sem CSS Modules (PROBLEMA: conflito global)
<div className="card">  // qualquer .card no projeto conflita

// Com CSS Modules (SOLUÇÃO: escopo local)
<div className={styles.card}>  // vira .card_abc123 (hash único)
```

O Vite transforma automaticamente cada classe em um hash único no build,
garantindo que `.card` do `ServiceCard` nunca conflite com `.card` de outro componente.

### Variáveis CSS (Design Tokens)

Todas as cores, fontes, espaçamentos e sombras são definidos como variáveis CSS em `variables.css`. Isso permite:

- **Consistência**: mesma cor em todo o projeto
- **Manutenção**: trocar uma cor em 1 lugar, reflete em tudo
- **Tema**: preparado para dark mode (basta sobrescrever variáveis)

---

## 📖 Guia de Arquivos

### 1. Configuração e Build

#### `Dockerfile`
```
Propósito: Define a imagem Docker do frontend
```

- Usa `node:20-alpine` como base (imagem leve ~50MB)
- Define `/app` como diretório de trabalho
- Copia `package.json` e instala dependências (`npm install`)
- Copia o código-fonte
- Expõe porta `5173` (padrão Vite)
- Roda `npm run dev` com flag `--host` (acessível fora do container)

**Analogia Django**: É como o `requirements.txt` + configuração do servidor WSGI, mas para o frontend.

---

#### `package.json`
```
Propósito: Manifesto do projeto — dependências e scripts
```

| Campo | Função |
|-------|--------|
| `name` | Identificador do projeto |
| `scripts.dev` | Inicia servidor de desenvolvimento (`vite`) |
| `scripts.build` | Gera build de produção (`vite build`) |
| `dependencies` | Pacotes usados em runtime (React, React-DOM, React Icons) |
| `devDependencies` | Pacotes usados só em desenvolvimento (Vite, plugin React) |

**Analogia Django**: Equivale ao `requirements.txt` (dependências) + `manage.py` (scripts).

---

#### `vite.config.js`
```
Propósito: Configurações do bundler Vite
```

- Registra o plugin `@vitejs/plugin-react` (habilita JSX, Fast Refresh)
- Configura `server.host: true` para o Vite aceitar conexões externas (necessário dentro do Docker)
- Configura `server.watch.usePolling: true` para HMR funcionar dentro do container Docker (o filesystem do Docker não emite eventos nativos de mudança de arquivo)

**Analogia Django**: Como o `settings.py` — configura o comportamento do "servidor" de desenvolvimento.

---

#### `index.html`
```
Propósito: Página HTML raiz — entry point do Vite
```

- Único arquivo HTML do projeto (SPA = Single Page Application)
- Contém a `<div id="root">` onde o React monta toda a interface
- Importa o Google Fonts (Poppins + Inter) via `<link>`
- Referencia `src/main.jsx` como módulo ES (`type="module"`)
- Define metatags de SEO, charset, viewport

**Diferença do Django**: No Django, cada URL tem um template HTML. No React SPA, existe **um único HTML** e o JavaScript controla tudo.

---

### 2. Estilos Globais

#### `src/styles/variables.css`
```
Propósito: Design Tokens — todas as variáveis visuais do projeto
```

Define no `:root` (escopo global) as **custom properties** CSS:

| Grupo | Exemplos | Função |
|-------|----------|--------|
| **Cores primárias** | `--color-primary`, `--color-primary-dark` | Azul escuro institucional |
| **Cores de acento** | `--color-accent`, `--color-accent-dark` | Dourado/âmbar para destaques e CTAs |
| **Cores neutras** | `--color-gray-100` a `--color-gray-800` | Escala de cinzas para textos e fundos |
| **Fontes** | `--font-heading`, `--font-body` | Poppins (títulos) + Inter (corpo) |
| **Tamanhos de texto** | `--text-xs` a `--text-5xl` | Escala tipográfica consistente |
| **Espaçamentos** | `--space-1` a `--space-20` | Escala de 4px (0.25rem) a 80px (5rem) |
| **Bordas** | `--radius-sm` a `--radius-full` | Border-radius padronizados |
| **Sombras** | `--shadow-sm` a `--shadow-xl` | Elevação visual com box-shadow |
| **Transições** | `--transition-fast`, `--transition-normal` | Duração padrão de animações |

**Por que isso importa**: Sem variáveis, você teria cores "hardcoded" espalhadas por 20+ arquivos. Mudar o azul do site significaria editar dezenas de lugares. Com tokens, muda em **1 linha**.

---

#### `src/styles/reset.css`
```
Propósito: Normalizar estilos padrão dos navegadores
```

Cada navegador (Chrome, Firefox, Safari) tem estilos **default diferentes** para tags HTML. O reset garante uma **base consistente**:

- Remove `margin` e `padding` de todos os elementos (`*`)
- Aplica `box-sizing: border-box` (largura inclui padding e border)
- Define `scroll-behavior: smooth` (rolagem suave ao clicar em âncoras)
- Remove decoração de links (`text-decoration: none`)
- Remove estilo de lista (`list-style: none`)
- Faz imagens serem responsivas por padrão (`max-width: 100%`)
- Define `font-family`, `color` e `background` base no `body`
- Aplica anti-aliasing no texto (`-webkit-font-smoothing`)

**Analogia Django**: Como um middleware que padroniza o request antes de chegar na view.

---

#### `src/styles/global.css`
```
Propósito: Estilos globais e classes utilitárias reutilizáveis
```

Importa `variables.css` e `reset.css` (ordem importa!) e define:

| Classe | Função |
|--------|--------|
| `.container` | Centraliza conteúdo com `max-width: 1200px` + padding lateral |
| `.section` | Padding vertical padrão para todas as seções |
| `.section--dark` | Variante com fundo azul escuro + texto claro |
| `.section--gray` | Variante com fundo cinza claro |
| `.btn` | Estilo base de botão (padding, border-radius, transição) |
| `.btn--primary` | Botão azul com hover escurecido |
| `.btn--accent` | Botão dourado com hover mais escuro |
| `.btn--outline` | Botão transparente com borda branca |

**Analogia Django**: Como template tags ou `base.html` — estilos compartilhados que qualquer componente pode usar.

---

### 3. Ponto de Entrada

#### `src/main.jsx`
```
Propósito: Inicializa o React e monta a árvore de componentes no DOM
```

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**O que faz, passo a passo:**
1. Busca a `<div id="root">` no `index.html`
2. Cria uma "raiz React" nesse elemento
3. Renderiza `<App />` dentro dela
4. `<StrictMode>` ativa verificações extras em desenvolvimento (detecta bugs, efeitos duplicados, APIs deprecadas)
5. Importa `global.css` para que os estilos globais sejam carregados

**Analogia Django**: É como o `urls.py` raiz — o ponto onde tudo começa. O `<StrictMode>` é como `DEBUG=True`.

---

### 4. Componente Raiz

#### `src/App.jsx`
```
Propósito: Orquestra todos os componentes — é o "layout master"
```

Renderiza, em ordem:
1. `<Header />` — Navegação fixa no topo
2. `<Hero />` — Banner principal
3. `<Services />` — Grade de serviços
4. `<About />` — Sobre a empresa
5. Placeholder `<section id="contato">` — Seção de contato (a ser implementada)

**Analogia Django**: É como o `base.html` que define a estrutura da página e inclui os blocos (`{% block content %}`), mas em React cada "bloco" é um componente.

---

### 5. Componentes de Layout

#### `src/components/layout/Header.jsx` + `Header.module.css`
```
Propósito: Barra de navegação fixa no topo da página
```

**Funcionalidades:**
- **Logo** com texto "VIALI" e ícone `FaChartLine`
- **Links de navegação** (Início, Serviços, Sobre, Contato) com scroll suave via `href="#id"`
- **Botão CTA** "Fale Conosco" visível em desktop
- **Menu hambúrguer** para mobile (ícone alterna entre `FaBars` e `FaTimes`)
- **Efeito scroll**: ao rolar >50px, o header ganha fundo sólido + sombra (controlado por `useState` + `useEffect` + `scroll event listener`)
- **Fechamento automático**: menu mobile fecha ao clicar em um link

**Estado React usado:**
| Estado | Tipo | Função |
|--------|------|--------|
| `menuOpen` | boolean | Controla abertura/fechamento do menu mobile |
| `scrolled` | boolean | Detecta se o usuário rolou a página (muda estilo do header) |

**CSS Highlights:**
- `position: fixed` — header acompanha a rolagem
- `backdrop-filter: blur()` — efeito de vidro fosco no fundo
- `z-index: 1000` — garante que fica acima de todo conteúdo
- Transição suave entre estado transparente → sólido
- Menu mobile ocupa tela inteira com overlay

---

### 6. Componentes de Seção

#### `src/components/sections/Hero.jsx` + `Hero.module.css`
```
Propósito: Banner principal — primeira coisa que o visitante vê
```

**Elementos visuais:**
- **Overlay gradiente** sobre fundo escuro (cria profundidade)
- **Elementos decorativos** (círculos com borda) para sofisticação visual
- **Badge** "✦ Contabilidade Inteligente para Empresas" (prova de categoria)
- **Título grande** com palavra "SUCESSO" destacada em dourado
- **Subtítulo** descritivo com proposta de valor
- **2 botões CTA**: "Fale no WhatsApp" (dourado) + "Nossos Serviços" (outline)
- **Prova social**: 3 números de impacto (200+ empresas, 9 anos, 98% satisfação)
- **Animações de entrada**: fade-in com delay progressivo (elementos aparecem em sequência)

**Conceitos importantes:**
- **CTA (Call to Action)**: botão que induz o visitante a agir
- **Prova Social**: números que geram confiança ("se 200 empresas confiam, deve ser bom")
- **Hierarquia Visual**: título grande → subtítulo → botões → números (olho segue essa ordem)
- **Animação com delay**: cada elemento aparece 0.2s depois do anterior, criando efeito de "cascata"

**CSS Highlights:**
- `min-height: 100vh` — ocupa 100% da altura da tela
- `@keyframes fadeInUp` — animação de entrada (de baixo para cima com opacidade)
- `animation-delay` progressivo — cria efeito cascata
- Grid responsivo para os números de impacto

---

#### `src/components/sections/Services.jsx` + `Services.module.css`
```
Propósito: Apresenta os serviços oferecidos em formato de cards
```

**Estrutura de dados:**
Define um array `SERVICES` com 6 objetos, cada um contendo:
- `icon` — Componente de ícone do React Icons
- `title` — Nome do serviço
- `description` — Descrição curta (1-2 linhas)
- `features` — Array de strings com itens específicos

**Os 6 serviços:**
1. 📋 Abertura de Empresa
2. 📊 Contabilidade Mensal
3. 📑 Gestão Fiscal e Tributária
4. 👥 Departamento Pessoal
5. 📈 Consultoria Empresarial
6. 🔄 Troca de Contador

**Layout:**
- Usa `<SectionTitle>` para título padronizado
- Renderiza grid responsivo de `<ServiceCard>` via `.map()`
- **3 colunas** em desktop (≥1024px)
- **2 colunas** em tablet (≥640px)
- **1 coluna** em mobile (<640px)

**CSS Highlights:**
- `display: grid` com `grid-template-columns` variável por breakpoint
- Fundo `var(--color-gray-50)` — cinza suave para contraste com seção anterior

---

#### `src/components/sections/About.jsx` + `About.module.css`
```
Propósito: Contar a história da empresa e gerar confiança
```

**Layout Split (duas metades):**

| Lado Esquerdo (Texto) | Lado Direito (Card Visual) |
|------------------------|---------------------------|
| Subtítulo com destaque dourado | Número grande "9" (anos) em dourado |
| 3 parágrafos com palavras em negrito | Divisor gradiente |
| 3 valores (Confiança, Parceria, Inovação) | 3 highlights (CRC, localização, horário) |
| — | Selo "Empresa registrada" |
| — | Quadrado decorativo atrás |

**Dados estruturados:**
- `VALUES[]` — Array com ícone, título e texto de cada valor
- `HIGHLIGHTS[]` — Array com ícone, label e detalhe de cada destaque

**CSS Highlights:**
- `grid-template-columns: 1fr 1fr` — divide em duas metades iguais
- Card com `linear-gradient` no fundo (azul escuro → mais escuro)
- `rgba(255, 255, 255, 0.1)` — fundos semi-transparentes para profundidade
- `.decorSquare` — elemento puramente decorativo com `z-index: 1` (atrás do card)
- Em mobile, empilha verticalmente (1 coluna)

---

### 7. Componentes de UI (Reutilizáveis)

#### `src/components/ui/SectionTitle.jsx` + `SectionTitle.module.css`
```
Propósito: Título padronizado usado em TODAS as seções
```

**Props (parâmetros):**
| Prop | Tipo | Obrigatória | Função |
|------|------|-------------|--------|
| `title` | string | Sim | Texto principal (ex: "NOSSOS") |
| `highlight` | string | Sim | Palavra destacada em dourado (ex: "SERVIÇOS") |
| `subtitle` | string | Não | Descrição abaixo do título |
| `light` | boolean | Não | Se `true`, usa cores claras (para fundos escuros) |

**Por que é importante:**
Sem esse componente, cada seção teria seu próprio estilo de título, criando inconsistência visual. Com ele, basta chamar:

```jsx
<SectionTitle title="NOSSOS" highlight="SERVIÇOS" subtitle="..." />
```

E o resultado é sempre padronizado: badge + título + linha decorativa + subtítulo.

**Elementos renderizados:**
1. Badge (pill) com ícone de estrela
2. Heading `<h2>` com `title` + `highlight` (cor diferente)
3. Linha decorativa (3 barras: fina | grossa dourada | fina)
4. Subtítulo `<p>` (se fornecido)

---

#### `src/components/ui/ServiceCard.jsx` + `ServiceCard.module.css`
```
Propósito: Card individual de serviço (usado dentro de Services.jsx)
```

**Props:**
| Prop | Tipo | Função |
|------|------|--------|
| `icon` | ReactNode | Ícone do React Icons |
| `title` | string | Nome do serviço |
| `description` | string | Descrição curta |
| `features` | string[] | Lista de itens do serviço |

**Anatomia do card:**
```
┌─────────────────────────┐
│  🔵 (ícone circular)    │
│  Título do Serviço      │
│  Descrição curta aqui   │
│                         │
│  ✓ Feature 1            │
│  ✓ Feature 2            │
│  ✓ Feature 3            │
└─────────────────────────┘
```

**Interações:**
- **Hover**: card sobe (`translateY(-8px)`), sombra aumenta, ícone muda de cor (cinza → dourado), borda inferior dourada aparece

---

## 🎨 Design System

### Paleta de Cores

| Token | Cor | Hex | Uso |
|-------|-----|-----|-----|
| `--color-primary` | 🔵 Azul Escuro | `#1B2A4A` | Títulos, header, fundos nobres |
| `--color-primary-dark` | 🔵 Azul Mais Escuro | `#0F1B33` | Variante hover, gradientes |
| `--color-accent` | 🟡 Dourado | `#C8A35F` | Destaques, CTAs, ícones ativos |
| `--color-accent-dark` | 🟤 Dourado Escuro | `#A8853F` | Hover de botões dourados |
| `--color-accent-light` | 🟨 Dourado Claro | `#F5ECD7` | Fundos suaves de ícones |
| `--color-gray-50` | ⬜ Quase Branco | `#F8F9FA` | Fundo de seções alternadas |
| `--color-white` | ⬜ Branco | `#FFFFFF` | Fundo principal, texto em fundo escuro |

### Tipografia

| Fonte | Variável | Uso |
|-------|----------|-----|
| **Poppins** | `--font-heading` | Títulos, logo, elementos de destaque |
| **Inter** | `--font-body` | Corpo de texto, parágrafos, listas |

### Escala de Espaçamentos

Baseada em múltiplos de **4px** (`0.25rem`):

```
--space-1:   4px    (0.25rem)   →  micro gaps
--space-2:   8px    (0.5rem)    →  gaps internos
--space-3:  12px    (0.75rem)   →  padding pequeno
--space-4:  16px    (1rem)      →  padding padrão
--space-6:  24px    (1.5rem)    →  gaps entre elementos
--space-8:  32px    (2rem)      →  separação de blocos
--space-10: 40px    (2.5rem)    →  padding de cards
--space-12: 48px    (3rem)      →  separação de seções (mobile)
--space-16: 64px    (4rem)      →  separação de seções (desktop)
--space-20: 80px    (5rem)      →  padding hero/seções grandes
```

---

## 📱 Responsividade

O projeto segue abordagem **mobile-first** com 3 breakpoints principais:

| Breakpoint | Largura | Alvo |
|------------|---------|------|
| Base | `< 640px` | Smartphones (padrão) |
| `@media (min-width: 640px)` | `640px+` | Tablets em retrato |
| `@media (min-width: 768px)` | `768px+` | Tablets em paisagem |
| `@media (min-width: 1024px)` | `1024px+` | Desktops e laptops |

### Comportamentos por breakpoint

| Elemento | Mobile | Tablet | Desktop |
|----------|--------|--------|---------|
| **Header** | Menu hambúrguer | Menu hambúrguer | Links inline |
| **Hero título** | `--text-3xl` | `--text-4xl` | `--text-5xl` |
| **Hero CTAs** | Empilhados | Lado a lado | Lado a lado |
| **Services grid** | 1 coluna | 2 colunas | 3 colunas |
| **About layout** | Empilhado | Empilhado | Split 50/50 |
| **SectionTitle** | Menor | — | Maior |

---

## 🚀 Como Rodar

### Com Docker (Recomendado)

```powershell
# Na raiz do projeto (onde está o docker-compose.yml)
docker compose up -d --build frontend

# Acessar no navegador
# http://localhost:5173
```

### Sem Docker (Desenvolvimento Local)

```powershell
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acessar no navegador
# http://localhost:5173
```

### Build de Produção

```powershell
# Gerar build otimizado
npm run build

# Os arquivos ficam em frontend/dist/
```

---

## 🔧 Comandos Úteis

```powershell
# Ver logs do container frontend
docker compose logs -f frontend

# Reiniciar apenas o frontend
docker compose restart frontend

# Reconstruir após mudanças no Dockerfile
docker compose up -d --build frontend

# Parar tudo
docker compose down

# Instalar nova dependência (sem Docker)
npm install nome-do-pacote

# Instalar nova dependência (com Docker)
docker compose exec frontend npm install nome-do-pacote
```

---

## 🗺 Próximas Etapas

- [ ] **Seção Contato** — Formulário com validação + mapa
- [ ] **Footer** — Rodapé com links, redes sociais, copyright
- [ ] **Integração API** — Conectar formulário ao backend Django
- [ ] **SEO** — Metatags Open Graph, título dinâmico
- [ ] **Performance** — Lazy loading, otimização de imagens
- [ ] **Acessibilidade** — ARIA labels, navegação por teclado
- [ ] **Analytics** — Google Analytics / Tag Manager
- [ ] **Dark Mode** — Sobrescrever variáveis CSS com `prefers-color-scheme`

---

## 📝 Padrões do Projeto

### Regras de Código

1. **Um componente por arquivo** — cada `.jsx` exporta um único componente
2. **CSS Module par** — cada componente tem seu `.module.css` correspondente
3. **Dados separados da renderização** — arrays de dados (`SERVICES`, `VALUES`) ficam fora do JSX
4. **Props tipadas por convenção** — cada componente documenta suas props
5. **Nomes semânticos** — classes CSS descrevem o que o elemento **é**, não como ele **parece**
   - ✅ `.heroTitle`, `.serviceCard`, `.valueIcon`
   - ❌ `.bigBlueText`, `.roundedBox`, `.yellowCircle`

### Estrutura de Componente Padrão

```jsx
// 1. Comentário de cabeçalho (propósito + analogia)
// 2. Imports
import styles from './Componente.module.css';

// 3. Dados estáticos (se houver)
const DATA = [...]

// 4. Componente
export default function Componente({ prop1, prop2 }) {
  // 5. Estado / efeitos (se houver)
  // 6. Return JSX
  return (
    <section className={styles.wrapper}>
      ...
    </section>
  );
}
```

---

> **Desenvolvido com 💙 para a Viali Assessoria Contábil**  
> *Frontend React + Vite | Design System customizado | Mobile-first*
