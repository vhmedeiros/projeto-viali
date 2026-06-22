/* ============================================================
   SectionTitle v2 — Título padronizado para todas as seções
   ============================================================
   Mudanças da v1:
   - Nova prop "eyebrow" — label pequeno acima do título
   - Tipografia: título usa DM Serif Display via classe .display
   - Cores: migradas para tokens v2
   - Barra decorativa: mais fina e discreta (2px no lugar de 4px)
   ============================================================ */

import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportConfig } from '../../lib/motionVariants'
import styles from './SectionTitle.module.css'

/**
 * @param {string} eyebrow  - Label pequeno acima do título (ex: "O que fazemos")
 * @param {string} title    - Título principal
 * @param {string} highlight - Palavra em destaque (cor de acento)
 * @param {string} subtitle - Texto descritivo abaixo
 * @param {string} align    - 'center' | 'left'
 */
export default function SectionTitle({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = 'center',
}) {
  return (
    <motion.div
      className={`${styles.wrapper} ${styles[align]}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      {/* Eyebrow — label de contexto acima do título
          Mesmo padrão do Hero: caixa alta, azul, letra-espaçada */}
      {eyebrow && (
        <motion.p className={styles.eyebrow} variants={fadeUp}>
          {eyebrow}
        </motion.p>
      )}

      {/* Título principal em DM Serif Display */}
      <motion.h2 className={`${styles.title} display`} variants={fadeUp}>
        {title}{' '}
        {highlight && <em className={styles.highlight}>{highlight}</em>}
      </motion.h2>

      {/* Subtítulo */}
      {subtitle && (
        <motion.p className={styles.subtitle} variants={fadeUp}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}