import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'

const AuthContext = createContext(null)
const storageKey = 'kameez-wala-auth'

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(storageKey)
    if (!stored) {
      return { user: null, token: null }
    }

    const parsed = JSON.parse(stored)
    return {
      user: parsed?.user ?? null,
      token: parsed?.token ?? null,
    }
  } catch {
    return { user: null, token: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getStoredAuth)
  const [loading, setLoading] = useState(false)
  const [isHydrating, setIsHydrating] = useState(Boolean(getStoredAuth().token))

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(auth))
  }, [auth])

  useEffect(() => {
    if (!auth.token) {
      setIsHydrating(false)
      return
    }

    let isMounted = true

    const syncCurrentUser = async () => {
      try {
        const { data } = await api.get('/auth/me')
        if (!isMounted) {
          return
        }

        setAuth((current) => ({
          user: data,
          token: current.token,
        }))
      } catch {
        if (!isMounted) {
          return
        }

        setAuth({ user: null, token: null })
      } finally {
        if (isMounted) {
          setIsHydrating(false)
        }
      }
    }

    syncCurrentUser()

    return () => {
      isMounted = false
    }
  }, [auth.token])

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
      isAuthenticated: Boolean(auth.token && auth.user),
      loading: loading || isHydrating,
      register,
      login,
      logout,
    }),
    [auth, loading, isHydrating],
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
