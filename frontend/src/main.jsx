/* ============================================================
   main.jsx — Ponto de entrada da aplicação React
   ============================================================
   Analogia Django: é como o manage.py + wsgi.py — é quem
   "liga" a aplicação e monta ela no HTML.
   
   StrictMode: modo de desenvolvimento do React que avisa sobre
   práticas ruins. Não afeta produção.
   ============================================================ */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Importa o CSS global ANTES de qualquer componente
// Isso garante que os design tokens estejam disponíveis para todos
import './styles/global.css';

import App from './App';

// Monta o React no elemento #root do index.html
// Analogia Django: é como o {% block content %} do base.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
