// chat.js
// responsabilidades: rota POST /api/chat - recebe pergunta, chama Python, salva no Cosmos

const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { salvarConversa } = require('../services/cosmosdb');

const router = express.Router();

// url do serviço python (definida no docker-compose)
// dentro da rede Docker, os containers se comunicam pelo nome do serviço
// "backend-python" é o nome do serviço no docker-compose.yml
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://backend-python:8001';

// POST /api/chat
// Body esperado: { pergunta: string, sessionId?: string }
router.post('/', async (req, res) => {
    const inicio = Date.now(); // para medir o tempo de resposta

    try {
        // 1. extrai e valida os dados do body
        const { pergunta } = req.body;
        let sessionId = req.body.sessionId || uuidv4();

        if (!pergunta || typeof pergunta !== 'string' || pergunta.trim() === '') {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Campo "pergunta" é obrigatório e deve ser uma string não vazia',
            });
        }

        // limita o tamanho da pergunta para evitar abusos
        if (pergunta.length > 1000) {
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Pergunta muito longa. Máximo de 1000 caracteres.',
            });
        }

        // 2. verifica se o chatbot está ativado (feature flag)
        // reutilizo a mesma logica do health check
        const chatbotAtivo = process.env.CHATBOT_ENABLED !== 'false';

        if (!chatbotAtivo) {
            return res.status(503).json({
                status: 'erro',
                mensagem: 'Chatbot temporariamente desativo',
            });
        }

        // 3. Gera ou reutiliza o sessionId
        // o sessionId agrupa todas as mensagens de uma mesma conversa
        // const sessionId = sessionId || uuidv4();

        console.log(`Nova pergunta recebida | sessão: ${sessionId}`);
        console.log(`Pergunta: "${pergunta.substring(0, 100)}..."`);

        // 4. chama o serviço Python via HTTP
        // o python vai processa o RAG e chamar a Azure OpenAI
        // axios.post() é o mesmo que resquest.post() do python
        let respostaPython;

        try {
            respostaPython = await axios.post(
                `${PYTHON_SERVICE_URL}/chat`, // endpoint no FastAPI
                {
                    pergunta: pergunta.trim(),
                    session_id: sessionId,
                },
                {
                    timeout: 30000, // 30 secs - LLMs podem demorar
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } catch (erroPython) {
            // trata diferentes tipos de erro de comunicação com o pyhon
            if (erroPython.code === 'ECONNREFUSED') {
                console.error('Python service não está respondendo');
                return res.status(503).json({
                    status: 'erro',
                    mensagem: 'Serviço de IA temporariamente indisponível.',
                    detalhe: process.env.NODE_ENV === 'development' ? 'Python service ECONNREFUSED' : undefined,
                });
            }

            if (erroPython.code === 'ETIMEDOUT' || erroPython.message.includes('timeout')) {
                console.error('Python service timeout');
                return res.status(504).json({
                    status: 'erro',
                    mensagem: 'Serviço de IA demorou demais para responder. Tente novamente.',
                });
            }

            // erro generico do `ython (ex: 500 interno)
            console.error('Erro no Python service: ', erroPython.message);
            return res.status(502).json({
                status: 'erro',
                mensagem: 'Erro ao processar sua pergunta.',
                detalhe: process.env.NODE_ENV === 'development' ? erroPython.message : undefined,
            });
        }
        // 5. extrai a resposta do python
        const { resposta, servico_relacionado, fontes } = respostaPython.data;

        const tempoResposta = Date.now() - inicio;
        console.log(`Resposta Recebida do Python em ${tempoResposta}ms`);

        // 6. salva a conversa no cosmos DB (assincrono, não bloqueia)
        // usamos .then/.catch em vez de await para não atrasar a resposta
        // o usuario recebe a resposta imediamente, o banco salva em paralelo
        // isso se chama "fire and forget" - disparar e esquecer
        salvarConversa({
            id: uuidv4(),
            sessionId: sessionId,
            pergunta: pergunta.trim(),
            resposta,
            servico_relacionado: servico_relacionado || 'geral',
            tempo_resposta_ms: tempoResposta,
            fontes: fontes || [],
        }).catch(err => {
            // erro no banco não deve derrubar a resposta do usuario
            console.error('Falha silenciosa ao salvar conversa: ', err.message);
        });

        // 7. Retorna a resposta para o frontend
        return res.status(200).json({
            status: 'ok',
            sessionId: sessionId, // frontend deve guardar para prox mensagens
            resposta,
            servico_relacionado: servico_relacionado || 'geral',
            tempo_resposta_ms: tempoResposta,
        });
    } catch (erro) {
        // erro inesperado - não deveria chegar aqui em condições normais
        console.error('Erro inesperado na rota /chat: ', erro);
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno do servidor',
            detalhe: process.env.NODE_ENV === 'development' ? erro.message : undefined,
        });
    }
});

module.exports = router;