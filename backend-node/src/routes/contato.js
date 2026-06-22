// routes/contato.js
// rota POST /contato - captura lead do formulario
// mesma coisa que uma FormView com post_save signal no django

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { salvarConversa } = require('../services/cosmosdb'); // reutilizo o mesmo servico
const {
    enviarEmailNotificacaoEscritorio,
    enviarEmailConfirmacaoLead,
} = require('../services/email');

/**
 * valida os campos obrigatorios do formulario
 * retorna array de erros (vazio se tudo ok)
 */

function validarDadosContato(dados) {
    const erros = [];

    if (!dados.nome || dados.nome.trim().length < 2) {
        erros.push('Nome é obrigatório (mínimo 2 caracteres)');
    }

    // regex simples de validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!dados.email || !emailRegex.test(dados.email)) {
        erros.push('Email inválido');
    }

    if (!dados.mensagem || dados.mensagem.trim().length < 10) {
        erros.push('Mensagem é obrigatória (mínimo 10 caracteres)');
    }
    
    return erros;
}

// POST /api/contato
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, servico_interesse, mensagem, cnpj } = req.body;

        // 1. VALIDACAO - verifica se campos obrigatorios antes de qualquer operação
        const erros = validarDadosContato({ nome, email, mensagem });
        if (erros.length > 0) {
            // 400 Bad request - dado invalido enviado pelo cliente
            return res.status(400).json({
                status: 'erro',
                erros,
            });
        }

        // 2. monta o documento do lead para salvar no cosmos DB
        const lead = {
            id: uuidv4(), // identificador unico
            tipo: 'lead', // diferencia de 'conversa' na mesma collection
            timestamp: new Date().toISOString(),
            nome: nome.trim(),
            email: email.trim().toLowerCase(), // normaliza email
            telefone: telefone?.trim() || null,
            servico_interesse: servico_interesse || 'nao_informado',
            mensagem: mensagem.trim(),
            cnpj: cnpj?.replace(/\D/g, '') || null, // salva só os numeros do cnpj
            status: 'novo', // workflow: novo -> em_atendimento -> fechado
        };

        // 3. salva no cosmos DB
        // pego a função salvarCnversa do cosmosdb.js
        // em evolução, farei salvarLead() numa collection separada
        await salvarConversa(lead, process.env.COSMOS_DB_CONTAINER_LEADS || 'leads');

        console.log(`Novo lead salvo | ${lead.nome} | ${lead.email} | ${lead.servico_interesse}`);

        // 4. envia emails (fire-and-forget com Promise.allSettled)
        // Promise.allSettled espera ambos terminarem, mas NÂO falha se m der erro
        // diferetne do Promise.all que falha tudo se um falhar
        // assim, se o email falhar, o lead ainda é salvo e o usuario recebe sucessp
        const [emailEscritorio, emailLead] = await Promise.allSettled([
            enviarEmailNotificacaoEscritorio(lead),
            enviarEmailConfirmacaoLead(lead),
        ]);

        // loga resultado dos emails sem quebrar o fluxo
        if (emailEscritorio.status === 'rejected') {
            console.error('Falha ao enviar email pro escritório: ', emailEscritorio.reason);
        }
        if (emailLead.status === 'rejected') {
            console.error('Falha ao enviar email de confirmação pro lead: ', emailLead.reason);
        }

        // 5. responde ao frontend com sucesso
        return res.status(201).json({
            status: 'ok',
            mensagem: 'Contato recebido com sucesso! Retornaremos em breve.',
            leadId: lead.id,
            emailEnviado: emailEscritorio.status === 'fulfilled',
        });
    } catch (erro) {
        console.error('Erro inesperado na rota /contato: ', erro);
        return res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno ao processar contato.',
        });
    }
});

module.exports = router;