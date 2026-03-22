import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen celestial-bg flex items-center justify-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="text-3xl font-headline italic text-secondary tracking-tighter block mb-8">
            wild.yet.sacred
          </Link>
          <div className="w-12 h-px bg-secondary/40 mx-auto mb-8" />
          <h1 className="font-headline text-4xl text-on-surface mb-3">{t('auth.loginTitle')}</h1>
          <p className="text-on-surface-variant font-light">{t('auth.loginSubtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-headline text-secondary text-xs uppercase tracking-widest mb-2">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary py-4 text-on-surface placeholder:text-outline/40 outline-none transition-colors"
              placeholder="astral@archives.com"
            />
          </div>
          <div>
            <label className="block font-headline text-secondary text-xs uppercase tracking-widest mb-2">
              {t('auth.password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-0 border-b border-outline-variant focus:border-secondary py-4 text-on-surface placeholder:text-outline/40 outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-error text-sm font-label tracking-wide" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-on-secondary py-4 rounded-sm font-label tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? '✦' : t('auth.loginBtn')}
          </button>
        </form>

        <p className="text-center mt-8 text-on-surface-variant text-sm">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:text-secondary transition-colors">
            {t('auth.signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
