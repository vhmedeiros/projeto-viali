/* ============================================================
   ArticlesCarousel — Carrossel de artigos na home (SCAFFOLDING)
   ============================================================
   Termo técnico: Carousel / Slider Component
   Retorna null por enquanto — não renderiza nada na home.

   Props esperadas (quando implementar):
   @param {Array}  articles  — array de artigos (shape em data/articles.js)
   @param {string} title     — título da seção (ex: "Últimas do blog")

   Como encaixar na home (App.jsx):
     import ArticlesCarousel from './components/sections/ArticlesCarousel'
     import { articles } from './data/articles'
     // Dentro do <main>, após TeamSection:
     <ArticlesCarousel articles={articles.slice(0, 3)} title="No blog da Viali" />

   Sugestão de implementação futura:
   - Usar framer-motion para animação de slide (drag)
   - Termo técnico: Drag Carousel / Snap Scroll
   - Ou usar a lib "embla-carousel-react" (leve, zero dependências CSS)
   ============================================================ */

/* TODO: implementar o carrossel quando o blog for ao ar */

export default function ArticlesCarousel({ articles = [], title = '' }) {
  /* Retorna null enquanto não há artigos — não ocupa espaço na home */
  if (!articles.length) return null

  return null

  /* Estrutura futura (descomentar quando implementar):

  return (
    <section className={styles.section}>
      <div className="container">
        <SectionTitle eyebrow="Blog" title={title} />
        <div className={styles.carousel}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  )

  */
}