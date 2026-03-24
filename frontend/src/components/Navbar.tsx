import { useState, useEffect, useRef } from 'react'
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
  const navRef = useRef<HTMLDivElement>(null)

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isActive = (path: string) => location.pathname === path
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'es' : 'en')

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/about', label: t('nav.about') },
    { to: '/book', label: t('nav.book') },
  ]

  return (
    <nav ref={navRef} className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-high/30 shadow-[0_20px_50px_rgba(59,12,12,0.15)]">
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">

        {/* Brand */}
        <Link to="/" className="text-xl sm:text-2xl font-headline italic text-secondary tracking-tighter font-light shrink-0">
          wild.yet.sacred
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`font-headline antialiased tracking-tight transition-colors duration-300 ${
                isActive(to)
                  ? 'text-secondary border-b border-secondary pb-1'
                  : 'text-on-surface/70 hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Language — desktop only */}
          <button
            onClick={toggleLang}
            className="hidden sm:block text-on-surface/50 text-xs uppercase tracking-widest hover:text-primary transition-colors"
          >
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>

          {/* Auth — desktop only */}
          {isAuthenticated ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="text-primary font-label text-sm tracking-widest uppercase hover:opacity-80 transition-opacity"
              >
                {user?.name?.split(' ')[0]} ▾
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-[0_20px_50px_rgba(59,12,12,0.35)] z-50">
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
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-on-surface/70 hover:text-primary transition-colors text-sm font-label uppercase tracking-widest"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="bg-secondary text-on-secondary px-5 py-2 rounded-sm text-sm font-label tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all font-medium"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Animated hamburger button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] text-on-surface"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-px w-5 bg-current transition-all duration-300 ease-in-out origin-center ${
                menuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition-all duration-300 ease-in-out ${
                menuOpen ? 'opacity-0 scale-x-0' : ''
              }`}
            />
            <span
              className={`block h-px w-5 bg-current transition-all duration-300 ease-in-out origin-center ${
                menuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu — animated slide-down */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-surface/97 backdrop-blur-xl border-t border-outline-variant/20 px-6 py-6 flex flex-col">
          {/* Nav links */}
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`font-headline text-lg py-3 border-b border-outline-variant/10 last:border-0 transition-colors ${
                isActive(to) ? 'text-secondary' : 'text-on-surface/70 active:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Auth section */}
          <div className="pt-6 mt-2 border-t border-outline-variant/20 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <p className="text-primary font-label text-xs tracking-widest uppercase opacity-60 pb-1">
                  {user?.name}
                </p>
                {user?.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="font-label text-sm tracking-widest text-secondary uppercase py-2"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="font-label text-sm tracking-widest text-on-surface/70 uppercase py-2"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left font-label text-sm tracking-widest text-error/70 uppercase py-2"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center bg-secondary text-on-secondary py-3 rounded-sm text-sm font-label tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all font-medium"
                >
                  {t('nav.register')}
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-center border border-outline-variant/30 text-on-surface/70 py-3 rounded-sm text-sm font-label tracking-widest uppercase hover:text-primary hover:border-primary/40 transition-colors"
                >
                  {t('nav.login')}
                </Link>
              </div>
            )}

            {/* Language toggle */}
            <button
              onClick={() => { toggleLang(); setMenuOpen(false) }}
              className="text-left text-on-surface/40 text-xs uppercase tracking-widest pt-2 hover:text-primary transition-colors"
            >
              {i18n.language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
