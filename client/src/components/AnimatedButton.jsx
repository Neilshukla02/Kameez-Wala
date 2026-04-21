import { motion } from 'framer-motion'
import { useState } from 'react'

export default function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  onClick,
  ...props
}) {
  const [ripples, setRipples] = useState([])

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const ripple = {
      id: Date.now(),
      x: event.clientX - rect.left - size / 2,
      y: event.clientY - rect.top - size / 2,
      size,
    }

    setRipples((current) => [...current, ripple])
    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== ripple.id))
    }, 700)

    onClick?.(event)
  }

  const variants = {
    primary:
      'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent hover:shadow-glow dark:bg-[var(--accent)] dark:text-black',
    secondary:
      'border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]',
    gold:
      'border-transparent bg-[var(--accent)] text-black hover:brightness-110 hover:shadow-glow',
  }

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full border px-6 py-3 text-sm font-semibold tracking-[0.2em] transition ${variants[variant]} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
