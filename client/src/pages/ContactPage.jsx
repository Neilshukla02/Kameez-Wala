import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { fadeUp, staggerParent } from '../utils/motion'

const contactCards = [
  { icon: Mail, label: 'Email', value: 'concierge@kameezwala.com' },
  { icon: Phone, label: 'Phone', value: '+91 90000 12121' },
  { icon: MapPin, label: 'Studio', value: 'Heritage Avenue, New Delhi' },
]

export default function ContactPage() {
  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="section-shell">
              <SectionHeading
                eyebrow="Contact"
                title="Book a styling session or speak with our luxury concierge."
                copy="We help clients coordinate garments, fragrance, footwear, and timepieces into one polished luxury wardrobe story."
              />
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="mt-10 space-y-4"
              >
                {contactCards.map((card) => (
                  <motion.div key={card.label} variants={fadeUp} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                    <card.icon size={18} className="text-[var(--accent)]" />
                    <p className="mt-4 text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">{card.label}</p>
                    <p className="mt-3 font-semibold">{card.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <motion.form
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="section-shell grid gap-5"
            >
              {['Your Name', 'Email Address', 'Occasion Type'].map((placeholder) => (
                <motion.input
                  key={placeholder}
                  whileFocus={{ scale: 1.01 }}
                  placeholder={placeholder}
                  className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                />
              ))}
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                placeholder="Tell us about your preferred look, timeline, and measurements."
                rows="6"
                className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
              />
              <div className="pt-2">
                <AnimatedButton variant="gold">Send Inquiry</AnimatedButton>
              </div>
            </motion.form>
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}
