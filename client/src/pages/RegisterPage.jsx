import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AnimatedButton from '../components/AnimatedButton'
import AnimatedPage from '../components/AnimatedPage'
import SectionHeading from '../components/SectionHeading'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await register(form)
      navigate('/shop')
    } catch {
      return
    }
  }

  return (
    <AnimatedPage>
      <section className="px-4 pt-32 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell">
            <SectionHeading eyebrow="Register" title="Create a Kameez Wala account" copy="Your profile unlocks persistent carts, order history, and the full authenticated MERN commerce flow." />
          </div>
          <motion.form initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="section-shell grid gap-5">
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Full name" className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none" />
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none" />
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" className="rounded-[1.3rem] border border-[var(--border-color)] bg-[var(--bg-secondary)] px-5 py-4 outline-none" />
            <AnimatedButton type="submit" variant="gold">{loading ? 'Creating...' : 'Register'}</AnimatedButton>
            <p className="text-sm text-[var(--text-muted)]">Already have an account? <Link to="/login" className="text-[var(--accent)]">Login</Link></p>
          </motion.form>
        </div>
      </section>
    </AnimatedPage>
  )
}
