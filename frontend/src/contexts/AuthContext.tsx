import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api, { login as apiLogin, register as apiRegister, logout as apiLogout } from '../lib/api'
import type { User } from '../lib/types'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('ce_token'))
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('ce_token'))

  useEffect(() => {
    if (!token) { setIsLoading(false); return }
    api.get('/user')
      .then((r) => setUser(r.data))
      .catch(() => { localStorage.removeItem('ce_token'); setToken(null) })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = async (email: string, password: string) => {
    const { data } = await apiLogin({ email, password })
    localStorage.setItem('ce_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await apiRegister({ name, email, password })
    localStorage.setItem('ce_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    apiLogout().catch(() => {})
    localStorage.removeItem('ce_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
