/* ============================================================
   Hero Section v2 — Redesign "Apple-ish"
   ============================================================
   Termo técnico: Hero / Above the Fold

   Mudanças da v1:
   - Layout: de centralizado para assimétrico (grid 55/45)
   - Fundo: de gradiente navy para foto real com overlay (paleta B2)
   - Tipografia: headline em DM Serif Display via classe .display
   - Animações: de CSS keyframes para framer-motion (staggerChildren)
   - Copy: reorientado para DOR do cliente (v1 era proposta de valor genérica)
   - Stats: mantidos, reestilizados para a nova paleta
   ============================================================ */

import { motion } from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'
import heroImg from '../../assets/hero.png'
import { FaBuilding, FaCalendarAlt, FaUsers, FaWhatsapp } from 'react-icons/fa'
import Button from '../ui/Button'
import {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewportConfig,
} from '../../lib/motionVariants'
import styles from './Hero.module.css'

/* ------------------------------------------------------------------
   Dados estáticos — números de credibilidade (prova social)
   Termo técnico: Social Proof / Trust Indicators
   Manter aqui no componente pois são dados fixos da marca.
   ------------------------------------------------------------------ */
const STATS = [
  { icon: <FaBuilding aria-hidden="true" />, value: '+200', label: 'Empresas abertas' },
  { icon: <FaCalendarAlt aria-hidden="true" />, value: '9 anos', label: 'De experiência' },
  { icon: <FaUsers aria-hidden="true" />, value: '+500', label: 'Clientes atendidos' },
]

export default function Hero() {
  return (
    <section id="inicio" className={styles.hero} aria-label="Apresentação da Viali Assessoria Contábil">

      {/* ---- Coluna esquerda: conteúdo textual ---- */}
      {/*
        motion.div com staggerContainer: este elemento coordena
        a animação em cascata de todos os filhos (Variant Propagation).
        Cada filho com variants={fadeUp} anima com 100ms de intervalo.
      */}
      <motion.div
        className={styles.content}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow — label de contexto acima do título principal
            Termo técnico: Eyebrow / Kicker
            Função: situa o leitor antes do headline principal */}
        <motion.p className={styles.eyebrow} variants={fadeUp}>
          Contabilidade em Brasília-DF
        </motion.p>

        {/* Headline principal — usa DM Serif Display via classe .display
            h1 deve ser único por página — impacto direto em SEO.
            Copy focado na DOR: "multa", "malha fina", "tempo perdido" */}
        <motion.h1 className={`${styles.title} display`} variants={fadeUp}>
          Chega de perder{' '}
          <em className={styles.titleEmphasis}>tempo e dinheiro</em>{' '}
          com contabilidade.
        </motion.h1>

        {/* Subtítulo — proposta de valor como solução para a dor
            Menciona explicitamente os riscos que o cliente quer evitar */}
        <motion.p className={styles.subtitle} variants={fadeUp}>
          Multas, malha fina e obrigações fiscais em atraso custam caro.
          A Viali cuida de tudo isso para você focar no que realmente importa:{' '}
          <strong>fazer a sua empresa crescer.</strong>
        </motion.p>

        {/* CTAs — dois botões, hierarquia clara: primário (WhatsApp) e secundário */}
        <motion.div className={styles.actions} variants={fadeUp}>
          <Button
            variant="primary"
            size="lg"
            href="https://wa.me/556130324349"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={20} aria-hidden="true" />
            Falar com um contador
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="#servicos"
          >
            Ver nossos serviços
            <FiArrowRight size={18} aria-hidden="true" />
          </Button>
        </motion.div>

        {/* Stats — números de credibilidade
            Separados por linha divisória, entram depois dos CTAs (delay via stagger) */}
        <motion.div className={styles.stats} variants={fadeUp}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.statItem}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ---- Coluna direita: imagem com overlay ---- */}
      {/*
        motion.div com slideInRight: a coluna da foto entra pela direita
        simultaneamente ao conteúdo textual (animate="visible" simultâneo,
        não whileInView — Hero anima no carregamento, não no scroll).
        
        TODO: substituir src/assets/hero.png pela foto real do escritório
        quando as imagens forem fornecidas. Manter o overlay e o className.
      */}
      <motion.div
        className={styles.imageWrapper}
        variants={slideInRight}
        initial="hidden"
        animate="visible"
      >
        {/* Overlay colorido sobre a foto — cor do acento com opacidade
            Termo técnico: Color Overlay / Tinted Image
            Cria unidade visual entre foto e paleta da marca */}
        <div className={styles.imageOverlay} aria-hidden="true" />

        <img
          src={heroImg}
          alt="Escritório da Viali Assessoria Contábil em Brasília-DF"
          className={styles.image}
        />

        {/* Card flutuante de credibilidade — detalhe sobre a foto
            Termo técnico: Floating Card / Callout
            Cria profundidade visual e reforça um número de impacto */}
        {/* <motion.div
          className={styles.floatingCard}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.floatingCardValue}>9 anos</span>
          <span className={styles.floatingCardLabel}>cuidando do seu negócio</span>
        </motion.div> */}
      </motion.div>

    </section>
  )
}