CONTEXTO
Landing page da Viali Assessoria Contábil (contabilidade em Brasília-DF), portfólio 
e preparação para entrevista pro code Node/Python. 
Front: React 19 + Vite 8 + CSS Modules. Back: Node 20/Express (API Gateway) + 
Python/FastAPI. Banco: Azure Cosmos DB. Email: Resend. Há um design system em 
src/styles/global.css com design tokens (CSS custom properties).

ESTRUTURA ATUAL DO FRONTEND (respeitar convenções):
  src/App.jsx (one-page, navegação por âncoras; Contato é só um placeholder)
  src/main.jsx
  src/styles/global.css
  src/components/layout/Header.jsx (+ .module.css)
  src/components/sections/Hero.jsx, Services.jsx, About.jsx (+ .module.css)
  src/components/ui/Button.jsx, SectionTitle.jsx, ServiceCard.jsx (+ .module.css)
  src/components/chatbot/  (pasta VAZIA — usar para a estrutura do botão de chat)
  src/hooks/useScrolled.js  (reaproveitar)
  src/services/api.js  (camada de fetch — usar)
  src/utils/formatters.js
  src/assets/hero.png, src/assets/images/logo_viali.webp
  public/favicon.svg (trocar pela logo), public/icons.svg
Backend Node já tem as rotas: /api/health, /api/chat, /api/contato (valida+salva 
lead no Cosmos+dispara email via Resend), /api/cnpj, /api/cep. NÃO há Footer no front.

REGRAS DE TRABALHO
- Trabalhar em BABY STEPS pequenos e testáveis; não avançar sem eu confirmar.
- Comentar todo código em português; dizer o NOME TÉCNICO de cada coisa (uso na 
  entrevista); usar analogias com Django quando ajudar.
- Reaproveitar o que já existe (useScrolled, services/api.js, design tokens) em vez 
  de recriar.

DECISÕES JÁ TOMADAS (não rediscutir)
1. Redesign "Apple-ish": contenção, muito respiro, tipografia de assinatura (trocar 
   o Montserrat de display), animações dirigidas por SCROLL (reveal/sticky) no lugar 
   dos fadeInUp, quebra de simetria no Hero e no "Sobre". Glassmorphism SÓ na navbar 
   e no botão flutuante.
2. Vou fornecer FOTOS REAIS do escritório (usar no Hero e em 1-2 âncoras, full-bleed, 
   com overlay na cor da marca e muito respiro). Não fazer versão sem foto.
3. Serviços: manter 7 cards, incluindo o novo "BPO Financeiro" (terceirização da 
   gestão financeira: contas a pagar/receber, conciliação, fluxo de caixa, boletos/NF). 
   Ajustar o grid para ficar harmônico com 7.
4. Botão flutuante de WhatsApp VERDE no canto inferior direito; clique vai DIRETO 
   para wa.me/556130324349. ACIMA dele, deixar a estrutura do botão do chatbot pronta 
   (em src/components/chatbot/) porém OCULTA/não renderizada por enquanto.
5. Favicon a partir da logo da Viali (substituir public/favicon.svg).
6. Seção CONTATO (hoje placeholder) deve virar seção real com email e telefone 
   ((61) 3032-4349) visíveis e formulário conectado em POST /api/contato (rota já existe).
7. Footer NOVO: crédito "Desenvolvido por VH.Medeiros" linkando vhmedeiros.dev.br 
   (discreto) + embed do Google Maps por IFRAME (sem API key), com lazy load, 
   endereço SIG Quadra 01 Sala 112, Brasília-DF.
8. Nova entrada de menu e seção "QUEM SOMOS": cards de colaborador (foto, nome, 
   função, texto curto). Dados em um array estático no front por enquanto (sem backend).
9. Copy de todos os textos: foco nas DORES do cliente (multa/malha fina, tempo 
   perdido, falta de visão financeira, insegurança tributária), contabilidade como 
   INVESTIMENTO e não custo, confiança SEM exagero. Funil sóbrio.
10. Blog NÃO entra agora, mas estruturar o código para acomodar futuramente um blog 
    e um carrossel de artigos na home, sem refatoração grande (deixar o encaixe pronto).

