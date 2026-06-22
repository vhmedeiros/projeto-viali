/* ============================================================
   Services Section v2 — 7 cards com framer-motion
   ============================================================
   Mudanças da v1:
   - 7 serviços no lugar de 6 (novo: BPO Financeiro)
   - Grid com auto-fit — se adapta a qualquer número de cards
   - Animações: framer-motion whileInView + staggerChildren
   - Copy: focado na DOR do cliente em vez de lista de features
   - SectionTitle: migrado para nova identidade visual
   ============================================================ */

import { motion } from 'framer-motion'
import {
  FaFileInvoiceDollar,
  FaCalculator,
  FaUserTie,
  FaBuilding,
  FaBalanceScale,
  FaChartLine,
  FaMoneyBillWave,
} from 'react-icons/fa'
import SectionTitle from '../ui/SectionTitle'
import ServiceCard from '../ui/ServiceCard'
import { staggerContainerFast, viewportConfig } from '../../lib/motionVariants'
import styles from './Services.module.css'

/* ------------------------------------------------------------------
   7 serviços — dados reais da Viali.
   Copy orientado à DOR: o que o cliente EVITA ao contratar.
   Termo técnico: Pain-point Driven Copy
   ------------------------------------------------------------------ */
const SERVICES = [
  {
    icon: <FaFileInvoiceDollar aria-hidden="true" />,
    title: 'Contabilidade Empresarial',
    description:
      'Sem relatórios confusos ou atrasos. Gestão contábil completa com acompanhamento mensal claro e objetivo.',
  },
  {
    icon: <FaBuilding aria-hidden="true" />,
    title: 'Abertura de Empresas',
    description:
      'Abre sua empresa sem burocracia. Do CNPJ ao alvará, cuidamos de tudo para você começar a operar rápido.',
  },
  {
    icon: <FaCalculator aria-hidden="true" />,
    title: 'Planejamento Tributário',
    description:
      'Pague apenas o que é devido. Enquadramos sua empresa no regime ideal e identificamos créditos tributários.',
  },
  {
    icon: <FaUserTie aria-hidden="true" />,
    title: 'Folha de Pagamento',
    description:
      'Zero risco trabalhista. Admissões, demissões, eSocial e folha mensal sempre em dia e dentro da lei.',
  },
  {
    icon: <FaBalanceScale aria-hidden="true" />,
    title: 'Obrigações Fiscais',
    description:
      'Nunca mais multa por atraso. Todas as declarações e obrigações acessórias entregues nos prazos certos.',
  },
  {
    icon: <FaChartLine aria-hidden="true" />,
    title: 'Consultoria Contábil',
    description:
      'Decisões baseadas em dados reais. Análise financeira e orientação estratégica para seu negócio crescer.',
  },
  {
    icon: <FaMoneyBillWave aria-hidden="true" />,
    title: 'BPO Financeiro',
    description:
      'Terceirize sua gestão financeira. Contas a pagar e receber, conciliação bancária, fluxo de caixa e emissão de boletos e NF.',
  },
]

export default function Services() {
  return (
    <section id="servicos" className={`section ${styles.services}`}>
      <div className="container">

        <SectionTitle
          eyebrow="O que fazemos"
          title="Soluções que eliminam"
          highlight="dores reais"
          subtitle="Cada serviço foi pensado para resolver um problema específico do seu negócio — sem jargão, sem enrolação."
        />

        {/*
          motion.div com staggerContainerFast coordena a animação
          em cascata dos 7 cards com intervalo de 70ms entre cada um.
          whileInView dispara quando a seção entra na viewport.
          Termo técnico: Viewport-triggered Stagger Animation
        */}
        <motion.div
          className={styles.grid}
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </motion.div>

      </div>
    </section>
  )
}