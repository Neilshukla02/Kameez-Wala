import { motion } from 'framer-motion'
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AnimatedPage from '../components/AnimatedPage'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import SectionHeading from '../components/SectionHeading'
import { categories, shopFilters } from '../data/site'
import api from '../lib/api'
import { fadeUp, staggerParent } from '../utils/motion'

export default function CollectionPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeFilter, setActiveFilter] = useState(searchParams.get('category') || 'All')
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState([])
  const deferredFilter = useDeferredValue(activeFilter)
  const deferredSearch = useDeferredValue(search)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    setActiveFilter(categoryFromUrl && shopFilters.includes(categoryFromUrl) ? categoryFromUrl : 'All')
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {}
      if (deferredFilter !== 'All') params.category = deferredFilter
      if (deferredSearch.trim()) params.search = deferredSearch.trim()
      const { data } = await api.get('/products', { params })
      setProducts(data)
    }

    fetchProducts().catch(() => setProducts([]))
  }, [deferredFilter, deferredSearch])

  const handleFilter = (filter) => {
    startTransition(() => {
      setActiveFilter(filter)
      setSearchParams(filter === 'All' ? {} : { category: filter })
    })
  }

  const stats = useMemo(
    () => [
      { label: 'Products', value: `${products.length}` },
      { label: 'Categories', value: `${categories.length}` },
      { label: 'Search', value: deferredSearch ? 'Active' : 'Ready' },
    ],
    [products.length, deferredSearch],
  )

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell overflow-hidden">
            <div className="absolute inset-0 bg-hero-grid opacity-80" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <SectionHeading
                eyebrow="Shop"
                title="Luxury commerce with search, category filtering, and smooth browsing"
                copy="This page pulls products from MongoDB through the Express API and lets users browse by category or search by name."
              />
              <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {stats.map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{stat.label}</p>
                    <p className="mt-4 font-display text-4xl leading-none">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6">
            <div className="relative max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search luxury products..."
                className="w-full rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] py-4 pl-12 pr-5 outline-none transition focus:border-[var(--accent)]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {shopFilters.map((filter) => {
                const isActive = activeFilter === filter
                return (
                  <motion.button
                    key={filter}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleFilter(filter)}
                    className={`rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-[0.22em] transition ${
                      isActive ? 'border-[var(--accent)] bg-[var(--accent)] text-black shadow-glow' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {filter}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <motion.div variants={staggerParent} initial="hidden" animate="visible" key={`${deferredFilter}-${deferredSearch}`} className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index < 2} onQuickView={setQuickViewProduct} />
            ))}
          </motion.div>
        </div>
      </section>

      <QuickViewModal product={quickViewProduct} isOpen={Boolean(quickViewProduct)} onClose={() => setQuickViewProduct(null)} onAfterAdd={() => setQuickViewProduct(null)} />
    </AnimatedPage>
  )
}
