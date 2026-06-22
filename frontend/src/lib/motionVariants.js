/**
 * motionVariants.js — Biblioteca de variantes de animação reutilizáveis
 *
 * Termo técnico: Animation Variants (framer-motion)
 * Variantes são objetos que descrevem ESTADOS de animação nomeados
 * ("hidden", "visible", "hover") — análogo a um dicionário de estados
 * no Django, mas para o visual.
 *
 * Como usar num componente:
 *   import { fadeUp, staggerContainer } from '@/lib/motionVariants'
 *   <motion.div variants={staggerContainer} initial="hidden" whileInView="visible">
 *     <motion.p variants={fadeUp}>Texto animado</motion.p>
 *   </motion.div>
 *
 * Easing padrão do projeto: [0.16, 1, 0.3, 1] — "ease-out-expo"
 * Sensação física de desaceleração rápida, padrão Apple/Linear.
 * No CSS equivale a: cubic-bezier(0.16, 1, 0.3, 1)
 */

/* ------------------------------------------------------------------
   fadeUp — elemento sobe 24px e aparece gradualmente
   Uso: elementos individuais dentro de um staggerContainer,
   ou diretamente com whileInView em seções simples.
   ------------------------------------------------------------------ */
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,          /* começa 24px abaixo da posição final */
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],   /* ease-out-expo */
    },
  },
}

/* ------------------------------------------------------------------
   fadeIn — só opacidade, sem movimento
   Uso: overlays, imagens de fundo, elementos que não devem se mover
   (ex: foto do Hero, overlay colorido).
   ------------------------------------------------------------------ */
export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/* ------------------------------------------------------------------
   staggerContainer — container que distribui a animação nos filhos
   em cascata (um após o outro).

   Termo técnico: Staggered Children Animation
   O "staggerChildren" define o intervalo entre cada filho animar.
   O "delayChildren" adiciona uma pausa antes do primeiro filho.

   Uso: envolver uma lista de cards, itens de menu, parágrafos, etc.
   Os filhos devem usar fadeUp (ou qualquer outra variante) como
   variants — o framer-motion propaga automaticamente "hidden"/"visible"
   do pai para os filhos (Variant Propagation).
   ------------------------------------------------------------------ */
export const staggerContainer = {
  hidden: {},   /* container em si não anima, só coordena os filhos */
  visible: {
    transition: {
      staggerChildren: 0.1,    /* 100ms entre cada filho */
      delayChildren: 0.1,      /* 100ms de pausa antes do primeiro */
    },
  },
}

/* ------------------------------------------------------------------
   staggerContainerFast — versão mais rápida para listas longas
   (ex: 7 cards de serviços — 0.1s entre cada ficaria lento demais)
   ------------------------------------------------------------------ */
export const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

/* ------------------------------------------------------------------
   cardHover — elevação sutil ao passar o mouse sobre um card
   Uso: passar direto na prop "whileHover" do motion.div do card.

   Termo técnico: Micro-interaction / Hover State Animation
   Não usa "hidden"/"visible" — é um estado de interação pontual,
   não de entrada na viewport.

   Exemplo:
     <motion.div whileHover="hover" variants={cardHover}>
   ------------------------------------------------------------------ */
export const cardHover = {
  hover: {
    y: -6,                        /* sobe 6px */
    boxShadow: '0 16px 32px rgba(26, 26, 24, 0.12)',
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/* ------------------------------------------------------------------
   slideInLeft / slideInRight — entrada lateral
   Uso: layouts assimétricos (Hero, Sobre) onde texto e imagem
   entram de lados opostos.
   ------------------------------------------------------------------ */
export const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/* ------------------------------------------------------------------
   viewportConfig — configuração padrão para whileInView
   Reutilizar em todos os componentes para consistência.

   Termo técnico: Intersection Observer config (framer-motion
   usa IntersectionObserver internamente no whileInView).

   "once: true"    → anima só na primeira vez que entra na tela
   "amount: 0.15"  → dispara quando 15% do elemento está visível
                     (evita disparar cedo demais em mobile)

   Exemplo de uso:
     <motion.div
       variants={fadeUp}
       initial="hidden"
       whileInView="visible"
       viewport={viewportConfig}
     >
   ------------------------------------------------------------------ */
export const viewportConfig = {
  once: true,
  amount: 0.15,
}