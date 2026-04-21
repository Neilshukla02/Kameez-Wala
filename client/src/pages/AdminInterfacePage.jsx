import { motion } from 'framer-motion'
import { CheckCircle2, ImagePlus, PackagePlus, ShieldAlert, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { categories } from '../data/site'
import api from '../lib/api'
import { fadeUp, staggerParent } from '../utils/motion'

const initialForm = {
  name: '',
  category: categories[0]?.id || 'Kameez',
  price: '',
  description: '',
  sizes: '',
  stock: '',
  badge: 'New',
  material: '',
  featured: false,
}

const inventorySlots = 8

function EmptySlotCard() {
  return (
    <div className="section-shell flex min-h-[220px] flex-col justify-between border-dashed border-[var(--accent)]/35 bg-[linear-gradient(135deg,rgba(183,138,67,0.08),rgba(255,255,255,0.01))] p-5">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-[var(--accent)]/45 bg-[var(--accent-soft)] text-[var(--accent)]">
        <PackagePlus size={18} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Empty Item</p>
        <h3 className="mt-3 font-display text-3xl leading-none">Slot Ready</h3>
        <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">This position is open for the next product upload from the admin panel.</p>
      </div>
    </div>
  )
}

function ProductSlotCard({ product, onDelete, deleting }) {
  const primaryImage = product.images?.[0]

  return (
    <div className="section-shell overflow-hidden p-0">
      <div className="relative h-44 overflow-hidden">
        {primaryImage ? (
          <img src={primaryImage} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)]">
            <ImagePlus size={22} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-black">
          {product.category}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent)]">{product.badge || 'Listed'}</p>
            <h3 className="mt-2 font-display text-3xl leading-none">{product.name}</h3>
          </div>
          <span className="text-sm font-semibold">${product.price}</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{product.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
          <span>{product.material || 'Luxury Edit'}</span>
          <span>{product.stock ?? 0} in stock</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(product)}
          disabled={deleting}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-500 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={14} />
          {deleting ? 'Deleting...' : 'Delete Item'}
        </button>
      </div>
    </div>
  )
}

