import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function RelatedCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!products || products.length < 2) {
      return undefined
    }

    setCurrentIndex(0)

    const timer = window.setInterval(() => {
      setCurrentIndex((value) => (value + 1) % products.length)
    }, 3000)

    return () => window.clearInterval(timer)
  }, [products])

  if (!products || products.length === 0) {
    return (
      <div className="section-shell text-center text-sm text-[var(--text-muted)]">
        More related products will appear here as the catalog grows.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem]">
      <motion.div
        animate={{ x: `-${currentIndex * 100}%` }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex"
      >
        {products.map((product) => (
          <Link key={product._id || product.id} to={`/product/${product._id || product.id}`} className="min-w-full">
            <div className="section-shell h-full p-4">
              <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                <img src={product.images?.[0] || product.image} alt={product.name} className="h-64 w-full rounded-[1.6rem] object-cover md:h-80" />
                <div className="flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{product.category}</p>
                  <p className="mt-4 font-display text-4xl">{product.name}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{product.material || 'Luxury Edit'}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{product.description}</p>
                  <span className="mt-6 inline-flex text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
                    Explore Piece
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
