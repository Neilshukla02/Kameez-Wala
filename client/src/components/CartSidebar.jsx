import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import AnimatedButton from './AnimatedButton'

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, total, subtotal, shipping, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            aria-label="Close cart overlay"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-[var(--border-color)] bg-[var(--bg-primary)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[var(--accent)]" />
                <div>
                  <p className="font-display text-2xl">Your Cart</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">Luxury Checkout</p>
                </div>
              </div>
              <button onClick={onClose} className="rounded-full border border-[var(--border-color)] p-2" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-panel flex h-full min-h-72 flex-col items-center justify-center rounded-[2rem] p-8 text-center"
                >
                  <p className="font-display text-3xl">Cart is empty</p>
                  <p className="mt-3 text-sm text-[var(--text-muted)]">
                    Curate a luxury look with kameez, fragrance, footwear, and a final timepiece.
                  </p>
                </motion.div>
              ) : (
                cartItems.map((item) => (
                  <motion.div
                    key={item.cartItemId}
                    layout
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="glass-panel flex gap-4 rounded-[1.75rem] p-4"
                  >
                    <img src={item.image} alt={item.name} className="h-28 w-24 rounded-[1.25rem] object-cover" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-2xl leading-none">{item.name}</p>
                            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
                              {item.selectedVariant}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.cartItemId)}
                            className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)] transition hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="mt-3 text-sm text-[var(--accent)]">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-2">
                          <button onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))} aria-label="Decrease quantity">
                            <Minus size={14} />
                          </button>
                          <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} aria-label="Increase quantity">
                            <Plus size={14} />
                          </button>
                        </div>
                        <motion.p
                          key={`${item.id}-${item.quantity}`}
                          initial={{ opacity: 0.4, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="font-semibold"
                        >
                          ${item.price * item.quantity}
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-[var(--border-color)] px-6 py-5">
              <div className="mb-4 space-y-2 text-sm uppercase tracking-[0.25em] text-[var(--text-muted)]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <motion.span key={`subtotal-${subtotal}`} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }}>
                    ${subtotal}
                  </motion.span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>${shipping}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text-primary)]">
                  <span>Total</span>
                  <motion.span key={`total-${total}`} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold">
                    ${total}
                  </motion.span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link to="/cart" onClick={onClose}>
                  <AnimatedButton variant="gold" className="w-full justify-center">
                    View Full Cart
                  </AnimatedButton>
                </Link>
                <AnimatedButton variant="secondary" className="w-full justify-center">
                  Checkout Securely
                </AnimatedButton>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
