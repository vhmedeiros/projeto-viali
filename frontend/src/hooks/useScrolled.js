/* ============================================================
   useScrolled — Custom Hook que detecta se o usuário scrollou
   ============================================================
   Termo técnico: Custom Hook
   
   Analogia Django: é como um "mixin" de view — lógica reutilizável
   que você importa onde precisar.
   
   No React, hooks customizados SEMPRE começam com "use".
   Isso é uma convenção obrigatória (o React usa isso internamente).
   
   Por que precisamos disso?
   O header muda de visual quando o usuário faz scroll:
   - No topo: pode ser transparente ou sem sombra
   - Após scroll: ganha sombra e fundo sólido (visual "grudado")
   ============================================================ */

import { useState, useEffect } from 'react';

/**
 * Retorna `true` quando o usuário scrollou mais que `threshold` pixels.
 * 
 * @param {number} threshold - quantidade de pixels para ativar (padrão: 50)
 * @returns {boolean} - true se scrollou além do threshold
 * 
 * Exemplo de uso:
 *   const scrolled = useScrolled(50);
 *   // scrolled === true quando window.scrollY > 50
 */
export default function useScrolled(threshold = 50) {
  // useState: guarda o estado "scrollou ou não"
  // Analogia Django: é como uma variável de contexto que o template observa
  const [scrolled, setScrolled] = useState(false);

  // useEffect: executa código quando o componente monta/desmonta
  // Analogia Django: é como o __init__ de uma view — roda na inicialização
  useEffect(() => {
    // Função que será chamada a cada evento de scroll
    const handleScroll = () => {
      // window.scrollY = quantos pixels o usuário scrollou verticalmente
      setScrolled(window.scrollY > threshold);
    };

    // Registra o listener de scroll no window
    window.addEventListener('scroll', handleScroll, { passive: true });
    // passive: true = diz ao browser que não vamos chamar preventDefault()
    // Isso melhora a performance de scroll (o browser não precisa esperar)

    // Cleanup: remove o listener quando o componente desmonta
    // Analogia Django: é como fechar uma conexão no __del__
    // Sem isso, teríamos memory leak (o listener ficaria ativo eternamente)
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]); // Array de dependências: re-executa se threshold mudar

  return scrolled;
}
