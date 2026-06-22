/* ============================================================
   About Section v2 — Redesign assimétrico
   ============================================================
   Mudanças da v1:
   - Layout: de grid 1fr/1fr simétrico para 5fr/7fr assimétrico
   - Fotos reais: about.webp e about2.webp no lugar do card navy
   - Tipografia: headline em DM Serif Display
   - Animações: framer-motion whileInView no lugar de estático
   - Copy: focado em confiança e contabilidade como investimento
   - Valores: mantidos, reestilizados para paleta B2
   ============================================================ */

import { motion } from 'framer-motion'
import { FaShieldAlt, FaHandshake, FaRocket } from 'react-icons/fa'
import SectionTitle from '../ui/SectionTitle'
import aboutImg from '../../assets/about.webp'
import about2Img from '../../assets/about2.webp'
import {
  fadeUp,
  fadeIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  viewportConfig,
} from '../../lib/motionVariants'
import styles from './About.module.css'

/* ------------------------------------------------------------------
   Valores da empresa — 3 pilares de confiança
   Copy: o que o cliente GANHA ao contratar (não o que a empresa faz)
   ------------------------------------------------------------------ */
const VALUES = [
  {
    icon: <FaShieldAlt aria-hidden="true" />,
    title: 'Segurança',
    text: 'Registro ativo no CRC e total conformidade com a legislação — sua empresa protegida em qualquer fiscalização.',
  },
  {
    icon: <FaHandshake aria-hidden="true" />,
    title: 'Proximidade',
    text: 'Atendimento direto com o contador responsável, sem intermediários. Você sempre sabe com quem falar.',
  },
  {
    icon: <FaRocket aria-hidden="true" />,
    title: 'Resultado',
    text: 'Contabilidade como ferramenta de crescimento — não como obrigação. Planejamento que gera economia real.',
  },
]

export default function About() {
  return (
    <section id="sobre" className={`section ${styles.about}`}>
      <div className="container">

        <SectionTitle
          eyebrow="Nossa história"
          title="Contabilidade é"
          highlight="investimento, não custo"
          subtitle="Há 9 anos ajudamos empresas de Brasília a crescer com segurança, clareza e estratégia."
        />

        {/* ---- Layout assimétrico: fotos (5fr) | texto (7fr) ---- */}
        <div className={styles.content}>

          {/* Coluna esquerda: fotos empilhadas com desalinhamento intencional
              Termo técnico: Offset Stack / Broken Grid
              O desalinhamento cria tensão visual e profundidade sem 3D */}
          <motion.div
            className={styles.imageSide}
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Foto principal — maior, à esquerda */}
            <div className={styles.imageMain}>
              <img
                src={aboutImg}
                alt="Equipe Viali Assessoria Contábil atendendo clientes"
                className={styles.image}
              />
            </div>

            {/* Foto secundária — menor, deslocada para baixo e à direita
                Cria o efeito de profundidade/camadas */}
            <div className={styles.imageSecondary}>
              <img
                src={about2Img}
                alt="Escritório da Viali em Brasília-DF"
                className={styles.image}
              />
            </div>

            {/* Badge flutuante de credibilidade sobre as fotos */}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportConfig}
              transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.badgeValue}>+500</span>
              <span className={styles.badgeLabel}>empresas atendidas</span>
            </motion.div>
          </motion.div>

          {/* Coluna direita: texto */}
          <motion.div
            className={styles.textSide}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Parágrafos principais */}
            <motion.p className={styles.paragraph} variants={fadeUp}>
              A <strong>Viali Assessoria Contábil</strong> nasceu em Brasília com
              um propósito claro: transformar a contabilidade de um peso burocrático
              em uma vantagem competitiva real para o seu negócio.
            </motion.p>

            <motion.p className={styles.paragraph} variants={fadeUp}>
              Com mais de <strong>9 anos de experiência</strong> e registro ativo
              no CRC, nossa equipe domina todos os regimes tributários — Simples
              Nacional, Lucro Presumido e Lucro Real — e encontra a estratégia
              fiscal que mais economiza para cada perfil de empresa.
            </motion.p>

            {/* Números de credibilidade em linha
                Termo técnico: Inline Stats / Trust Indicators */}
            <motion.div className={styles.stats} variants={fadeUp}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>+200</span>
                <span className={styles.statLabel}>Empresas abertas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>9 anos</span>
                <span className={styles.statLabel}>De experiência</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>+500</span>
                <span className={styles.statLabel}>Clientes atendidos</span>
              </div>
            </motion.div>

            {/* Valores — 3 pilares */}
            <motion.div className={styles.values} variants={fadeUp}>
              {VALUES.map((value) => (
                <div key={value.title} className={styles.valueItem}>
                  <div className={styles.valueIcon}>{value.icon}</div>
                  <div>
                    <strong className={styles.valueTitle}>{value.title}</strong>
                    <p className={styles.valueText}>{value.text}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}