import { AnimatePresence, motion } from 'framer-motion'
import { Eye, ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import AnimatedButton from './AnimatedButton'

export default function QuickViewModal({ product, isOpen, onClose, onAfterAdd }) {
  const { addToCart } = useCart()

  if (!product) {
    return null
  }

  const defaultVariant = product.sizes?.[0]
  const primaryImage = product.images?.[0] || product.image

  const handleAdd = () => {
    addToCart(product, defaultVariant)
    onAfterAdd?.()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[62] bg-black/70 backdrop-blur-sm"
            aria-label="Close quick view overlay"
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-[63] mx-auto grid max-w-5xl -translate-y-1/2 gap-0 overflow-hidden rounded-[2rem] border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl lg:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="relative min-h-[320px] overflow-hidden">
              <img src={primaryImage} alt={product.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{product.category}</p>
                <p className="mt-2 font-display text-4xl text-white">{product.name}</p>
              </div>
            </div>

            <div className="relative p-6 md:p-8">
              <button
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full border border-[var(--border-color)] p-2"
                aria-label="Close quick view"
              >
                <X size={18} />
              </button>
              <div className="max-w-xl pt-8">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{product.material || product.category}</p>
                <p className="mt-4 text-sm leading-8 text-[var(--text-muted)]">{product.longDescription || product.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    ['Material', product.material || 'Luxury Build'],
                    ['Stock', product.stock],
                    ['Price', `$${product.price}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.4rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                      <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{label}</p>
                      <p className="mt-3 font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <AnimatedButton variant="gold" onClick={handleAdd}>
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag size={16} />
                      Add To Cart
                    </span>
                  </AnimatedButton>
                  <Link to={`/product/${product._id || product.id}`} onClick={onClose}>
                    <AnimatedButton variant="secondary">
                      <span className="inline-flex items-center gap-2">
                        <Eye size={16} />
                        Full Details
                      </span>
                    </AnimatedButton>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
