// config/feature.js
/**
 * Feature Flags - Controle de funcionalidades em tempo real
 * 
 * Uma 'feature flag' (tambem chamada de 'feature toggle') é uma variavel
 * que liga ou desliga uma funcionalidade SEM precisar fazer novo deploy
 * voce apenas muda no .env e reinicia o container
 * 
 * padrão usado em empresas grandes para lançamentos graduais
 * e para desligar features com problemas em prod sem derrubar o sistema
 */

const features = {
    /**
     * CHATBOT_ENABLED - controla se o chatbot está ativo
     * 
     * como funciona:
     *  - Se CHATBOT_ENABLED=true no .env, chatbot ligado
     *  - Se CHATBOT_ENABLED=false no .env, chatbot desligado com retorno de mensagem amigavel
     *  - Se a variavel não existir no .env, padrão é TRUE (ligado)
     * 
     * process.env sempre retorna STRING, então comparo com a string 'false'
     * e não com o booleano false.
     */
    chatbot_enabled: process.env.CHATBOT_ENABLED !== 'false',
};

module.exports = features;

