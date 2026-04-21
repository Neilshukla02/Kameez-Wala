import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import CartSidebar from './components/CartSidebar'
import CustomCursor from './components/CustomCursor'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Preloader from './components/Preloader'
import AboutPage from './pages/AboutPage'
import AdminInterfacePage from './pages/AdminInterfacePage'
import CartPage from './pages/CartPage'
import CollectionPage from './pages/CollectionPage'
import ContactPage from './pages/ContactPage'
import CustomerInterfacePage from './pages/CustomerInterfacePage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import RegisterPage from './pages/RegisterPage'

const themeKey = 'kameez-wala-theme'

function AppShell() {
  const location = useLocation()
  const { pathname } = location
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem(themeKey)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
    setIsDarkMode(shouldUseDark)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem(themeKey, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <>
      <AnimatePresence mode="wait">{isLoading && <Preloader key="preloader" />}</AnimatePresence>
      <div className="relative min-h-screen">
        <CustomCursor />
        <Navbar
          isDarkMode={isDarkMode}
          toggleTheme={() => setIsDarkMode((value) => !value)}
          openCart={() => setIsCartOpen(true)}
        />
        <AnimatePresence mode="wait">
          <Routes key={pathname} location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<CollectionPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/customer" element={<CustomerInterfacePage />} />
            <Route path="/admin" element={<AdminInterfacePage />} />
            <Route path="/product/:productId" element={<ProductDetailsPage openCart={() => setIsCartOpen(true)} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  )
}

export default function App() {
  return <AppShell />
}
