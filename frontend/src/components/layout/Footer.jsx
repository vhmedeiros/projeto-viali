/* ============================================================
   Footer v2 — Rodapé com mapa e crédito
   ============================================================
   Conteúdo:
   - Coluna esquerda: logo + tagline + links rápidos
   - Coluna direita: embed Google Maps com lazy load
   - Linha inferior: copyright + crédito discreto

   Termo técnico:
   - Iframe embed: elemento HTML que carrega conteúdo externo
     (aqui o Google Maps) sem API key — usa o link de embed público.
   - loading="lazy": atributo nativo HTML que adia o carregamento
     do iframe até ele entrar na viewport.
     Analogia Django: é como um {% lazy_load %} no template.
   ============================================================ */

import { motion } from 'framer-motion'
import logoViali from '../../assets/images/logo_viali.webp'
import { fadeUp, staggerContainer, viewportConfig } from '../../lib/motionVariants'
import styles from './Footer.module.css'

/* Links rápidos — espelham o menu do Header */
const QUICK_LINKS = [
  { label: 'Início',      href: '#inicio'     },
  { label: 'Serviços',    href: '#servicos'   },
  { label: 'Sobre',       href: '#sobre'      },
  { label: 'Quem Somos',  href: '#quem-somos' },
  { label: 'Contato',     href: '#contato'    },
]

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ---- Corpo do footer: logo/links + mapa ---- */}
      <div className={`container ${styles.body}`}>

        {/* Coluna esquerda: logo + tagline + links */}
        <motion.div
          className={styles.brand}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <motion.a href="#inicio" className={styles.logoLink} variants={fadeUp}>
            <img
              src={logoViali}
              alt="Viali Assessoria Contábil"
              className={styles.logo}
            />
          </motion.a>

          <motion.p className={styles.tagline} variants={fadeUp}>
            Contabilidade inteligente para empresas que querem crescer com
            segurança em Brasília-DF.
          </motion.p>

          {/* Links rápidos */}
          <motion.nav
            aria-label="Links rápidos do rodapé"
            variants={fadeUp}
          >
            <ul className={styles.linkList}>
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>

        {/* Coluna direita: Google Maps embed
            Termo técnico: Responsive Iframe — padding-top trick
            mantém proporção 16:9 do mapa em qualquer largura.
            loading="lazy" — carrega só quando o footer entra na tela. */}
        <motion.div
          className={styles.mapWrapper}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4549.023630470504!2d-47.913571724181864!3d-15.794671784845804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a308db8f48f2d%3A0x7d26d57b3f061d8f!2sViali%20Assessoria%20Contabil!5e1!3m2!1spt-BR!2sus!4v1782083600079!5m2!1spt-BR!2sus"
            className={styles.map}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização da Viali Assessoria Contábil — SIG Quadra 01 Sala 112, Brasília-DF"
            allowFullScreen
          />
        </motion.div>

      </div>

      {/* ---- Linha inferior: copyright + crédito ---- */}
      <div className={styles.bottom}>
        <div className="container">
          <div className={styles.bottomInner}>
            <span className={styles.copyright}>
              © {CURRENT_YEAR} Viali Assessoria Contábil. Todos os direitos reservados.
            </span>

            {/* Crédito discreto — conforme decisão do roadmap
                target="_blank" + rel="noopener noreferrer" — boa prática
                para links externos (segurança + performance) */}
            <a
              href="https://vhmedeiros.dev.br"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.credit}
            >
              Desenvolvido por VH.Medeiros
            </a>
          </div>
        </div>
      </div>

    </footer>
  )
}