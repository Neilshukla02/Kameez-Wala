import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'

const AuthContext = createContext(null)
const storageKey = 'kameez-wala-auth'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(storageKey)
    return stored ? JSON.parse(stored) : { user: null, token: null }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(auth))
  }, [auth])

  const register = async (payload) => {
    try {
      setLoading(true)
      const { data } = await api.post('/auth/register', payload)
      setAuth({ user: data, token: data.token })
      toast.success('Welcome to Kameez Wala')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (payload) => {
    try {
      setLoading(true)
      const { data } = await api.post('/auth/login', payload)
      setAuth({ user: data, token: data.token })
      toast.success('Logged in successfully')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuth({ user: null, token: null })
    toast.success('Logged out')
  }

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      isAuthenticated: Boolean(auth.token),
      loading,
      register,
      login,
      logout,
    }),
    [auth, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
