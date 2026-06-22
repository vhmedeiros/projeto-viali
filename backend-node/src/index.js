const express = require('express');
const cors    = require('cors');
const app     = express();
const PORT    = process.env.PORT || 3000;

// ---------- MIDDLEWARES GLOBAIS ----------
app.use(cors());
app.use(express.json());

// ---------- ROTAS ----------
const healthRouter  = require('./routes/health');
const chatRouter    = require('./routes/chat');
const contatoRoutes = require('./routes/contato');
const cnpjRouter    = require('./routes/cnpj');
const cepRoutes     = require('./routes/cep');

app.use('/api/health',  healthRouter);
app.use('/api/chat',    chatRouter);
app.use('/api/contato', contatoRoutes);
app.use('/api/cnpj',    cnpjRouter);
app.use('/api/cep',     cepRoutes);

// ---------- CATCH-ALL: ROTA NÃO ENCONTRADA ----------
// middleware que captura qualquer requisição que não bateu com nenhuma rota acima
// precisa estar DEPOIS de todas as rotas e ANTES do app.listen()
//
// sem isso, o Express retorna HTML padrão: "<pre>Cannot GET /xyz</pre>"
// como nossa API é 100% JSON, queremos retornar JSON sempre
//
// analogia Django: handler404 no urls.py
app.use((req, res) => {
  res.status(404).json({
    status: 'erro',
    mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    dica: 'Confira a documentação da API em GET /api/health',
  });
});

// ---------- ERROR HANDLER GLOBAL ----------
// captura erros não tratados (ex: JSON malformado no body)
// PRECISA ter 4 parâmetros (err, req, res, next) — é assim que o Express
// identifica que é um error handler e não um middleware normal
//
// analogia Django: middleware de exception handling
// analogia Python: bloco try/except genérico
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // erro de JSON malformado no body (ex: PowerShell mandou aspas erradas)
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'JSON inválido no corpo da requisição. Verifique a formatação.',
      dica: 'O body deve ser um JSON válido. Ex: {"pergunta": "Olá"}',
    });
  }

  // qualquer outro erro não tratado
  console.error('Erro não tratado:', err.message);
  return res.status(500).json({
    status: 'erro',
    mensagem: 'Erro interno do servidor.',
  });
});

// ---------- INICIAR SERVIDOR ----------
app.listen(PORT, () => {
  console.log(`Node.js rodando de boa na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Chatbot: ${process.env.CHATBOT_ENABLED !== 'false' ? 'ATIVO' : 'INATIVO'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
