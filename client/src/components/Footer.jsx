import { motion } from 'framer-motion'
import { Instagram, Facebook, Linkedin, Send } from 'lucide-react'

const socials = [Instagram, Facebook, Linkedin, Send]

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75 }}
      className="px-4 pb-6 pt-16 md:px-6"
    >
      <div className="section-shell mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="font-display text-4xl md:text-5xl">Kameez Wala</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
            Luxury fashion rooted in men&apos;s ethnic wear and extended through fragrance, premium footwear, and timepieces with quiet ceremonial presence.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            {socials.map((Icon, index) => (
              <motion.a
                key={index}
                href="/"
                whileHover={{ y: -8, scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">
            Crafted for festivals, weddings, formal nights, and elevated daily dressing.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
