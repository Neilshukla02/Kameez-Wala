import { motion } from 'framer-motion'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { fadeUp, staggerParent } from '../utils/motion'

const pillars = [
  {
    title: 'Measured Tailoring',
    copy: 'Every silhouette begins with posture, movement, and a considered shoulder line.',
  },
  {
    title: 'Heritage Textures',
    copy: 'We lean into rich jacquards, premium cottons, and silk blends that feel ceremonial without excess.',
  },
  {
    title: 'Quiet Ornament',
    copy: 'The finishing language is restrained: tonal threadwork, polished buttons, and soft metallic accents.',
  },
]

export default function AboutPage() {
  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="section-shell">
              <SectionHeading
                eyebrow="About Us"
                title="Kameez Wala exists for clients who want luxury fashion to feel sharp, calm, and unmistakably premium."
                copy="Our design language begins with South Asian menswear and extends into fragrance, footwear, and timepieces, all bound by modern restraint and a tailored luxury sensibility."
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75 }}
              className="section-shell p-3"
            >
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80"
                alt="About Kameez Wala"
                className="h-full min-h-[420px] w-full rounded-[1.8rem] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3"
        >
          {pillars.map((pillar) => (
            <motion.div key={pillar.title} variants={fadeUp} className="section-shell">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Pillar</p>
              <h3 className="mt-5 font-display text-4xl leading-none">{pillar.title}</h3>
              <p className="mt-6 text-sm leading-7 text-[var(--text-muted)]">{pillar.copy}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </AnimatedPage>
  )
}
