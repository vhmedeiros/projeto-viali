/* ============================================================
   Formatadores — funções puras para formatar dados de exibição
   ============================================================
   Termo técnico: Pure Functions / Utility Functions
   São funções sem side effects — dado o mesmo input, sempre
   retornam o mesmo output. Fáceis de testar.
   ============================================================ */

/** 
 * Formata CNPJ: 12345678000199 → 12.345.678/0001-99 
 */
export function formatCNPJ(cnpj) {
  const limpo = cnpj.replace(/\D/g, '');
  return limpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Formata CEP: 70610410 → 70610-410
 */
export function formatCEP(cep) {
  const limpo = cep.replace(/\D/g, '');
  return limpo.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Formata telefone: 6130324349 → (61) 3032-4349
 */
export function formatTelefone(tel) {
  const limpo = tel.replace(/\D/g, '');
  if (limpo.length === 10) {
    return limpo.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  }
  if (limpo.length === 11) {
    return limpo.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }
  return tel;
}

/**
 * Gera um ID de sessão único para o chatbot.
 * Termo técnico: UUID v4 (simplificado)
 */
export function gerarSessionId() {
  return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Máscara de CNPJ para input — aplica formatação enquanto digita.
 * Usado em onChange de inputs.
 */
export function mascaraCNPJ(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

/**
 * Máscara de telefone para input
 */
export function mascaraTelefone(valor) {
  return valor
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    .slice(0, 15);
}
