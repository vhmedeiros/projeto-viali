// services/email.js
// responsavel por enviar emails transacionais via Resend
// resend é equivalente ao django.core.mail, mas como serviço externo

const { Resend } = require('resend');

// instancia o cliente Resend com a API key do .env
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * envia email de notificação para o escritorio quando um lead chega
 * @param {Object} dadosLead - dados do formulario
 */
async function enviarEmailNotificacaoEscritorio(dadosLead) {
    const { nome, email, telefone, servico_interesse, mensagem, cnpj } = dadosLead;

    // monta o corpo do email em HTML simples
    const htmlBody = `
        <h2>Novo contato pelo site da Viali</h2>
        <table style="border-collapse: collapse; width: 100%;">
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Nome</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${nome}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Telefone</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${telefone || 'Não informado'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Serviço de Interesse</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${servico_interesse || 'Não informado'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>CNPJ</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${cnpj || 'Não informado'}</td>
            </tr>
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Mensagem</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd;">${mensagem || 'Nenhuma mensagem'}</td>
            </tr>
        </table>
        <p style="color: #666; margin-top: 16px;">
            Enviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
        </p>
    `;

    const resultado = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev', // em prod: noreply@viali.vhmedeiros.dev.br
        to: process.env.EMAIL_TO, // email do scritorio
        subject: `[Viali Site] Novo Contato: ${nome}`,
        html: htmlBody,
    });

    return resultado;
}

/**
 * envia email de confirmação para o lead (o cliente que preencheu o form)
 * @param {Object} dadosLead - dados do formulario
 */

async function enviarEmailConfirmacaoLead(dadosLead) {
    const { nome, email } = dadosLead;

    const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style=background-color: #0a1628; padding: 24px; text-align: center;">
                <h1 style="color: white; margin: 0;">Viali Assessoria Contábil</h1>
            </div>
            <div style="padding: 24px;">
                <h2 style="color: #0a1628;">Olá, ${nome}!</h2>
                <p>Recebemos o seu contato e em breve nossa equipe entrará em contato com você.</p>
                <p><strong>Horário de atendimento:</strong> Segunda a Sexta, 08:00 às 17:00</p>
                <p><strong>Telefone:</strong> (61) 3032-4349</p>
                <p><strong>Endereço:</strong> Centro Empresarial Parque Brasília,<br>
                SIG Quadra 01 Sala 112, Brasília - DF</p>
                <hr style="border: 1px solid #eee; margin: 24px 0;">
                <p style="color: #666; font-size: 12px;">
                    Este é um email automático, por favor, não responda.
                </p>
            </div>
        </div>
    `;

    const resultado = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev', // em prod: noreply
        to: email, // email do proprio lead
        subject: 'Viali Assessoria Contábil - Recebemos seu contato!',
        html: htmlBody,
    });

    return resultado;
}

module.exports = {
    enviarEmailNotificacaoEscritorio,
    enviarEmailConfirmacaoLead,

};