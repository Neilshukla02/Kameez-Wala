import { motion } from 'framer-motion'

export default function AnimatedPage({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className="relative will-change-transform"
    >
      {children}
    </motion.main>
  )
}