export default function AdminInterfacePage() {
  const { user, isAuthenticated } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/products')
        setProducts(data)
      } catch (_error) {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const isAdmin = isAuthenticated && user?.role === 'admin'
  const slots = useMemo(() => {
    const filled = products.slice(0, inventorySlots)
    const emptyCount = Math.max(inventorySlots - filled.length, 0)
    return [...filled, ...Array.from({ length: emptyCount }, () => null)]
  }, [products])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedFile(file)

    if (!file) {
      setImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setImagePreview((current) => {
      if (current) {
        URL.revokeObjectURL(current)
      }

      return previewUrl
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAdmin) {
      toast.error('Only admin accounts can upload products')
      return
    }

    try {
      setSubmitting(true)
      let uploadedImageUrl = ''

      if (selectedFile) {
        const reader = new FileReader()
        const fileData = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result)
          reader.onerror = () => reject(new Error('Unable to read selected image'))
          reader.readAsDataURL(selectedFile)
        })

        const uploadResponse = await api.post('/products/upload', {
          fileName: selectedFile.name,
          contentType: selectedFile.type,
          data: fileData,
        })
        uploadedImageUrl = uploadResponse.data.imageUrl
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        images: uploadedImageUrl ? [uploadedImageUrl] : [],
        sizes: form.sizes
          .split(',')
          .map((size) => size.trim())
          .filter(Boolean),
        stock: Number(form.stock || 0),
        badge: form.badge.trim() || 'New',
        material: form.material.trim(),
        featured: form.featured,
      }

      if (!payload.name || !payload.description || Number.isNaN(payload.price)) {
        toast.error('Name, price, and description are required')
        return
      }

      const { data } = await api.post('/products', payload)
      setProducts((current) => [data, ...current])
      setForm(initialForm)
      setSelectedFile(null)
      setImagePreview((current) => {
        if (current) {
          URL.revokeObjectURL(current)
        }

        return ''
      })
      toast.success('Product uploaded successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Product upload failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product) => {
    if (!isAdmin) {
      toast.error('Only admin accounts can delete products')
      return
    }

    const confirmed = window.confirm(`Delete "${product.name}"?`)
    if (!confirmed) {
      return
    }

    try {
      setDeletingProductId(product._id)
      await api.delete(`/products/${product._id}`)
      setProducts((current) => current.filter((item) => item._id !== product._id))
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete product')
    } finally {
      setDeletingProductId('')
    }
  }

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(183,138,67,0.2),transparent_35%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <SectionHeading
                eyebrow="Admin Interface"
                title="Upload every item from one place and keep empty slots visible"
                copy="This admin screen is designed for product entry. Filled products appear immediately, and unused slots stay visible so you always know where inventory is missing."
              />
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  { label: 'Listed', value: `${products.length}` },
                  { label: 'Visible Slots', value: `${inventorySlots}` },
                  { label: 'Access', value: isAdmin ? 'Admin' : 'Restricted' },
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
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="section-shell">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Upload Section</p>
                <h2 className="mt-3 font-display text-4xl leading-none">Add New Item</h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">Choose an image directly from device storage, then publish the item with pricing, stock, and category details.</p>
              </div>
            </div>

            {!isAdmin && (
              <div className="mt-6 rounded-[1.5rem] border border-amber-400/35 bg-amber-500/10 p-4 text-sm leading-7 text-[var(--text-primary)]">
                <div className="flex items-center gap-3 font-semibold">
                  <ShieldAlert size={18} className="text-amber-500" />
                  Admin login required
                </div>
                <p className="mt-2 text-[var(--text-muted)]">The interface is ready, but product upload only works when the signed-in account has the `admin` role.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Item Name</span>
                  <input name="name" value={form.name} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Midnight Kameez" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Category</span>
                  <select name="category" value={form.category} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]">
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Price</span>
                  <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="249.99" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Stock</span>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="12" />
                </label>
              </div>

              <label className="grid gap-2 text-sm">
                <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Description</span>
                <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Describe the item for customers." />
              </label>

              <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Upload Image</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" onChange={handleFileChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.18em] file:text-black" />
                  <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">JPG, PNG, WEBP, GIF, or AVIF</span>
                </label>
                <div className="overflow-hidden rounded-[1.6rem] border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Selected preview" className="h-52 w-full object-cover" />
                  ) : (
                    <div className="flex h-52 flex-col items-center justify-center gap-3 text-[var(--text-muted)]">
                      <ImagePlus size={22} className="text-[var(--accent)]" />
                      <p className="text-xs uppercase tracking-[0.24em]">No image selected</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Sizes</span>
                  <input name="sizes" value={form.sizes} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="S, M, L" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Badge</span>
                  <input name="badge" value={form.badge} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Best Seller" />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="uppercase tracking-[0.24em] text-[var(--text-muted)]">Material</span>
                  <input name="material" value={form.material} onChange={handleChange} className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none focus:border-[var(--accent)]" placeholder="Cotton Silk" />
                </label>
              </div>

              <label className="inline-flex items-center gap-3 text-sm text-[var(--text-muted)]">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--accent)] focus:ring-[var(--accent)]" />
                Mark as featured item
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--accent)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                <PackagePlus size={18} />
                {submitting ? 'Uploading...' : 'Upload Item'}
              </button>
            </form>
          </div>

          <div className="section-shell">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Inventory Preview</p>
                <h2 className="mt-3 font-display text-4xl leading-none">Filled and Empty Item Slots</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                <CheckCircle2 size={16} className="text-[var(--accent)]" />
                {loading ? 'Loading...' : 'Live'}
              </div>
            </div>
            <motion.div variants={staggerParent} initial="hidden" animate="visible" className="mt-8 grid gap-4 md:grid-cols-2">
              {slots.map((product, index) => (
                <motion.div key={product?._id || `empty-${index}`} variants={fadeUp}>
                  {product ? <ProductSlotCard product={product} onDelete={handleDelete} deleting={deletingProductId === product._id} /> : <EmptySlotCard />}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}
