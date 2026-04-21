import { motion } from 'framer-motion'
import { ArrowRight, PackageCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { categories } from '../data/site'
import api from '../lib/api'
import { fadeUp, staggerParent } from '../utils/motion'

const displaySlots = 8

function CustomerProductCard({ product }) {
  const primaryImage = product.images?.[0]

  return (
    <div className="section-shell overflow-hidden p-0">
      <div className="relative h-56 overflow-hidden">
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
            <ShoppingBag size={24} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-black">
          {product.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent)]">{product.badge || 'Available'}</p>
            <h3 className="mt-2 font-display text-3xl leading-none">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold">${product.price}</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{product.description}</p>
        <Link to={`/product/${product._id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
          View Item
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}

function ComingSoonCard() {
  return (
    <div className="section-shell flex min-h-[360px] flex-col justify-between border-dashed border-[var(--accent)]/30 bg-[linear-gradient(135deg,rgba(183,138,67,0.08),rgba(255,255,255,0.01))]">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[var(--accent)]/40 bg-[var(--accent-soft)] text-[var(--accent)]">
        <Sparkles size={20} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Empty Item</p>
        <h3 className="mt-3 font-display text-4xl leading-none">Coming Soon</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">This slot is intentionally empty for now. Customers can still browse the rest of the catalog without seeing a broken layout.</p>
      </div>
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        Explore All Products
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}

export default function CustomerInterfacePage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        setProducts(data)
      } catch (_error) {
        setProducts([])
      }
    }

    fetchProducts()
  }, [])

  const slots = useMemo(() => {
    const filled = products.slice(0, displaySlots)
    const emptyCount = Math.max(displaySlots - filled.length, 0)
    return [...filled, ...Array.from({ length: emptyCount }, () => null)]
  }, [products])

  const activeCategories = useMemo(() => new Set(products.map((product) => product.category)).size, [products])

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,138,67,0.18),transparent_32%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <SectionHeading
                eyebrow="Customer Interface"
                title="A clean shopping view for available items and future stock"
                copy="Customers see active products first, while empty slots stay polished and intentional instead of making the page feel unfinished."
              />
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: 'Available Items', value: `${products.length}` },
                  { label: 'Categories Live', value: `${activeCategories || categories.length}` },
                  { label: 'Open Slots', value: `${Math.max(displaySlots - products.length, 0)}` },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{stat.label}</p>
                    <p className="mt-4 font-display text-4xl leading-none">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Customer Shelf</p>
              <h2 className="mt-3 font-display text-5xl leading-none">Browse Items</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
              Open Full Shop
              <ArrowRight size={16} />
            </Link>
          </div>

          <motion.div variants={staggerParent} initial="hidden" animate="visible" className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {slots.map((product, index) => (
              <motion.div key={product?._id || `empty-${index}`} variants={fadeUp}>
                {product ? <CustomerProductCard product={product} /> : <ComingSoonCard />}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-10 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell grid gap-6 lg:grid-cols-3">
            {[
              { icon: PackageCheck, title: 'Available now', copy: 'Products already uploaded by admin appear here immediately for shoppers.' },
              { icon: Sparkles, title: 'Empty slots stay clean', copy: 'Unfilled item positions are styled as coming soon cards instead of leaving awkward gaps.' },
              { icon: ShoppingBag, title: 'Ready for shopping flow', copy: 'Customers can jump from this interface into the existing full collection and product details pages.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                <item.icon size={18} className="text-[var(--accent)]" />
                <h3 className="mt-4 font-display text-3xl leading-none">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}
