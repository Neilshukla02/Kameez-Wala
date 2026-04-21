import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../lib/api'
import { fadeUp, staggerParent } from '../utils/motion'

const initialAddress = {
  fullName: '',
  phone: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  street: '',
}

export default function CartPage() {
  const { cartItems, subtotal, shipping, total, updateQuantity, removeItem, fetchCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [address, setAddress] = useState(initialAddress)

  const placeOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order')
      return
    }

    try {
      await api.post('/orders', { address })
      toast.success('Order placed successfully')
      setAddress(initialAddress)
      await fetchCart()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to place order')
    }
  }

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="section-shell">
              <SectionHeading
                eyebrow="Cart"
                title="Review your selected pieces and complete the order"
                copy="Your cart is backed by the authenticated cart API, and the checkout form below places a MongoDB order through the Express backend."
              />
            </div>
            <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: 'Subtotal', value: `$${subtotal}` },
                { label: 'Shipping', value: `$${shipping}` },
                { label: 'Total', value: `$${total}` },
              ].map((item) => (
                <motion.div key={item.label} variants={fadeUp} className="rounded-[1.5rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{item.label}</p>
                  <p className="mt-4 font-display text-4xl leading-none">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-shell flex min-h-80 flex-col items-center justify-center text-center">
                  <p className="font-display text-4xl">No items yet</p>
                  <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-muted)]">Login, add products, and your persisted cart will appear here.</p>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div key={item.cartItemId} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="section-shell flex flex-col gap-5 md:flex-row">
                    <img src={item.image} alt={item.name} className="h-56 w-full rounded-[1.6rem] object-cover md:w-48" />
                    <div className="flex flex-1 flex-col justify-between gap-5">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)]">{item.category}</p>
                          <p className="mt-2 font-display text-4xl leading-none">{item.name}</p>
                          <p className="mt-3 text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">{item.selectedVariant}</p>
                          <p className="mt-4 text-sm leading-7 text-[var(--text-muted)]">{item.description}</p>
                        </div>
                        <button onClick={() => removeItem(item.cartItemId)} className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--text-muted)] transition hover:text-red-400">
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 rounded-full border border-[var(--border-color)] px-4 py-3">
                          <button onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} aria-label="Decrease quantity">
                            <Minus size={16} />
                          </button>
                          <span className="min-w-8 text-center font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-xl font-semibold">${item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="section-shell h-fit">
            <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Delivery Details</p>
            <div className="mt-6 grid gap-4">
              {Object.keys(address).map((key) => (
                <input
                  key={key}
                  value={address[key]}
                  onChange={(event) => setAddress((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder={key.replace(/([A-Z])/g, ' $1')}
                  className="rounded-[1.25rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
                />
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <AnimatedButton variant="gold" className="w-full justify-center" onClick={placeOrder}>
                Place Order
              </AnimatedButton>
              <div className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">JWT protected checkout</div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  )
}
