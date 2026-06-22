/* ============================================================
   Header v2 — Cabeçalho fixo com glassmorphism ao scroll
   ============================================================
   Mudanças da v1:
   - Paleta: de navy escuro para surface/creme (paleta B2)
   - Glassmorphism: ao scrollar, backdrop-filter blur + rgba
   - Menu: adicionado item "Quem Somos" entre Sobre e Contato
   - Animação: entrada com framer-motion (fadeIn de cima)
   - Logo: alinhada à esquerda sem padding extra
   ============================================================ */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import useScrolled from '../../hooks/useScrolled'
import Button from '../ui/Button'
import logoViali from '../../assets/images/logo_viali.webp'
import styles from './Header.module.css'

/* ------------------------------------------------------------------
   Links de navegação — array estático, fácil de manter.
   "Quem Somos" adicionado entre Sobre e Contato (Decisão 8 do roadmap).
   ------------------------------------------------------------------ */
const NAV_LINKS = [
  { label: 'Início',      href: '#inicio'     },
  { label: 'Serviços',    href: '#servicos'   },
  { label: 'Sobre',       href: '#sobre'      },
  { label: 'Quem Somos',  href: '#quem-somos' },
  { label: 'Contato',     href: '#contato'    },
]

/* ------------------------------------------------------------------
   Variantes framer-motion — entrada da navbar de cima para baixo
   Termo técnico: Mount Animation / Entry Animation
   ------------------------------------------------------------------ */
const headerVariants = {
  hidden:  { opacity: 0, y: -16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

/* Variantes do menu mobile — slide da direita
   Termo técnico: Slide-in Animation com AnimatePresence
   AnimatePresence permite animar a saída do componente (unmount) */
const mobileMenuVariants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  /* useScrolled — hook existente, retorna true após 50px de scroll
     Termo técnico: Custom Hook / Side Effect Hook */
  const scrolled = useScrolled(50)

  const handleLinkClick = () => setMenuOpen(false)

  return (
    /* motion.header — framer-motion anima a entrada do header no mount
       Termo técnico: Mount Animation */
    <motion.header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`container ${styles.headerInner}`}>

        {/* ---- Logo — alinhada à esquerda, sem padding lateral extra ---- */}
        <a href="#inicio" className={styles.logo} aria-label="Viali — Voltar ao início">
          <img
            src={logoViali}
            alt="Viali Assessoria Contábil"
            className={styles.logoImg}
          />
        </a>

        {/* ---- Navegação Desktop ---- */}
        <nav className={styles.nav} aria-label="Navegação principal">
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.navLink}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- CTA Desktop ---- */}
        <div className={styles.cta}>
          <Button
            variant="primary"
            size="sm"
            href="https://wa.me/556130324349"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale Conosco
          </Button>
        </div>

        {/* ---- Hamburger (só mobile) ---- */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
        </button>
      </div>

      {/* ---- Menu Mobile com AnimatePresence ---- */}
      {/*
        AnimatePresence: permite que o framer-motion anime a SAÍDA
        do componente antes de removê-lo do DOM.
        Termo técnico: Exit Animation / Unmount Animation
      */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.nav
              id="mobile-menu"
              className={styles.mobileMenu}
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Menu mobile"
            >
              <ul className={styles.mobileNavList}>
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={styles.mobileNavLink}
                      onClick={handleLinkClick}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className={styles.mobileCta}>
                  <Button
                    variant="primary"
                    fullWidth
                    href="https://wa.me/556130324349"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Fale Conosco
                  </Button>
                </li>
              </ul>
            </motion.nav>

            {/* Overlay atrás do menu mobile — também animado */}
            <motion.div
              className={styles.overlay}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}