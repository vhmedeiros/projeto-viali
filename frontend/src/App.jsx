/* ============================================================
   App.jsx — Componente raiz v2
   ============================================================ */

import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import Services from './components/sections/Services'
import About from './components/sections/About'
import TeamSection from './components/sections/TeamSection'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/ui/WhatsAppButton'

export default function App() {
  return (
    <div>
      <Header />

      <main>
        <Hero />
        <Services />
        <About />
        <TeamSection />
        <Contact />
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Passo 12 — Chatbot oculto (a implementar) */}
      {/* {CHATBOT_ENABLED && <ChatButton />} */}
    </div>
  )
}