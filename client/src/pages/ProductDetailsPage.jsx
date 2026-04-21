import { motion } from 'framer-motion'
import { Check, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import RelatedCarousel from '../components/RelatedCarousel'
import SectionHeading from '../components/SectionHeading'
import { useCart } from '../context/CartContext'
import api from '../lib/api'
import { fadeUp, staggerParent } from '../utils/motion'

export default function ProductDetailsPage({ openCart }) {
  const { productId } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('Standard')
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${productId}`)
      setProduct(data)
      setSelectedImage(data.images?.[0] || '')
      setSelectedVariant(data.sizes?.[0] || 'Standard')

      const related = await api.get('/products', {
        params: { category: data.category },
      })
      setRelatedProducts(related.data.filter((item) => item._id !== data._id).slice(0, 3))
    }

    fetchProduct().catch(() => setProduct(null))
  }, [productId])

  const gallery = useMemo(() => product?.images || [], [product])

  if (!product) {
    return (
      <AnimatedPage>
        <section className="px-4 pt-32 md:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="section-shell text-center font-display text-4xl">Loading product...</div>
          </div>
        </section>
      </AnimatedPage>
    )
  }

  const handleAddToCart = async () => {
    await addToCart(product, selectedVariant)
    openCart?.()
  }

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div variants={staggerParent} initial="hidden" animate="visible" className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={fadeUp} className="space-y-5">
              <div className="section-shell p-4">
                <motion.img key={selectedImage} initial={{ opacity: 0.6, x: 24, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.55 }} src={selectedImage} alt={product.name} className="h-[520px] w-full rounded-[1.75rem] object-cover md:h-[680px]" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {gallery.map((image) => (
                  <motion.button key={image} whileHover={{ y: -4 }} onClick={() => setSelectedImage(image)} className={`section-shell p-2 ${selectedImage === image ? 'shadow-glow' : ''}`}>
                    <img src={image} alt={product.name} className="h-28 w-full rounded-[1.25rem] object-cover md:h-40" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="section-shell flex flex-col justify-center">
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">{product.category}</p>
              <h1 className="mt-5 font-display text-5xl leading-none md:text-6xl">{product.name}</h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }} className="mt-5 max-w-xl text-sm leading-8 text-[var(--text-muted)] md:text-base">
                {product.description}
              </motion.p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['Material', product.material || 'Luxury'],
                  ['Stock', product.stock],
                  ['Price', `$${product.price}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.4rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{label}</p>
                    <p className="mt-3 font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">Select Size</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(product.sizes || ['Standard']).map((size) => {
                    const isSelected = selectedVariant === size
                    return (
                      <motion.button key={size} whileHover={{ y: -3 }} whileTap={{ scale: 0.96 }} onClick={() => setSelectedVariant(size)} className={`relative overflow-hidden rounded-full border px-5 py-3 text-sm font-semibold transition ${isSelected ? 'border-[var(--accent)] bg-[var(--accent)] text-black shadow-glow' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'}`}>
                        <motion.span layoutId="selected-size-pill" className={isSelected ? 'absolute inset-0 rounded-full bg-[var(--accent)]' : 'hidden'} />
                        <span className="relative z-10 flex items-center gap-2">{isSelected && <Check size={14} />}{size}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <AnimatedButton variant="gold" onClick={handleAddToCart} className="sm:min-w-56">
                  <span className="inline-flex items-center gap-2">
                    <ShoppingBag size={16} />
                    Add To Cart
                  </span>
                </AnimatedButton>
                <AnimatedButton variant="secondary">Reserve For Styling</AnimatedButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Related Items" title="More pieces from the same luxury category" copy="The related carousel fetches category-based products and keeps the discovery flow moving." />
          <div className="mt-10">
            <RelatedCarousel products={relatedProducts} />
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}
