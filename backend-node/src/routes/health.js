// /routes/health.js
/**
 * Rota: GET /api/health
 * 
 * Aqui é a mesma coisa do Django, e padrão de qualidade
 * o proposito é ter um serviço que informe a 'saude' da aplicação e se está on ou não
 * retorna JSON com status, timestamp e informações de ambiente
 * 
 * No express, um "router" é como um mini-app isolado que cuida de um grupo de rotas.
 * É o mesmo que include() do django no urls.py - organiza as rotas em arquivos separados e registra no app principal
 */
const express = require('express');
const router = express.Router();
const features = require('../config/features');

/**
 * GET /api/health
 * 
 * express.Router() usa a mesma sintaxe para todos os metodos HTTP:
 *      router.get()    - mesmo que @app.route(methods=['GET]) do Django
 *      router.post()    - mesmo que @app.route(methods=['POST']) do Django
 *      router.put()    - mesmo que @app.route(methods=['PUT']) do Django
 *      router.delete()    - mesmo que @app.route(methods=['DELETE']) do Django
 * 
 * os parametros do callback são:
 *      req - obj da requisição (como o 'request' do Django)
 *      res - obj da resposta (como o 'HttpResponse' do Django)
 */

router.get('/', (req, res) => {
    /**
     * res.json() serializa o obj para JSON e envia como resposta
     * mesmo que o JsonResponse() do Django
     * automaticamente defino o Content-Type como application/json
     */
    res.status(200).json({
        // status geral do serviço
        status: 'ok',

        // nome do serviço - util quando ter varios microsserviços
        servico: 'viali-backend-node',

        // versao do ambiente node em exec
        versao_node: process.version,

        //ambiente atual (dev, prod)
        // NODE_ENV é uma convenção universal no ecosistema node
        ambiente: process.env.NODE_ENV || 'development',

        // timestamp ISO 8601 - formato padrão para APIs REST
        timestamp: new Date().toISOString(),

        // tempo que o processo está rodadndo, em secs
        // process.uptime() é nativo do node - não precisa de lib
        uptime_segundos: Math.floor(process.uptime()),

        // status das features - o frontend e monitoramento podem usar isso
        /// para saber o que está ativo sem precisar testar cada endpoint
        features: {
            chatbot: features.chatbot_enabled ? 'ativo' : 'inativo',
        },
    });
});

// exporta o router para ser usado no index.js
// mesma coisa que urlpatterns = [...] do django
module.exports = router;