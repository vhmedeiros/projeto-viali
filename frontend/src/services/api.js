/* ============================================================
   API Service — Centraliza TODAS as chamadas ao backend
   ============================================================
   Analogia Django: é como criar um "client" que faz requests
   para sua API, similar a usar requests.get() no Python.
   
   Termo técnico: API Client / Service Layer
   
   Por que centralizar?
   1. Se a URL base mudar, altero em UM lugar
   2. Tratamento de erros padronizado
   3. Fácil de testar e mockar
   ============================================================ */

// Base URL — em dev aponta pro container Docker, em prod aponta pro domínio
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Função auxiliar para fazer fetch com tratamento de erro padrão.
 * Equivale ao requests.get/post do Python, mas para o browser.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Se o backend retornou erro (4xx, 5xx), joga pro catch
      throw { status: response.status, ...data };
    }

    return data;
  } catch (error) {
    // Se é um erro do nosso backend, re-joga
    if (error.status) throw error;
    
    // Se é erro de rede (backend fora do ar)
    throw { 
      status: 0, 
      mensagem: 'Não foi possível conectar ao servidor. Tente novamente.' 
    };
  }
}

/* ============================================================
   Funções exportadas — uma para cada endpoint do backend
   ============================================================ */

/** Health check — testa se o backend está vivo */
export function healthCheck() {
  return request('/health');
}

/** Chatbot — envia pergunta e recebe resposta */
export function enviarPergunta(pergunta, sessionId) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ pergunta, sessionId }),
  });
}

/** Formulário de contato — envia lead */
export function enviarContato(dados) {
  return request('/contato', {
    method: 'POST',
    body: JSON.stringify(dados),
  });
}

/** Consulta CNPJ */
export function consultarCNPJ(cnpj) {
  // Remove pontuação do CNPJ antes de enviar
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return request(`/cnpj/${cnpjLimpo}`);
}

/** Consulta CEP */
export function consultarCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  return request(`/cep/${cepLimpo}`);
}
