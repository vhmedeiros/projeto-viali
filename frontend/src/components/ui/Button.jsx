/* ============================================================
   Componente Button — Botão reutilizável com variantes
   ============================================================
   Analogia Django: é como um template tag customizado que você
   usa em qualquer template: {% button "Texto" variant="primary" %}
   
   Termo técnico: Component API Design / Props Interface
   ============================================================ */

import styles from './Button.module.css';

/**
 * Botão reutilizável com 3 variantes visuais.
 * 
 * @param {string} variant - 'primary' (dourado) | 'secondary' (azul) | 'outline' (borda)
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullWidth - se true, ocupa 100% da largura
 * @param {React.ReactNode} children - conteúdo do botão (texto, ícone, etc.)
 * @param {string} href - se passado, renderiza como <a> em vez de <button>
 * @param {object} rest - qualquer outro atributo HTML (onClick, type, disabled, etc.)
 */
export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  children, 
  href,
  className = '',
  ...rest 
}) {
  // Monta a lista de classes CSS dinamicamente
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  // Se tem href, renderiza como link (<a>). Senão, como <button>.
  // Termo técnico: Polymorphic Component
  if (href) {
    return (
      <a href={href} className={classNames} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} {...rest}>
      {children}
    </button>
  );
}
