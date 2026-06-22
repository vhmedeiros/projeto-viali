/* ============================================================
   Contact Section v2 — Dados de contato
   ============================================================
   Layout: coluna única centralizada com dados de contato.
   Formulário removido — WhatsApp é o canal principal de contato.
   ============================================================ */

import { motion } from 'framer-motion'
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import Button from '../ui/Button'
import SectionTitle from '../ui/SectionTitle'
import {
  fadeUp,
  staggerContainer,
  viewportConfig,
} from '../../lib/motionVariants'
import styles from './Contact.module.css'

const CONTACT_INFO = [
  {
    icon: <FiPhone aria-hidden="true" />,
    label: 'Telefone',
    value: '(61) 3032-4349',
    href: 'tel:+556130324349',
  },
  {
    icon: <FaWhatsapp aria-hidden="true" />,
    label: 'WhatsApp',
    value: '(61) 3032-4349',
    href: 'https://wa.me/556130324349',
  },
  {
    icon: <FiMail aria-hidden="true" />,
    label: 'E-mail',
    value: 'contato@viali.com.br',
    href: 'mailto:contato@viali.com.br',
  },
  {
    icon: <FiMapPin aria-hidden="true" />,
    label: 'Endereço',
    value: 'SIG Quadra 01 Sala 112, Brasília-DF',
    href: 'https://maps.google.com/?q=SIG+Quadra+01+Sala+112+Brasilia+DF',
  },
]

export default function Contact() {
  return (
    <section id="contato" className={`section ${styles.contact}`}>
      <div className="container">

        <SectionTitle
          eyebrow="Fale conosco"
          title="Vamos cuidar do"
          highlight="seu negócio juntos"
          subtitle="Entre em contato e receba uma análise gratuita da situação contábil da sua empresa."
        />

        <motion.div
          className={styles.content}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {/* Chamada emocional */}
          <motion.p className={styles.callout} variants={fadeUp}>
            Seja para abrir sua empresa, regularizar pendências ou
            simplesmente ter uma contabilidade que funcione de verdade —
            estamos aqui. Sem burocracia, sem enrolação.
          </motion.p>

          {/* Lista de dados de contato */}
          <motion.ul className={styles.infoList} variants={fadeUp}>
            {CONTACT_INFO.map((item) => (
              <li key={item.label} className={styles.infoItem}>
                <div className={styles.infoIcon}>{item.icon}</div>
                <div>
                  <span className={styles.infoLabel}>{item.label}</span>
                  <a
                    href={item.href}
                    className={styles.infoValue}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {item.value}
                  </a>
                </div>
              </li>
            ))}
          </motion.ul>

          {/* Horário + CTA WhatsApp */}
          <motion.div className={styles.bottom} variants={fadeUp}>
            <div className={styles.hours}>
              <span className={styles.hoursLabel}>Horário de atendimento</span>
              <span className={styles.hoursValue}>Segunda a Sexta, 8h às 17h</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              href="https://wa.me/556130324349"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp size={20} aria-hidden="true" />
              Falar pelo WhatsApp
            </Button>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}