/* ============================================================
   ServiceCard v2 — Card individual de serviço
   ============================================================
   Mudanças da v1:
   - Animação: framer-motion motion.article com fadeUp + cardHover
   - Removida lista de features — copy mais direto (só descrição)
   - Cores: migradas para tokens v2
   - Ícone: fundo sólido no lugar de gradiente navy
   ============================================================ */

import { motion } from 'framer-motion'
import { fadeUp, cardHover } from '../../lib/motionVariants'
import styles from './ServiceCard.module.css'

/*
  motion.article — framer-motion anima o elemento <article>.
  Dois comportamentos distintos:
    variants={fadeUp}     → animação de entrada (controlada pelo pai staggerContainer)
    whileHover="hover"    → micro-interação de elevação no hover
    variants={cardHover}  → define o estado "hover" (y: -6, box-shadow)

  Como os dois variants coexistem: framer-motion mescla os objetos —
  "hidden"/"visible" vêm do fadeUp, "hover" vem do cardHover.
  Termo técnico: Variant Merging / Compound Variants
*/
export default function ServiceCard({ icon, title, description }) {
  return (
    <motion.article
      className={styles.card}
      variants={{ ...fadeUp, ...cardHover }}
      whileHover="hover"
    >
      {/* Ícone do serviço
          Fundo: --color-accent-light (azul bem claro)
          Ícone: --color-accent (azul executivo) */}
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon}
      </div>

      {/* Título */}
      <h3 className={styles.title}>{title}</h3>

      {/* Descrição — copy focado em dor/solução, sem lista de features */}
      <p className={styles.description}>{description}</p>

      {/* Link de ação — ancora em Contato
          Termo técnico: In-page Navigation / Anchor Link */}
      <a href="#contato" className={styles.cta} aria-label={`Saiba mais sobre ${title}`}>
        Saiba mais →
      </a>
    </motion.article>
  )
}