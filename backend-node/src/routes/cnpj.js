// routes/cnpj.js
// rota GET /api/cnpj/:cnpj - consulta dados de empresa na API pública
// padrão: API Proxy / BFF (Backend For Frontend)
// analogia Django: uma view que faz requests.get() e retorna JsonResponse()

const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL base da API pública de CNPJ
const CNPJ_API_BASE = 'https://publica.cnpj.ws/cnpj';

/**
 * Headers que imitam um navegador real
 * sem isso, o Cloudflare (CDN na frente da API) bloqueia ou dá timeout
 * isso se chama "request spoofing" — prática comum ao consumir APIs públicas
 * 
 * por que funciona? o Cloudflare verifica:
 * 1. User-Agent — identifica o "navegador"
 * 2. Accept — formato esperado da resposta
 * 3. Accept-Language — idioma
 * se esses headers estiverem vazios ou forem de um bot, ele bloqueia
 */
const HEADERS_NAVEGADOR = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
};

/**
 * Remove tudo que não é número do CNPJ
 * entrada: "12.345.678/0001-90" ou "12345678000190"
 * saída:   "12345678000190"
 *
 * "input sanitization" — limpar o dado antes de usar
 * no Django: clean() do Form ou validate() do Serializer
 */
function limparCnpj(cnpj) {
  return cnpj.replace(/\D/g, '');
}

/**
 * Validação básica de CNPJ (formato, não verifica dígitos verificadores)
 * recebe o CNPJ já limpo (só números)
 */
function validarFormatoCnpj(cnpjLimpo) {
  if (cnpjLimpo.length !== 14) return false;
  // rejeita CNPJs com todos os dígitos iguais
  if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
  return true;
}

/**
 * Formata os dados brutos da API para um formato limpo pro frontend
 * padrão: DTO (Data Transfer Object) / Response Shaping
 * 
 * por que não devolver o JSON cru da API?
 * 1. a API externa pode mudar a estrutura sem aviso
 * 2. o frontend só precisa de alguns campos
 * 3. padroniza o formato de resposta da NOSSA API
 */
function formatarDadosEmpresa(dados) {
  const estabelecimento = dados.estabelecimento || {};
  const cidade = estabelecimento.cidade || {};
  const estado = estabelecimento.estado || {};

  return {
    cnpj: estabelecimento.cnpj || null,
    razao_social: dados.razao_social || null,
    nome_fantasia: estabelecimento.nome_fantasia || null,
    situacao_cadastral: estabelecimento.situacao_cadastral || null,
    natureza_juridica: dados.natureza_juridica?.descricao || null,
    capital_social: dados.capital_social || null,
    porte: dados.porte?.descricao || null,
    endereco: {
      tipo_logradouro: estabelecimento.tipo_logradouro || null,
      logradouro: estabelecimento.logradouro || null,
      numero: estabelecimento.numero || null,
      complemento: estabelecimento.complemento || null,
      bairro: estabelecimento.bairro || null,
      cep: estabelecimento.cep || null,
      cidade: cidade.nome || null,
      estado: estado.sigla || null,
    },
    contato: {
      telefone: estabelecimento.ddd1 && estabelecimento.telefone1
        ? `(${estabelecimento.ddd1}) ${estabelecimento.telefone1}`
        : null,
      email: estabelecimento.email || null,
    },
    atividade_principal: estabelecimento.atividade_principal
      ? {
          codigo: estabelecimento.atividade_principal.subclasse,
          descricao: estabelecimento.atividade_principal.descricao,
        }
      : null,
    data_inicio_atividade: estabelecimento.data_inicio_atividade || null,
    situacao_especial: estabelecimento.situacao_especial || null,
  };
}

/**
 * Lógica central de consulta — reutilizada pelas duas rotas
 * isso se chama "service function" ou "handler compartilhado"
 * evita duplicação de código (DRY — Don't Repeat Yourself)
 */
