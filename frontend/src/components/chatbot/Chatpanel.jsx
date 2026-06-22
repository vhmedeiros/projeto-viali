/* ============================================================
   ChatPanel — Painel do chat (OCULTO / estrutura apenas)
   ============================================================
   Estrutura básica sem lógica de API ainda.
   Quando CHATBOT_ENABLED = true, conectar ao POST /api/chat
   via src/services/api.js (enviarPergunta já existe).

   TODO (quando ativar):
   1. Conectar ao enviarPergunta() do api.js
   2. Gerenciar histórico de mensagens com useState
   3. Implementar scroll automático para última mensagem
   4. Adicionar indicador de "digitando..."
   ============================================================ */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend } from 'react-icons/fi'
import styles from './ChatPanel.module.css'

export default function ChatPanel({ isOpen, onClose }) {
  const [input, setInput] = useState('')

  /* TODO: substituir por estado real de mensagens quando ativar */
  const messages = []

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.panel}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-label="Chat de atendimento Viali"
        >
          {/* Cabeçalho */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <span className={styles.headerTitle}>Viali Atendimento</span>
              <span className={styles.headerSub}>Responderemos em instantes</span>
            </div>
            <button
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Fechar chat"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Área de mensagens */}
          <div className={styles.messages}>
            {messages.length === 0 && (
              <p className={styles.empty}>
                Olá! Como podemos ajudar sua empresa hoje?
              </p>
            )}
            {/* TODO: mapear messages quando ativar */}
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className={styles.input}
              /* TODO: onKeyDown Enter para enviar quando ativar */
            />
            <button
              className={styles.sendBtn}
              aria-label="Enviar mensagem"
              /* TODO: onClick handleSend quando ativar */
            >
              <FiSend size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}