/* ============================================================
   ChatButton — Botão flutuante do chatbot (OCULTO)
   ============================================================
   Termo técnico: Feature Flag — componente existe mas só
   renderiza quando CHATBOT_ENABLED = true no index.js.
   Analogia Django: settings.FEATURE_FLAGS['chatbot'] = False

   Posição: acima do botão WhatsApp (bottom: 92px)
   Cor: --color-accent (azul da marca)
   ============================================================ */

import { motion } from 'framer-motion'
import { FiMessageSquare } from 'react-icons/fi'
import styles from './ChatButton.module.css'

export default function ChatButton({ onClick }) {
  return (
    <motion.button
      className={styles.button}
      onClick={onClick}
      aria-label="Abrir chat de atendimento"
      /* Entrada com delay de 1.2s — depois do WhatsApp (1s) */
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiMessageSquare size={24} aria-hidden="true" />
    </motion.button>
  )
}