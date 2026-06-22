/* ============================================================
   WhatsAppButton — Botão flutuante de WhatsApp
   ============================================================
   Termo técnico: Floating Action Button (FAB)
   Fica fixo no canto inferior direito em todas as seções.
   Animação: entrada com delay de 1s + pulse contínuo sutil.
   ============================================================ */

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import styles from './WhatsAppButton.module.css'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/556130324349"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label="Falar pelo WhatsApp"
      /* Entrada: fadeIn após 1s de delay
         Termo técnico: Deferred Mount Animation — espera a página
         carregar antes de chamar atenção para o botão */
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      /* Hover: leve crescimento
         Termo técnico: Hover Micro-interaction */
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaWhatsapp size={28} aria-hidden="true" />

      {/* Pulse — anel que expande e some em loop
          Termo técnico: Pulse Ring Animation via CSS keyframe
          Feito em CSS puro pois é animação infinita — mais
          eficiente que framer-motion para loops contínuos */}
      <span className={styles.pulse} aria-hidden="true" />
    </motion.a>
  )
}