/* ============================================================
   BlogPage — Página do blog (SCAFFOLDING)
   ============================================================
   Termo técnico: Page Component / Route Component
   Este arquivo é um stub — existe para definir o contrato
   da rota futura sem implementar nada ainda.

   Como ativar futuramente:
   1. Instalar react-router-dom:
      docker compose exec frontend npm install react-router-dom

   2. Envolver App.jsx com BrowserRouter:
      import { BrowserRouter, Routes, Route } from 'react-router-dom'
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
      </BrowserRouter>

   3. Implementar a listagem de artigos aqui usando o array
      de src/data/articles.js (ou fetch de uma API/CMS).

   4. Criar BlogPostPage.jsx para o detalhe de cada artigo.

   Analogia Django:
   - BlogPage → ListView (lista todos os artigos)
   - BlogPostPage → DetailView (detalhe de um artigo pelo slug)
   - articles.js → queryset / fixture de dados
   ============================================================ */

export default function BlogPage() {
  /* TODO: buscar artigos de src/data/articles.js ou de uma API */
  /* TODO: implementar listagem com ArticlesCarousel ou grid próprio */
  /* TODO: adicionar SEO (meta tags, og:title) por artigo */

  return (
    <div>
      <h1>Blog — em breve</h1>
      {/* Implementar quando o blog for ao ar */}
    </div>
  )
}