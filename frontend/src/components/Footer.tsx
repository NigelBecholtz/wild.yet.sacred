import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-primary-container/10 py-16 shadow-[0_-20px_50px_rgba(75,0,130,0.1)]">
      <div className="w-full flex flex-col items-center text-center space-y-8 px-4">
        <div className="text-3xl font-headline italic text-secondary tracking-tighter">
          {t('footer.brand')}
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          <Link
            to="#"
            className="font-body text-sm tracking-widest uppercase text-on-surface/60 hover:text-secondary hover:tracking-wider transition-all duration-300"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to="#"
            className="font-body text-sm tracking-widest uppercase text-on-surface/60 hover:text-secondary hover:tracking-wider transition-all duration-300"
          >
            {t('footer.terms')}
          </Link>
          <Link
            to="#"
            className="font-body text-sm tracking-widest uppercase text-on-surface/60 hover:text-secondary hover:tracking-wider transition-all duration-300"
          >
            {t('footer.guidelines')}
          </Link>
        </div>
        <div className="flex space-x-10">
          <a href="#" className="text-secondary transition-all duration-300 hover:opacity-80">
            <span className="material-symbols-outlined text-2xl">language</span>
          </a>
          <a href="#" className="text-secondary transition-all duration-300 hover:opacity-80">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </a>
          <a href="#" className="text-secondary transition-all duration-300 hover:opacity-80">
            <span className="material-symbols-outlined text-2xl">mail</span>
          </a>
        </div>
        <div className="text-on-surface/40 font-label text-xs tracking-[0.2em] uppercase pt-4">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
