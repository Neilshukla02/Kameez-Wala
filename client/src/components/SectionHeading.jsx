import { motion } from 'framer-motion'
import { fadeUp, staggerParent } from '../utils/motion'

export default function SectionHeading({ eyebrow, title, copy, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className={`flex max-w-3xl flex-col gap-4 ${alignment}`}
    >
      <motion.span
        variants={fadeUp}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.45em] text-[var(--accent)]"
      >
        <span className="h-px w-10 bg-[var(--accent)]" />
        {eyebrow}
      </motion.span>
      <motion.h2 variants={fadeUp} className="font-display text-4xl leading-none md:text-5xl lg:text-6xl">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
        {copy}
      </motion.p>
    </motion.div>
  )
}
