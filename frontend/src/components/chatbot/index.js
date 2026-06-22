/* ============================================================
   chatbot/index.js — Entry point do módulo chatbot
   ============================================================
   Termo técnico: Feature Flag / Module Gate

   CHATBOT_ENABLED = false → componente importado mas não montado.
   Para ativar: mudar para true e descomentar no App.jsx.

   Analogia Django: como INSTALLED_APPS — o módulo existe
   mas só é "ligado" quando adicionado à lista.

   Como ativar futuramente:
   1. Mudar CHATBOT_ENABLED para true aqui
   2. No App.jsx descomentar:
      import { ChatButton, ChatPanel, CHATBOT_ENABLED } from './components/chatbot'
      {CHATBOT_ENABLED && <ChatButton onClick={() => setChatOpen(true)} />}
      {CHATBOT_ENABLED && <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />}
   3. Adicionar useState para chatOpen no App.jsx
   4. Implementar a lógica de API no ChatPanel.jsx
   ============================================================ */

export { default as ChatButton } from './ChatButton'
export { default as ChatPanel } from './ChatPanel'

/* Feature flag — mudar para true quando pronto para ativar */
export const CHATBOT_ENABLED = false