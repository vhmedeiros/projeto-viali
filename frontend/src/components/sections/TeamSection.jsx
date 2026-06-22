/* ============================================================
   TeamSection — Seção "Quem Somos"
   ============================================================
   Dados em array estático no front — sem backend por enquanto.
   Termo técnico: Static Data Layer / Local Fixture
   Quando houver CMS ou API, só trocar o array por um fetch.
   ============================================================ */

import { motion } from 'framer-motion'
import adrianoImg from '../../assets/adriano.png'
import fausoImg from '../../assets/fauso.png'
import SectionTitle from '../ui/SectionTitle'
import {
  staggerContainer,
  fadeUp,
  viewportConfig,
} from '../../lib/motionVariants'
import styles from './TeamSection.module.css'

/* ------------------------------------------------------------------
   Array estático de colaboradores
   Termo técnico: Static Data / Local Fixture
   ------------------------------------------------------------------ */
const TEAM = [
  {
    name: 'Adriano Viali',
    role: 'Contador & Sócio Administrador',
    bio: 'Com mais de 9 anos à frente da Viali, Adriano combina domínio técnico e visão estratégica para orientar empresas na tomada de decisões fiscais e contábeis com segurança. É o ponto de contato principal para clientes que buscam clareza e resultado.',
    photo: adrianoImg,
  },
  {
    name: 'Fausto Viali',
    role: 'Contador | Sócio Fundador & Departamento Pessoal',
    bio: 'Fundador da Viali e especialista em relações trabalhistas, Fausto lidera o Departamento Pessoal com precisão e cuidado. Do eSocial à folha de pagamento, garante que cada obrigação trabalhista seja cumprida no prazo — sem surpresas para o empregador.',
    photo: fausoImg,
  },
]

export default function TeamSection() {
  return (
    <section id="quem-somos" className={`section ${styles.team}`}>
      <div className="container">

        <SectionTitle
          eyebrow="Quem somos"
          title="Pessoas reais cuidando do"
          highlight="seu negócio"
          subtitle="Conheça os profissionais por trás da Viali — com nome, rosto e responsabilidade."
        />

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {TEAM.map((member) => (
            <motion.article
              key={member.name}
              className={styles.card}
              variants={fadeUp}
            >
              {/* Foto */}
              <div className={styles.photoWrapper}>
                <img
                  src={member.photo}
                  alt={`Foto de ${member.name}`}
                  className={styles.photo}
                />
              </div>

              {/* Dados */}
              <div className={styles.info}>
                <h3 className={styles.name}>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
                <p className={styles.bio}>{member.bio}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  )
}