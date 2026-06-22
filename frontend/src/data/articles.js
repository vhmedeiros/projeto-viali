/* ============================================================
   articles.js — Shape dos artigos do blog (SCAFFOLDING)
   ============================================================
   Termo técnico: Data Schema / Type Contract
   Define o formato de cada artigo — como um Model do Django
   mas em JavaScript puro.

   Quando o blog for ao ar:
   - Opção A (simples): popular este array manualmente
   - Opção B (CMS): substituir por fetch do Contentful, Sanity, etc.
   - Opção C (backend): criar rota GET /api/blog no Node e buscar do Cosmos DB

   Shape de cada artigo:
   {
     id:         string  — identificador único (ex: "abertura-empresa-2024")
     title:      string  — título do artigo
     excerpt:    string  — resumo curto (usado nos cards da home e listagem)
     slug:       string  — URL amigável (ex: "como-abrir-empresa-brasilia")
     date:       string  — data de publicação ISO (ex: "2024-03-15")
     category:   string  — categoria (ex: "Tributário", "Trabalhista", "Gestão")
     coverImage: string  — caminho da imagem de capa (ex: "/blog/capa-01.jpg")
     author:     string  — nome do autor (ex: "Adriano Viali")
     readTime:   number  — tempo de leitura em minutos
   }
   ============================================================ */

export const articles = [
  /* Exemplos comentados — descomentar e preencher quando publicar:

  {
    id: 'simples-nacional-2024',
    title: 'Simples Nacional em 2024: o que mudou e como afeta sua empresa',
    excerpt: 'As alterações nas faixas de faturamento e alíquotas do Simples Nacional podem reduzir (ou aumentar) sua carga tributária. Entenda o impacto.',
    slug: 'simples-nacional-2024-mudancas',
    date: '2024-03-15',
    category: 'Tributário',
    coverImage: '/blog/simples-nacional-2024.jpg',
    author: 'Adriano Viali',
    readTime: 5,
  },
  {
    id: 'abertura-empresa-brasilia',
    title: 'Como abrir uma empresa em Brasília: passo a passo completo',
    excerpt: 'Do CNPJ ao alvará de funcionamento — tudo que você precisa saber para abrir sua empresa no DF sem dor de cabeça.',
    slug: 'como-abrir-empresa-brasilia',
    date: '2024-02-20',
    category: 'Gestão',
    coverImage: '/blog/abertura-empresa.jpg',
    author: 'Adriano Viali',
    readTime: 8,
  },

  */
]

/* Categorias disponíveis — para filtros futuros */
export const CATEGORIES = [
  'Tributário',
  'Trabalhista',
  'Gestão',
  'Fiscal',
  'Abertura de Empresa',
]