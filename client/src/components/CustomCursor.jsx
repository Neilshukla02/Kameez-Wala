import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const shouldReduceMotion = useReducedMotion()
  const [isEnabled, setIsEnabled] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { stiffness: 420, damping: 34, mass: 0.18 })
  const springY = useSpring(cursorY, { stiffness: 420, damping: 34, mass: 0.18 })

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsEnabled(false)
      return undefined
    }

    const mediaQuery = window.matchMedia('(pointer: fine)')
    const updateEnabled = () => setIsEnabled(mediaQuery.matches)
    updateEnabled()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateEnabled)
    } else {
      mediaQuery.addListener(updateEnabled)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateEnabled)
      } else {
        mediaQuery.removeListener(updateEnabled)
      }
    }
  }, [shouldReduceMotion])

  useEffect(() => {
    if (!isEnabled) {
      return undefined
    }

    const updateCursor = (event) => {
      cursorX.set(event.clientX - 16)
      cursorY.set(event.clientY - 16)
    }

    window.addEventListener('mousemove', updateCursor, { passive: true })
    return () => window.removeEventListener('mousemove', updateCursor)
  }, [cursorX, cursorY, isEnabled])

  if (!isEnabled) {
    return null
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden h-8 w-8 rounded-full border border-[var(--accent)]/55 bg-[var(--accent)]/8 lg:block"
      style={{ x: springX, y: springY, boxShadow: '0 0 18px rgba(183, 138, 67, 0.24)' }}
    />
  )
}