PONTOS EM ABERTO (me pergunte ANTES de finalizar o roadmap)
A. Paleta: me mostre 2 opções com hex — (A) navy+dourado refinado e dessaturado; 
   (B) base creme/papel + tinta escura + 1 acento — e espere minha escolha.
B. Roteamento: recomendo manter tudo one-page com âncoras agora (Quem Somos como 
   seção), e introduzir react-router só quando o blog chegar. Confirme ou proponha melhor.
C. Animações: como NÃO há lib de animação instalada, recomendo começar simples com 
   IntersectionObserver + um hook useScrollReveal (zero dependência, fácil de explicar) 
   em vez de framer-motion. Confirme ou proponha melhor.

O QUE EU QUERO AGORA: SOMENTE O ROADMAP — NÃO ESCREVA CÓDIGO.
Quebre em fases e, dentro de cada fase, em BABY STEPS pequenos e testáveis. Para CADA 
baby step entregue exatamente este formato:

  • Passo N — [nome curto]
  • Objetivo: (1-2 linhas)
  • Nome técnico: (termo que eu falaria na entrevista)
  • Arquivos/pastas afetados: (caminhos reais da estrutura acima)
  • Como vou testar que funcionou:
  • ⤷ PROMPT PRONTO: (bloco completo e autossuficiente que eu vou COLAR depois para 
     você executar SÓ esse passo, com todo o contexto necessário para rodar isolado)

BACKBONE DE FASES (use como base, refine se fizer sentido):
  F0 — Preparação: confirmar A/B/C, favicon a partir da logo, fundação do design 
       system v2 (novos tokens: fonte de display, cores conforme a paleta, escala de 
       movimento) e o hook useScrollReveal.
  F1 — Redesign das seções existentes na nova linguagem: Header (com item Quem Somos), 
       Hero (assimétrico + foto), Serviços (7 cards incl. BPO, efeito de card elevado), 
       Sobre, Contato (seção real: form + email/telefone), Footer novo (crédito + maps).
  F2 — Botões flutuantes: WhatsApp (visível, link direto) + chatbot (estrutura oculta 
       em components/chatbot/).
  F3 — Seção Quem Somos (array estático de colaboradores).
  F4 — Preparar o encaixe futuro de blog/carrossel (só estrutura/placeholder, sem implementar).

Comece me fazendo as perguntas A, B e C. Depois entregue o roadmap completo no formato 
acima. Não escreva nenhum código até eu aprovar o roadmap.


Perfeito. Todas as decisões fechadas:

| Decisão | Escolha |
|---|---|
| Paleta | B2 — creme / tinta escura / azul `#1A5FA8` |
| Roteamento | One-page + âncoras agora |
| Animações | `framer-motion` (`whileInView`, `useScroll`) |
| `useScrollReveal` | Removido do escopo |
| Fonte de display | DM Serif Display (Google Fonts) |

---

# Roadmap — Viali Assessoria Contábil

## F0 — Preparação e Fundação

---

