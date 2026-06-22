// routes/cep.js
// rota GET /api/cep/:cep - consulta endereço na API pública ViaCEP
// padrão: API Proxy / BFF (Backend For Frontend)
// analogia Django: uma view que faz requests.get('https://viacep.com.br/ws/...') 
//                  e retorna JsonResponse()

const express = require('express');
const axios = require('axios');
const router = express.Router();

// URL base da API ViaCEP
// a ViaCEP é gratuita, sem necessidade de cadastro ou API key
// formato: GET https://viacep.com.br/ws/{cep}/json/
// retorna JSON com logradouro, bairro, cidade, estado, etc.
const VIACEP_BASE = 'https://viacep.com.br/ws';

/**
 * Remove tudo que não é número do CEP
 * entrada: "70610-410" ou "70.610-410" ou "70610410"
 * saída:   "70610410"
 * 
 * mesma lógica do limparCnpj() — input sanitization
 * no Django: seria um método clean_cep() no Form
 */
function limparCep(cep) {
  return cep.replace(/\D/g, '');
}

/**
 * Valida formato do CEP
 * CEP brasileiro tem exatamente 8 dígitos
 * ex: 70610410 (SIG, Brasília-DF)
 * 
 * validação simples: só checa quantidade de dígitos
 * não existe validação de "dígito verificador" em CEP (diferente do CNPJ/CPF)
 * a verificação real é feita pela API ViaCEP ao consultar
 */
function validarFormatoCep(cepLimpo) {
  // CEP tem exatamente 8 dígitos
  if (cepLimpo.length !== 8) return false;

//   // rejeita CEPs com todos os dígitos iguais (00000000, 11111111, etc.)
//   if (/^(\d)\1{7}$/.test(cepLimpo)) return false;

    if (cepLimpo === '00000000') return false;

  return true;
}

/**
 * Formata os dados da ViaCEP para nosso padrão
 * padrão DTO (Data Transfer Object) — reshape dos dados
 * 
 * por que formatar? a ViaCEP retorna campos como "localidade" (que é cidade)
 * e "uf" (que é estado). Nosso frontend espera nomes mais claros.
 * além disso, se a ViaCEP mudar a estrutura, só precisamos ajustar aqui
 * 
 * a ViaCEP retorna:
 * {
 *   "cep": "70610-410",
 *   "logradouro": "SIG Quadra 1",
 *   "complemento": "",
 *   "unidade": "",
 *   "bairro": "Zona Industrial (Guará)",
 *   "localidade": "Brasília",    <-- "localidade" = cidade
 *   "uf": "DF",                  <-- "uf" = estado (sigla)
 *   "estado": "Distrito Federal", <-- nome completo do estado
 *   "regiao": "Centro-Oeste",
 *   "ibge": "5300108",
 *   "gia": "",
 *   "ddd": "61",
 *   "siafi": "9701"
 * }
 */
function formatarEndereco(dados) {
  return {
    cep: dados.cep || null,                       // "70610-410" (já vem formatado)
    logradouro: dados.logradouro || null,          // "SIG Quadra 1"
    complemento: dados.complemento || null,        // "" ou "de 1 a 200 - lado par"
    bairro: dados.bairro || null,                  // "Zona Industrial (Guará)"
    cidade: dados.localidade || null,              // "Brasília" (ViaCEP chama de "localidade")
    estado: dados.uf || null,                      // "DF" (sigla)
    estado_nome: dados.estado || null,             // "Distrito Federal" (nome completo)
    regiao: dados.regiao || null,                  // "Centro-Oeste"
    ibge: dados.ibge || null,                      // "5300108" (código IBGE - útil para integrações)
    ddd: dados.ddd || null,                        // "61" (DDD da cidade)
  };
}

// ============================================================
// ROTA PRINCIPAL
// ============================================================

/**
 * GET /api/cep/:cep
 * 
 * ":cep" é um route parameter — análogo a <str:cep> no Django urls.py
 * o frontend envia: GET /api/cep/70610410  ou  GET /api/cep/70610-410
 * ambos funcionam porque limpamos o input
 * 
 * fluxo:
 * 1. recebe o CEP do request
 * 2. limpa (remove traço/ponto)
 * 3. valida (8 dígitos)
 * 4. consulta ViaCEP
 * 5. formata resposta
 * 6. retorna JSON padronizado
 */
router.get('/:cep', async (req, res) => {
  try {
    const cepRaw = req.params.cep;

    // 1. SANITIZAÇÃO — remove tudo que não é número
    const cepLimpo = limparCep(cepRaw);

    // 2. VALIDAÇÃO — checa formato
    if (!validarFormatoCep(cepLimpo)) {
      return res.status(400).json({
        status: 'erro',
        mensagem: 'CEP inválido. Informe 8 dígitos numéricos.',
        exemplo: '/api/cep/70610410',
      });
    }

    console.log(`Consultando CEP: ${cepLimpo}`);

    // 3. CONSULTA API EXTERNA — ViaCEP
    // a ViaCEP é simples: não precisa de headers especiais nem API key
    // se o CEP não existir, ela retorna 200 com { "erro": true }
    // (sim, retorna 200 mesmo quando não encontra — design questionável da API,
    //  mas é assim que funciona. precisamos checar o body, não só o status)
    let respostaApi;
    try {
      respostaApi = await axios.get(`${VIACEP_BASE}/${cepLimpo}/json/`, {
        timeout: 10000, // 10 segundos (ViaCEP é rápida, mas deixamos margem)
      });
    } catch (erroApi) {
      // erro de rede/timeout — a ViaCEP saiu do ar ou não conectou
      if (erroApi.code === 'ECONNABORTED') {
        console.error('Timeout ao consultar ViaCEP');
        return res.status(504).json({
          status: 'erro',
          mensagem: 'Consulta de CEP demorou demais. Tente novamente.',
        });
      }

      if (erroApi.code === 'ECONNREFUSED' || erroApi.code === 'ETIMEDOUT') {
        console.error(`Erro de conexão com ViaCEP: ${erroApi.code}`);
        return res.status(503).json({
          status: 'erro',
          mensagem: 'Serviço de consulta de CEP indisponível no momento.',
        });
      }

      console.error('Erro ao consultar ViaCEP:', erroApi.message);
      return res.status(500).json({
        status: 'erro',
        mensagem: 'Erro ao consultar CEP.',
      });
    }

    // 4. VERIFICA SE O CEP EXISTE
    // ViaCEP retorna { "erro": true } com status 200 quando o CEP não é encontrado
    // isso é um padrão ruim da API — o correto seria retornar 404
    // por isso precisamos checar o body manualmente
    if (respostaApi.data.erro) {
      return res.status(404).json({
        status: 'erro',
        mensagem: 'CEP não encontrado. Verifique se o número está correto.',
      });
    }

    // 5. FORMATA — DTO pattern
    const enderecoFormatado = formatarEndereco(respostaApi.data);

    // 6. RETORNA resposta padronizada
    return res.status(200).json({
      status: 'ok',
      dados: enderecoFormatado,
    });

  } catch (erro) {
    // catch genérico — se algo inesperado aconteceu
    console.error('Erro inesperado na rota /cep:', erro);
    return res.status(500).json({
      status: 'erro',
      mensagem: 'Erro interno ao consultar CEP.',
    });
  }
});

module.exports = router;
