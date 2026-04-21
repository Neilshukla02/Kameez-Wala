import { motion } from 'framer-motion'

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#080808]"
    >
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
            className="absolute inset-2 rounded-full border border-dashed border-[var(--accent)]/50"
          />
          <span className="font-display text-3xl text-white">KW</span>
        </motion.div>
        <div className="text-center">
          <p className="font-display text-4xl text-white">Kameez Wala</p>
          <p className="mt-2 text-xs uppercase tracking-[0.45em] text-[var(--accent)]">Elegance In Every Thread</p>
        </div>
      </div>
    </motion.div>
  )
}