**• Passo 1 — Favicon a partir da logo**
**Objetivo:** Substituir `public/favicon.svg` por um favicon derivado da logo `logo_viali.webp`, convertendo para `.ico` + `svg` minimalista (só o "V" com caduceu, fundo navy da logo).
**Nome técnico:** Favicon pipeline — conversão de raster para SVG simplificado + ICO multi-resolução via script Node.
**Arquivos/pastas afetados:** `public/favicon.svg`, `public/favicon.ico` (novo), `index.html`
**Como testar:** Abrir o browser, ver o ícone na aba; inspecionar `<head>` e confirmar os `<link rel="icon">` corretos.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. Frontend React 19 + Vite 8.
A logo está em src/assets/images/logo_viali.webp (fundo navy #0D1F4E, 
logotipo branco + caduceu ciano). Preciso:
1. Criar public/favicon.svg com um "V" estilizado simples em fundo navy 
   (#0D1F4E), compatível com todos os browsers modernos.
2. Atualizar index.html para referenciar corretamente esse favicon.
NÃO escreva código de outros arquivos. Só favicon.svg e a linha de index.html.
Comente tudo em português e diga o nome técnico de cada decisão.
```

---

**• Passo 2 — Design tokens v2 (paleta + tipografia)**
**Objetivo:** Atualizar `src/styles/global.css` com os novos tokens de cor (B2), importar DM Serif Display via Google Fonts e definir a escala tipográfica de display.
**Nome técnico:** CSS Custom Properties (design tokens) — single source of truth para cor, tipografia e espaçamento, equivalente ao `settings.py` de variáveis do Django.
**Arquivos/pastas afetados:** `src/styles/global.css`, `index.html` (import Google Fonts)
**Como testar:** Abrir o DevTools → inspecionar `:root` e confirmar que as variáveis novas existem; verificar que DM Serif Display carrega na aba Network.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. Frontend React 19 + Vite 8 + 
CSS Modules. Arquivo src/styles/global.css já existe com tokens antigos.
Paleta nova (B2):
  --color-bg:        #EDE8DF   (background geral)
  --color-surface:   #F7F4EE   (cards, navbar)
  --color-ink:       #1A1A18   (texto principal)
  --color-accent:    #1A5FA8   (azul — CTAs, links, destaques)
  --color-muted:     #8C8579   (texto secundário)
  --color-border:    rgba(26,26,24,0.10)
Fonte de display: DM Serif Display (Google Fonts, peso 400 regular + 400 italic).
Fonte de corpo: manter Inter ou system-sans (decidir e documentar).
Tarefa:
1. Adicionar @import do Google Fonts em index.html (tag <link> com preconnect).
2. Reescrever o bloco :root de src/styles/global.css mantendo os tokens 
   antigos que ainda são usados e adicionando os novos acima + tokens de 
   tipografia (--font-display, --font-body, escala de tamanhos --text-sm até 
   --text-4xl) + tokens de movimento (--duration-fast: 200ms, 
   --duration-base: 400ms, --ease-out-expo: cubic-bezier(0.16,1,0.3,1)).
Comente tudo em português com nome técnico de cada decisão.
```

---

**• Passo 3 — Instalar framer-motion**
**Objetivo:** Adicionar `framer-motion` como dependência e criar um arquivo de variantes reutilizáveis (`src/lib/motionVariants.js`) com os presets de animação do projeto.
**Nome técnico:** `framer-motion` — biblioteca de animação declarativa para React; variantes são equivalentes a "classes de estado de animação" reutilizáveis.
**Arquivos/pastas afetados:** `package.json`, `src/lib/motionVariants.js` (novo)
**Como testar:** Importar uma variante num componente qualquer, envolver um `<div>` com `<motion.div>` e confirmar que a animação roda sem erros no console.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. Frontend React 19 + Vite 8.
Tarefa:
1. Instalar framer-motion via npm.
2. Criar src/lib/motionVariants.js com as seguintes variantes reutilizáveis,
   comentadas em português com nome técnico:
   - fadeUp: elemento sobe 24px e aparece (para seções)
   - fadeIn: só opacidade (para overlays)
   - staggerContainer: container que distribui animação nos filhos 
     (staggerChildren: 0.1)
   - cardHover: escala sutil (1.02) no hover de cards
   Usar os tokens de duração/easing: duration 0.4, ease [0.16,1,0.3,1].
3. Exportar cada variante como named export.
NÃO modificar nenhum componente ainda. Só instalar e criar o arquivo.
```

---

## F1 — Redesign das Seções

---

**• Passo 4 — Header redesenhado**
**Objetivo:** Refatorar `Header.jsx` com a nova paleta, glassmorphism sutil na navbar ao rolar (reaproveitando `useScrolled.js`), item "Quem Somos" no menu e animação de entrada com `framer-motion`.
**Nome técnico:** Glassmorphism via `backdrop-filter: blur()` + `framer-motion` layout animation; `useScrolled` como custom hook de efeito colateral de scroll.
**Arquivos/pastas afetados:** `src/components/layout/Header.jsx`, `src/components/layout/Header.module.css`
**Como testar:** Rolar a página — navbar deve transicionar para glass; link "Quem Somos" deve aparecer no menu; testar em mobile (hambúrguer).
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. Frontend React 19 + Vite 8 + 
CSS Modules. framer-motion já instalado. Tokens em src/styles/global.css.
Hook useScrolled em src/hooks/useScrolled.js já existe (retorna boolean).
Links de menu atuais: Início, Serviços, Sobre, Contato.
Tarefa: Refatorar src/components/layout/Header.jsx e Header.module.css:
1. Nova paleta: fundo surface (#F7F4EE) quando no topo; ao rolar, aplicar 
   glassmorphism (backdrop-filter blur + background rgba(247,244,238,0.80)).
2. Adicionar item "Quem Somos" entre Sobre e Contato (âncora #quem-somos).
3. Logo: usar src/assets/images/logo_viali.webp com altura controlada.
4. Animação de entrada da navbar com framer-motion (fadeIn de cima).
5. Manter o hook useScrolled existente para detectar scroll.
Comente tudo em português com nome técnico. Respeite CSS Modules.
```

---

**• Passo 5 — Hero assimétrico com foto real**
**Objetivo:** Refatorar `Hero.jsx` com layout assimétrico (texto à esquerda, foto à direita full-bleed com overlay de cor da marca), animações de entrada escalonadas com `framer-motion` e tipografia de display (DM Serif Display).
**Nome técnico:** Asymmetric grid layout com CSS Grid + `framer-motion` `staggerChildren` para entrada escalonada de elementos; overlay via pseudo-elemento `::after`.
**Arquivos/pastas afetados:** `src/components/sections/Hero.jsx`, `src/components/sections/Hero.module.css`
**Como testar:** Visualizar em desktop e mobile; confirmar que a foto ocupa metade direita, overlay aparece, texto anima em sequência ao carregar.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado. Variantes em src/lib/motionVariants.js. 
Tokens de cor e tipografia em src/styles/global.css.
Fonte de display: DM Serif Display (já importada).
ATENÇÃO: As fotos reais do escritório ainda não foram fornecidas. 
Usar src/assets/hero.png como placeholder por enquanto, com comentário 
TODO indicando onde trocar.
Tarefa: Refatorar src/components/sections/Hero.jsx e Hero.module.css:
1. Layout de 2 colunas assimétricas via CSS Grid (60% texto / 40% foto) 
   em desktop; stack vertical em mobile.
2. Coluna da foto: imagem full-bleed com overlay na cor --color-accent 
   (azul #1A5FA8) em opacidade 0.35.
3. Coluna de texto: eyebrow em caixa alta (fonte body, --color-accent), 
   headline em DM Serif Display grande, subtítulo em --color-muted, 
   2 botões (primário e secundário usando Button.jsx existente).
4. Animação de entrada: staggerChildren via framer-motion, cada elemento 
   entra com fadeUp.
5. Copy focado em DOR do cliente: multa, malha fina, tempo perdido.
Comente tudo em português com nome técnico.
```

---

**• Passo 6 — Seção Serviços (7 cards + BPO Financeiro)**
**Objetivo:** Refatorar `Services.jsx` com os 7 serviços (incluindo BPO Financeiro novo), grid harmônico para número ímpar de cards, efeito de elevação no hover e reveal por scroll com `framer-motion`.
**Nome técnico:** CSS Grid com `auto-fit` + `framer-motion` `whileInView` com `staggerChildren`; card elevation via `box-shadow` progressivo no hover.
**Arquivos/pastas afetados:** `src/components/sections/Services.jsx`, `src/components/sections/Services.module.css`, `src/components/ui/ServiceCard.jsx`, `src/components/ui/ServiceCard.module.css`
**Como testar:** Conferir 7 cards no grid, grid equilibrado, animação ao entrar na viewport, hover com elevação visível.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado. Variantes em src/lib/motionVariants.js.
ServiceCard.jsx já existe (reaproveitar e estender).
Os 7 serviços são:
1. Contabilidade Empresarial
2. Abertura e Encerramento de Empresas
3. Planejamento Tributário
4. Folha de Pagamento (RH/DP)
5. Obrigações Fiscais e Acessórias
6. Consultoria Contábil
7. BPO Financeiro (NOVO: terceirização da gestão financeira — contas a 
   pagar/receber, conciliação bancária, fluxo de caixa, emissão de boletos/NF)
Tarefa: Refatorar Services.jsx, Services.module.css, ServiceCard.jsx e 
ServiceCard.module.css:
1. Grid com auto-fit minmax(280px, 1fr); o 7º card centralizado sozinho 
   na última linha via justify-items ou solução equivalente elegante.
2. Card: superfície --color-surface, borda sutil, ícone SVG do 
   public/icons.svg (usar <use>), título, descrição curta focada na DOR.
3. Hover: elevação com box-shadow + translateY(-4px) via framer-motion 
   cardHover variant.
4. Reveal por scroll: whileInView com staggerChildren nos cards.
Comente tudo em português com nome técnico.
```

---

**• Passo 7 — Seção Sobre redesenhada**
**Objetivo:** Refatorar `About.jsx` com quebra de simetria (foto + bloco de texto em proporções diferentes), copy revisado focado em confiança e posicionamento como investimento, reveal por scroll.
**Nome técnico:** Assimetria intencional via CSS Grid com colunas de proporção áurea (`5fr 7fr`) + `framer-motion` `whileInView`.
**Arquivos/pastas afetados:** `src/components/sections/About.jsx`, `src/components/sections/About.module.css`
**Como testar:** Confirmar layout assimétrico em desktop, stack em mobile, animação ao entrar na viewport.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado. Variantes em src/lib/motionVariants.js.
Tokens em src/styles/global.css. Fonte display: DM Serif Display.
ATENÇÃO: Foto real do escritório ainda não disponível. 
Usar src/assets/hero.png como placeholder com TODO comentado.
Tarefa: Refatorar About.jsx e About.module.css:
1. Layout grid assimétrico: coluna imagem 5fr, coluna texto 7fr em desktop.
   Stack em mobile.
2. Imagem com border-radius e um detalhe de "desalinhamento" intencional 
   (offset via margin negativa ou transform), criando tensão visual.
3. Texto: eyebrow "Nossa história", headline DM Serif Display, parágrafos 
   com copy focado em CONFIANÇA e contabilidade como INVESTIMENTO (não custo).
   Incluir 3 números de credibilidade (ex: anos de mercado, clientes, etc) 
   em destaque visual.
4. Reveal: whileInView fadeUp em cada bloco.
Comente tudo em português com nome técnico.
```

---

**• Passo 8 — Seção Contato real (formulário + dados)**
**Objetivo:** Transformar o placeholder de Contato em seção real com email, telefone visíveis e formulário conectado ao `POST /api/contato` via `src/services/api.js`.
**Nome técnico:** Controlled form com React state + fetch via camada de serviço (`services/api.js`); feedback de UX via estados de loading/sucesso/erro.
**Arquivos/pastas afetados:** `src/components/sections/Contact.jsx` (novo, ou renomear placeholder), `src/components/sections/Contact.module.css` (novo), `src/services/api.js`
**Como testar:** Preencher formulário, submeter, confirmar request no Network tab; testar mensagem de sucesso e de erro; confirmar que email e telefone estão visíveis sem interação.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado. src/services/api.js já existe (camada de fetch).
Backend Node já tem rota POST /api/contato que valida, salva lead no 
Cosmos DB e dispara email via Resend. Retorna {success: true} ou erro.
Dados de contato: telefone (61) 3032-4349, email contato@viali.com.br 
(ajustar se diferente).
Tarefa: Criar src/components/sections/Contact.jsx e Contact.module.css:
1. Layout 2 colunas: esquerda com dados (telefone, email, endereço: 
   SIG Quadra 01 Sala 112, Brasília-DF) + chamada emocional breve; 
   direita com formulário (nome, email, telefone, mensagem, botão enviar).
2. Formulário: controlled components React, validação básica client-side 
   (campos obrigatórios, formato email).
3. Integrar com api.js: POST /api/contato, estados loading/sucesso/erro 
   com feedback visual.
4. Reveal por scroll com framer-motion whileInView.
5. Adicionar seção ao App.jsx no lugar do placeholder.
Comente tudo em português com nome técnico.
```

---

**• Passo 9 — Footer novo**
**Objetivo:** Criar o `Footer.jsx` com crédito "Desenvolvido por VH.Medeiros" linkando `vhmedeiros.dev.br`, embed do Google Maps por iframe (endereço SIG Quadra 01 Sala 112, Brasília-DF) com `loading="lazy"`.
**Nome técnico:** Iframe embed com lazy loading nativo (`loading="lazy"`) + footer semântico HTML5.
**Arquivos/pastas afetados:** `src/components/layout/Footer.jsx` (novo), `src/components/layout/Footer.module.css` (novo), `src/App.jsx`
**Como testar:** Confirmar que o mapa carrega ao rolar até o footer (checar Network tab — request do iframe só deve sair perto do final da página); link de crédito abre `vhmedeiros.dev.br`.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
Tokens em src/styles/global.css. Não há Footer atualmente.
Endereço: SIG Quadra 01 Sala 112, Brasília-DF.
Tarefa: Criar src/components/layout/Footer.jsx e Footer.module.css:
1. Layout: coluna esquerda com logo + tagline + links rápidos do menu; 
   coluna direita com iframe do Google Maps (embed sem API key, lazy load) 
   apontando para o endereço acima.
2. Linha inferior: copyright Viali + crédito discreto 
   "Desenvolvido por VH.Medeiros" com link para https://vhmedeiros.dev.br 
   (target _blank, rel noopener).
3. Paleta escura invertida: fundo --color-ink (#1A1A18), texto claro.
4. Adicionar <Footer /> no App.jsx após a seção Contato.
Comente tudo em português com nome técnico.
```

---

## F2 — Botões Flutuantes

---

**• Passo 10 — Botão WhatsApp flutuante**
**Objetivo:** Adicionar botão verde fixo no canto inferior direito com link direto para `wa.me/556130324349`, com animação de entrada `framer-motion` e efeito pulse sutil.
**Nome técnico:** `position: fixed` + `framer-motion` `animate` com `scale` pulsante (keyframe animation declarativa); deep link WhatsApp via `wa.me`.
**Arquivos/pastas afetados:** `src/components/ui/WhatsAppButton.jsx` (novo), `src/components/ui/WhatsAppButton.module.css` (novo), `src/App.jsx`
**Como testar:** Botão visível em todas as seções; clique abre WhatsApp com o número correto; não sobrepõe conteúdo crítico em mobile.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado.
Tarefa: Criar src/components/ui/WhatsAppButton.jsx e .module.css:
1. Botão circular fixo, canto inferior direito (bottom: 24px, right: 24px).
2. Cor: verde WhatsApp (#25D366), ícone SVG do WhatsApp inline.
3. Glassmorphism leve na borda (box-shadow sutil).
4. Link: https://wa.me/556130324349 (target _blank, rel noopener).
5. Animação framer-motion: entrada com fadeIn após 1s de delay; 
   pulse sutil contínuo via animate scale entre 1 e 1.05.
6. Adicionar ao App.jsx fora do fluxo de seções (renderizar sempre).
Comente tudo em português com nome técnico.
```

---

**• Passo 11 — Estrutura oculta do chatbot**
**Objetivo:** Criar a estrutura do botão de chatbot em `src/components/chatbot/` (botão + panel básico) porém completamente oculto/não renderizado — pronto para ativar futuramente.
**Nome técnico:** Feature flag via constante booleana (`CHATBOT_ENABLED = false`) — equivalente a `settings.FEATURE_FLAGS` do Django; componente existe mas não é montado.
**Arquivos/pastas afetados:** `src/components/chatbot/ChatButton.jsx` (novo), `src/components/chatbot/ChatPanel.jsx` (novo), `src/components/chatbot/index.js` (novo), `src/App.jsx`
**Como testar:** Confirmar que nada aparece na UI; confirmar que os arquivos existem e exportam corretamente; flag `CHATBOT_ENABLED = true` deve renderizar o botão sem outros erros.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
A pasta src/components/chatbot/ existe mas está vazia.
O backend já tem rota POST /api/chat pronta.
Tarefa: Criar a estrutura do chatbot OCULTA (não renderizada):
1. src/components/chatbot/ChatButton.jsx: botão circular (acima do 
   WhatsApp, bottom: 88px, right: 24px), cor --color-accent, ícone de 
   chat. Posicionado fixo mas controlado pela feature flag.
2. src/components/chatbot/ChatPanel.jsx: panel básico (título, área de 
   mensagens vazia, input) — só estrutura, sem lógica de API ainda.
3. src/components/chatbot/index.js: exporta ambos + constante 
   CHATBOT_ENABLED = false.
4. App.jsx: importar mas renderizar condicionalmente 
   {CHATBOT_ENABLED && <ChatButton />}.
Comente tudo em português com nome técnico, incluindo como ativar futuramente.
```

---

## F3 — Seção Quem Somos

---

**• Passo 12 — Seção Quem Somos (array estático)**
**Objetivo:** Criar a seção `TeamSection.jsx` com cards de colaborador (foto, nome, função, texto curto) alimentados por array estático no front — sem backend.
**Nome técnico:** Static data layer — array de objetos como "fixture" local, equivalente a `fixtures/` do Django; padrão para desacoplar dados de apresentação antes de ter uma API.
**Arquivos/pastas afetados:** `src/components/sections/TeamSection.jsx` (novo), `src/components/sections/TeamSection.module.css` (novo), `src/data/team.js` (novo), `src/App.jsx`
**Como testar:** Cards aparecem com foto placeholder, nome, função e texto; layout responsivo; animação por scroll.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8 + CSS Modules.
framer-motion instalado. Tokens em src/styles/global.css.
Tarefa:
1. Criar src/data/team.js com array estático de 3-4 colaboradores 
   placeholder (nome fictício, função, texto curto, foto: usar uma URL 
   de avatar placeholder como https://i.pravatar.cc/300?u=N).
2. Criar src/components/sections/TeamSection.jsx:
   - Eyebrow + headline DM Serif Display
   - Grid de cards: foto circular ou arredondada, nome, função (--color-accent), 
     texto curto
   - Reveal por scroll: whileInView staggerChildren
3. Criar TeamSection.module.css com os estilos.
4. Adicionar ao App.jsx com id="quem-somos" (âncora do menu).
Comente tudo em português com nome técnico.
```

---

## F4 — Encaixe Futuro do Blog

---

**• Passo 13 — Estrutura placeholder para blog e carrossel**
**Objetivo:** Criar os "encaixes" para o blog futuro — pasta de rotas, componente de carrossel de artigos comentado como TODO, e seção placeholder na home — sem implementar nada funcional.
**Nome técnico:** Scaffolding — estrutura de arquivos "esqueleto" que define contratos de interface futuros sem implementação; equivalente a `NotImplementedError` em Python ou migration vazia no Django.
**Arquivos/pastas afetados:** `src/pages/` (pasta nova), `src/pages/BlogPage.jsx` (stub), `src/components/sections/ArticlesCarousel.jsx` (stub comentado), `src/data/articles.js` (array vazio com shape definido)
**Como testar:** Nada novo aparece na UI; nenhum erro de import; shape do array `articles.js` está documentado com comentários para o dev futuro.
**⤷ PROMPT PRONTO:**
```
CONTEXTO: Projeto Viali Assessoria Contábil. React 19 + Vite 8.
Roteamento atual: one-page com âncoras. react-router NÃO instalado ainda.
Tarefa: Criar scaffolding para blog futuro SEM implementar funcionalidade:
1. Criar pasta src/pages/ e src/pages/BlogPage.jsx com comentário 
   explicando que aqui entrará a listagem do blog quando react-router 
   for instalado.
2. Criar src/components/sections/ArticlesCarousel.jsx: componente que 
   retorna null por enquanto, com comentário TODO detalhado descrevendo 
   props esperadas (articles: array, title: string) e estrutura futura.
3. Criar src/data/articles.js: array vazio com comentário documentando 
   o shape de cada artigo {id, title, excerpt, slug, date, category, 
   coverImage}.
4. NÃO importar nada disso no App.jsx ainda.
Comente tudo em português com nome técnico. O objetivo é deixar 
"trilhos" para o próximo dev (ou você mesmo no futuro).
```

---

## Resumo visual das fases

| Fase | Passos | Entrega |
|---|---|---|
| F0 — Fundação | 1, 2, 3 | Favicon, tokens v2, framer-motion |
| F1 — Redesign | 4, 5, 6, 7, 8, 9 | Todas as seções + Footer |
| F2 — Flutuantes | 10, 11 | WhatsApp + chatbot oculto |
| F3 — Quem Somos | 12 | Seção de equipe |
| F4 — Blog scaffold | 13 | Estrutura para o futuro |

Cada passo é independente e testável antes de avançar. Me confirma o roadmap e começamos pelo **Passo 1**.