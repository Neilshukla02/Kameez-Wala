import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, login, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/shop', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(form)
      navigate('/shop', { replace: true })
    } catch {
      return
    }
  }

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell">
            <SectionHeading eyebrow="Login" title="Access your luxury shopping account" copy="Authenticate with JWT-backed login to save your cart, place orders, and continue your browsing flow." />
          </div>
          <motion.form initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="section-shell grid gap-5">
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none" />
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none" />
            <AnimatedButton type="submit" variant="gold">{loading ? 'Signing In...' : 'Login'}</AnimatedButton>
            <p className="text-sm text-[var(--text-muted)]">New here? <Link to="/register" className="text-[var(--accent)]">Create an account</Link></p>
          </motion.form>
        </div>
      </section>
    </AnimatedPage>
  )
}
