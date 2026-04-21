import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Star, WandSparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'
import SectionHeading from '../components/SectionHeading'
import { categories } from '../data/site'
import api from '../lib/api'
import { fadeIn, fadeUp, scaleIn, staggerParent } from '../utils/motion'

const highlights = [
  { label: 'Kameez', value: 'Tailored menswear with modern ceremonial structure' },
  { label: 'Fragrance', value: 'Signature perfume profiles with oud, amber, and velvet florals' },
  { label: 'Accessories', value: 'Luxury shoes and timepieces to complete the wardrobe' },
]

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : 64])
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await api.get('/products')
      setFeaturedProducts(data.slice(0, 4))
    }

    fetchProducts().catch(() => setFeaturedProducts([]))
  }, [])

  return (
    <AnimatedPage>
      <section className="relative flex min-h-screen items-center px-4 pt-28 md:px-6">
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.03 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              y: heroY,
              backgroundImage:
                'url(https://images.unsplash.com/photo-1621786030738-d8d6f9f8ec5b?auto=format&fit=crop&w=1800&q=80)',
            }}
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className="max-w-3xl">
            <motion.p
              variants={fadeUp}
              className="inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.45em] text-[var(--accent)] backdrop-blur-md"
            >
              MERN Luxury Commerce
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-8 font-display text-6xl leading-[0.92] text-white md:text-7xl lg:text-8xl">
              Luxury
              <span className="gold-text block">Redefined</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 text-sm uppercase tracking-[0.35em] text-white/70 md:text-base">
              Kameez, Fragrance, Footwear &amp; Timepieces
            </motion.p>
            <motion.p variants={fadeUp} className="mt-8 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              Kameez Wala is a full-stack luxury fashion platform built for modern commerce, with premium menswear at the center and an elevated shopping flow throughout.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/shop">
                <AnimatedButton variant="gold">
                  <span className="inline-flex items-center gap-2">
                    Explore The Shop
                    <ArrowRight size={16} />
                  </span>
                </AnimatedButton>
              </Link>
              <Link to="/register">
                <AnimatedButton variant="secondary" className="border-white/20 text-white">
                  Create Account
                </AnimatedButton>
              </Link>
            </motion.div>
          </div>

          <motion.div variants={scaleIn} className="self-end lg:justify-self-end">
            <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6 text-white">
              <div className="absolute inset-0 bg-hero-grid opacity-90" />
              <div className="relative space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-[var(--accent)]" />
                  <p className="text-xs uppercase tracking-[0.35em] text-white/65">Curated Signature Notes</p>
                </div>
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.32 + index * 0.08, duration: 0.42 }}
                    className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{item.label}</p>
                    <p className="mt-3 text-lg leading-7 text-white/85">{item.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Category Showcase"
            title="A luxury universe beyond the kurta rack"
            copy="The storefront spans men’s ethnic wear, perfumes, shoes, and premium watches with one consistent luxury language across the entire experience."
          />
          <motion.div
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={fadeUp} whileHover={{ y: -6, scale: 1.005 }} className="group section-shell p-4 will-change-transform">
                <Link to={`/shop?category=${category.id}`} className="block">
                  <div className="relative overflow-hidden rounded-[1.6rem]">
                    <img src={category.image} alt={category.label} className="h-80 w-full object-cover transition duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <div className="absolute inset-x-4 bottom-4 rounded-[1.3rem] border border-white/10 bg-black/35 p-4 backdrop-blur-md">
                      <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{category.short}</p>
                      <p className="mt-2 font-display text-3xl text-white">{category.label}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[var(--text-muted)]">{category.description}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Featured Collection"
            title="Best-selling pieces powered by real product data"
            copy="The homepage fetches products through the Express and Mongo API, then renders them inside the same premium motion system."
          />
          <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} priority={index === 0} onQuickView={setQuickViewProduct} />
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 md:px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerParent} className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div variants={fadeIn} className="section-shell flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-[var(--accent)]">
                <WandSparkles size={16} />
                <p className="text-xs uppercase tracking-[0.35em]">Luxury Craft</p>
              </div>
              <h3 className="mt-5 font-display text-5xl leading-none">Built around fashion, API flows, and modern UX.</h3>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--text-muted)]">
                This project combines a premium frontend with JWT auth, Mongo-backed commerce data, and animated interactions across every major shopping moment.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {['JWT Auth', 'Mongo Models', 'Animated Commerce'].map((item) => (
                <motion.div key={item} variants={fadeUp} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                  <Star size={16} className="text-[var(--accent)]" />
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={scaleIn} className="section-shell p-3">
            <img
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80"
              alt="Kameez Wala craftsmanship"
              className="h-full min-h-[420px] w-full rounded-[1.75rem] object-cover"
            />
          </motion.div>
        </motion.div>
      </section>

      <QuickViewModal product={quickViewProduct} isOpen={Boolean(quickViewProduct)} onClose={() => setQuickViewProduct(null)} onAfterAdd={() => setQuickViewProduct(null)} />
    </AnimatedPage>
  )
}
