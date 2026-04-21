import { motion } from 'framer-motion'
import { Eye, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { fadeUp } from '../utils/motion'
import AnimatedButton from './AnimatedButton'

export default function ProductCard({ product, priority = false, onQuickView }) {
  const { addToCart } = useCart()
  const primaryImage = product.images?.[0] || product.image

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      className="group section-shell p-4 will-change-transform"
    >
      <div className="relative overflow-hidden rounded-[1.6rem]">
        <img
          src={primaryImage}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="h-[380px] w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-85 transition group-hover:opacity-100" />
        <div className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-black">
          {product.badge}
        </div>
        <div className="absolute inset-x-4 bottom-4 flex translate-y-4 flex-col gap-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <AnimatedButton
            variant="gold"
            className="w-full justify-center"
            onClick={() => addToCart(product, product.sizes?.[0])}
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag size={16} />
              Add To Cart
            </span>
          </AnimatedButton>
          <button
            onClick={() => onQuickView?.(product)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <Eye size={16} />
            Quick View
          </button>
        </div>
      </div>

      <div className="px-2 pt-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{product.category}</p>
            <Link
              to={`/product/${product._id || product.id}`}
              className="mt-2 block font-display text-3xl leading-none transition hover:text-[var(--accent)]"
            >
              {product.name}
            </Link>
          </div>
          <span className="text-sm font-semibold">${product.price}</span>
        </div>
        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{product.material || 'Luxury Edit'}</p>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{product.description}</p>
      </div>
    </motion.article>
  )
}