async function consultarCnpj(cnpjRaw, res) {
  // 1. SANITIZAÇÃO
  const cnpjLimpo = limparCnpj(cnpjRaw);

  // 2. VALIDAÇÃO
  if (!validarFormatoCnpj(cnpjLimpo)) {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'CNPJ inválido. Informe 14 dígitos numéricos.',
      exemplo: '/api/cnpj/12345678000190',
    });
  }

  console.log(`Consultando CNPJ: ${cnpjLimpo}`);

  // 3. CHAMA A API EXTERNA
  let respostaApi;
  try {
    respostaApi = await axios.get(`${CNPJ_API_BASE}/${cnpjLimpo}`, {
      timeout: 15000, // 15 segundos — API pública pode ser lenta
      headers: HEADERS_NAVEGADOR, // headers de browser para passar pelo Cloudflare
    });
  } catch (erroApi) {
    // trata erros específicos da API externa
    if (erroApi.response) {
      const statusCode = erroApi.response.status;

      if (statusCode === 404) {
        return res.status(404).json({
          status: 'erro',
          mensagem: 'CNPJ não encontrado na base da Receita Federal.',
        });
      }

      if (statusCode === 429) {
        console.warn('Rate limit da API de CNPJ atingido');
        return res.status(429).json({
          status: 'erro',
          mensagem: 'Muitas consultas em pouco tempo. Aguarde 1 minuto e tente novamente.',
        });
      }

      // 403 = Cloudflare bloqueou
      if (statusCode === 403) {
        console.warn('Cloudflare bloqueou a requisição');
        return res.status(503).json({
          status: 'erro',
          mensagem: 'Serviço de consulta temporariamente indisponível. Tente novamente em instantes.',
        });
      }

      console.error(`API de CNPJ retornou status ${statusCode}`);
      return res.status(502).json({
        status: 'erro',
        mensagem: 'Serviço de consulta de CNPJ temporariamente indisponível.',
      });
    }

    if (erroApi.code === 'ECONNREFUSED' || erroApi.code === 'ETIMEDOUT') {
      console.error(`Erro de conexão com API de CNPJ: ${erroApi.code}`);
      return res.status(503).json({
        status: 'erro',
        mensagem: 'Não foi possível conectar ao serviço de consulta de CNPJ.',
      });
    }

    // timeout do axios (diferente do ETIMEDOUT do SO)
    if (erroApi.code === 'ECONNABORTED') {
      console.error('Timeout ao consultar API de CNPJ');
      return res.status(504).json({
        status: 'erro',
        mensagem: 'Consulta de CNPJ demorou demais. Tente novamente.',
      });
    }

    console.error('Erro ao consultar CNPJ:', erroApi.message);
    return res.status(500).json({
      status: 'erro',
      mensagem: 'Erro ao consultar CNPJ.',
    });
  }

  // 4. FORMATA — DTO pattern
  const dadosFormatados = formatarDadosEmpresa(respostaApi.data);

  // 5. RETORNA resposta padronizada
  return res.status(200).json({
    status: 'ok',
    dados: dadosFormatados,
  });
}

// ============================================================
// ROTAS
// ============================================================

/**
 * GET /api/cnpj/:cnpj
 * Rota principal — CNPJ como path parameter (só números)
 * ex: GET /api/cnpj/00776574000660
 */
router.get('/:cnpj', async (req, res) => {
  try {
    return await consultarCnpj(req.params.cnpj, res);
  } catch (erro) {
    console.error('Erro inesperado na rota /cnpj:', erro);
    return res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno ao consultar CNPJ.',
    });
  }
});

/**
 * GET /api/cnpj?q=00.776.574/0006-60
 * Rota alternativa — CNPJ como query parameter (aceita formatado)
 * útil quando o CNPJ tem barras que quebrariam o path
 */
router.get('/', async (req, res) => {
  const cnpjRaw = req.query.q;

  if (!cnpjRaw) {
    return res.status(400).json({
      status: 'erro',
      mensagem: 'Informe o CNPJ. Use /api/cnpj/12345678000190 ou /api/cnpj?q=12345678000190',
    });
  }

  try {
    return await consultarCnpj(cnpjRaw, res);
  } catch (erro) {
    console.error('Erro inesperado na rota /cnpj (query):', erro);
    return res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno ao consultar CNPJ.',
    });
  }
});

module.exports = router;
