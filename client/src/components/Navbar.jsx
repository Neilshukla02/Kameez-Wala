import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LogOut, Menu, MoonStar, ShoppingBag, SunMedium, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { categories } from '../data/site'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Customer', to: '/customer' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export default function Navbar({ isDarkMode, toggleTheme, openCart }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { itemCount } = useCart()
  const { isAuthenticated, logout, user } = useAuth()

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6"
      >
        <div className="glass-panel mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3 shadow-2xl">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[var(--border-color)] bg-[var(--accent-soft)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 14, ease: 'linear', repeat: Infinity }}
                className="absolute inset-2 rounded-full border border-dashed border-[var(--accent)]/60"
              />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-[var(--accent)]/85 to-transparent" />
            </div>
            <div>
              <p className="font-display text-2xl leading-none md:text-3xl">Kameez Wala</p>
              <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--text-muted)]">Luxury Fashion House</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link relative text-sm font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:text-[var(--accent)] ${
                    isActive ? 'active text-[var(--accent)]' : ''
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="nav-link relative inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:text-[var(--accent)]">
                Categories
                <ChevronDown size={16} className={`transition ${isDropdownOpen ? 'rotate-180 text-[var(--accent)]' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="glass-panel absolute left-1/2 top-full mt-4 w-72 -translate-x-1/2 rounded-[1.75rem] p-3"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/shop?category=${category.id}`}
                        className="block rounded-[1.25rem] px-4 py-3 transition hover:bg-[var(--accent-soft)]"
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.2em]">{category.short}</p>
                        <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{category.description}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ rotate: 12, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="rounded-full border border-[var(--border-color)] p-3 text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </motion.button>

            <NavLink
              to="/cart"
              className="hidden rounded-full border border-[var(--border-color)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] md:block"
            >
              Cart
            </NavLink>

            {isAuthenticated ? (
              <div className="hidden items-center gap-3 lg:flex">
                {user?.role === 'admin' && (
                  <NavLink
                    to="/admin"
                    className="rounded-full border border-[var(--border-color)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    Admin
                  </NavLink>
                )}
                <button
                  onClick={logout}
                  className="rounded-full border border-[var(--border-color)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {user?.name?.split(' ')[0]} / Logout
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="hidden rounded-full border border-[var(--border-color)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] lg:block"
              >
                Login
              </NavLink>
            )}

            <motion.button
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={openCart}
              className="relative rounded-full border border-[var(--border-color)] p-3 text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-black">
                {itemCount}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(true)}
              className="rounded-full border border-[var(--border-color)] p-3 text-[var(--text-primary)] md:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              aria-label="Close menu overlay"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-[var(--bg-primary)] p-6"
            >
              <div className="mb-10 flex items-center justify-between">
                <p className="font-display text-3xl">Kameez Wala</p>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-[var(--border-color)] p-2"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <NavLink
                      to={item.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl font-medium text-[var(--text-primary)] transition hover:text-[var(--accent)]"
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-6 inline-flex items-center gap-3 text-base font-semibold text-[var(--accent)]"
                >
                  <User size={18} />
                  Admin Interface
                </Link>
              )}

              <div className="mt-6 rounded-[1.4rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                    className="inline-flex items-center gap-3 text-base font-semibold"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex items-center gap-3 text-base font-semibold"
                  >
                    <User size={18} />
                    Login / Register
                  </Link>
                )}
              </div>

              <div className="mt-10 rounded-[1.75rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Categories</p>
                <div className="mt-4 space-y-3">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/shop?category=${category.id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-[1rem] px-3 py-2 transition hover:bg-[var(--accent-soft)]"
                    >
                      <p className="font-semibold">{category.short}</p>
                      <p className="text-sm text-[var(--text-muted)]">{category.label}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
