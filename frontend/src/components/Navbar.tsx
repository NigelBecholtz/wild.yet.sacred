import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`font-headline antialiased tracking-tight transition-colors duration-300 ${
        isActive(to)
          ? 'text-secondary border-b border-secondary pb-1'
          : 'text-on-surface/70 hover:text-primary'
      }`}
    >
      {label}
    </Link>
  )

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-high/30 shadow-[0_20px_50px_rgba(75,0,130,0.1)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Brand */}
        <Link to="/" className="text-2xl font-headline italic text-secondary tracking-tighter font-light">
          wild.yet.sacred
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLink('/', t('nav.home'))}
          {navLink('/how-it-works', t('nav.howItWorks'))}
          {navLink('/about', t('nav.about'))}
          {navLink('/book', t('nav.book'))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLang}
            className="text-on-surface/50 text-xs uppercase tracking-widest hover:text-primary transition-colors hidden sm:block"
          >
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="text-primary font-label text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
              >
                {user?.name?.split(' ')[0]} ▾
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-[0_20px_50px_rgba(75,0,130,0.3)] z-50">
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-label tracking-widest text-secondary uppercase hover:bg-surface-container-highest transition-colors"
                    >
                      {t('nav.admin')}
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-label tracking-widest text-on-surface uppercase hover:bg-surface-container-highest transition-colors"
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm font-label tracking-widest text-error/80 uppercase hover:bg-surface-container-highest transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-on-surface/70 hover:text-primary transition-colors text-sm font-label uppercase tracking-widest"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="bg-secondary text-on-secondary px-6 py-2 rounded-sm text-sm font-label tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all font-medium"
              >
                {t('nav.register')}
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden text-on-surface"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-t border-outline-variant/20 px-8 py-6 flex flex-col gap-4">
          {[
            ['/', t('nav.home')],
            ['/how-it-works', t('nav.howItWorks')],
            ['/about', t('nav.about')],
            ['/book', t('nav.book')],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`font-headline text-lg ${isActive(to) ? 'text-secondary' : 'text-on-surface/70'}`}
            >
              {label}
            </Link>
          ))}
          <button onClick={toggleLang} className="text-left text-on-surface/50 text-xs uppercase tracking-widest">
            {i18n.language === 'en' ? 'Español' : 'English'}
          </button>
        </div>
      )}
    </nav>
  )
}
