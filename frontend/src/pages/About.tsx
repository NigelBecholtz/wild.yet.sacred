import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../lib/useCmsContent'

export default function About() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cms = useCmsContent('about')

  const c = (key: string, fallback: string) => cms[key] || fallback

  return (
    <div className="bg-surface text-on-surface">
      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[700px] flex items-center glow-nebula overflow-hidden px-4 sm:px-6 lg:px-8 py-20 sm:py-0">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute -top-6 -left-6 text-on-surface/15 font-headline text-6xl sm:text-8xl select-none font-light">I</div>
            <span className="inline-block text-secondary-container font-label text-sm tracking-[0.3em] uppercase mb-6 font-light">
              {c('label', t('about.label'))}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-headline italic tracking-tighter text-on-surface leading-none mb-6 sm:mb-8">
              {c('title', t('about.title'))} <br />
              <span className="text-secondary-container ml-6 sm:ml-12 md:ml-24">{c('title_accent', t('about.titleAccent'))}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed">
              {c('subtitle', t('about.subtitle'))}
            </p>
          </div>
          <div className="order-1 md:order-2 relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-container-high border border-outline-variant/20 flex items-center justify-center">
            {cms.hero_image
              ? <img src={cms.hero_image} alt="The Archivist" className="w-full h-full object-cover" />
              : <span className="material-symbols-outlined text-on-surface/15 text-[10rem]">person</span>
            }
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-8 sm:gap-12">
          <div className="md:col-span-4 flex flex-col justify-center">
            <span className="text-secondary-container font-label text-sm tracking-widest mb-4 font-light">{c('biography_label', t('about.biographyLabel'))}</span>
            <h2 className="text-4xl font-headline text-on-surface mb-8">{c('biography_title', t('about.biographyTitle'))}</h2>
            <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm mb-8 md:mb-0 border border-outline-variant/10 bg-surface-container flex items-center justify-center">
              {cms.biography_image
                ? <img src={cms.biography_image} alt="Biography" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-on-surface/15 text-[8rem]">menu_book</span>
              }
            </div>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-8 flex flex-col justify-center">
            <p className="text-xl font-body leading-relaxed text-on-surface/90">{c('bio1', t('about.bio1'))}</p>
            <p className="text-lg text-on-surface-variant leading-relaxed">{c('bio2', t('about.bio2'))}</p>
            <div className="pt-8 flex items-center gap-4 text-secondary-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <hr className="w-24 border-outline-variant/30" />
              <span className="font-headline italic">wild.yet.sacred</span>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-6 sm:p-12 md:p-24 bg-surface-container-highest/60 backdrop-blur-xl rounded-sm border border-outline-variant/10 overflow-hidden flex flex-col md:flex-row gap-8 sm:gap-12">
            <div className="absolute top-0 right-0 p-8 text-on-surface/20 hidden md:block">
              <span className="material-symbols-outlined text-8xl">auto_awesome</span>
            </div>
            <div className="max-w-xl">
              <span className="text-secondary-container font-label text-xs tracking-[0.2em] uppercase mb-4 block font-light">
                {c('mission_label', t('about.missionLabel'))}
              </span>
              <h2 className="text-5xl font-headline text-on-surface mb-12">{c('mission_title', t('about.missionTitle'))}</h2>
              <div className="space-y-6 text-lg text-on-surface-variant italic font-headline">
                <p>{c('quote1', t('about.quote1'))}</p>
                <p>{c('quote2', t('about.quote2'))}</p>
              </div>
            </div>
            <div className="flex-1 relative min-h-[300px] md:min-h-auto bg-surface-container rounded-sm border border-outline-variant/20 flex items-center justify-center overflow-hidden">
              {cms.philosophy_image
                ? <img src={cms.philosophy_image} alt="Philosophy" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-on-surface/15 text-[8rem]">auto_awesome</span>
              }
            </div>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 sm:mb-16 gap-4 sm:gap-6">
            <h2 className="text-3xl sm:text-4xl font-headline text-on-surface">{c('credentials_title', t('about.credentialsTitle'))}</h2>
            <span className="text-secondary-container font-label text-sm tracking-widest uppercase font-light">{c('credentials_label', t('about.credentialsLabel'))}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {[
              { num: '01.', icon: 'menu_book', title: c('cred1_title', t('about.cred1Title')), body: c('cred1_body', t('about.cred1Body')) },
              { num: '02.', icon: 'description', title: c('cred2_title', t('about.cred2Title')), body: c('cred2_body', t('about.cred2Body')) },
              { num: '03.', icon: 'history_edu', title: c('cred3_title', t('about.cred3Title')), body: c('cred3_body', t('about.cred3Body')) },
            ].map((card) => (
              <div
                key={card.num}
                className="bg-surface-container p-8 sm:p-10 flex flex-col justify-between min-h-[280px] sm:aspect-square border border-outline-variant/10 group hover:bg-surface-container-high transition-colors"
              >
                <div>
                  <span className="text-secondary-container text-2xl mb-6 block font-headline font-light">{card.num}</span>
                  <h3 className="text-xl font-headline text-on-surface mb-4">{card.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{card.body}</p>
                </div>
                <span className="material-symbols-outlined text-outline/30 group-hover:text-on-surface transition-colors">{card.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-40 px-4 sm:px-8 relative overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 bg-secondary-container/10 -z-10" />
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-headline mb-8 sm:mb-12 italic text-on-surface">
            {c('cta_title', t('about.ctaTitle'))}
          </h2>
          <button
            onClick={() => navigate('/book')}
            className="border border-secondary-container text-on-surface px-12 py-5 text-sm font-label tracking-[0.2em] uppercase rounded-sm hover:bg-secondary hover:text-on-secondary transition-all duration-300 shadow-[0_20px_50px_rgba(59,12,12,0.2)] font-light"
          >
            {c('cta_btn', t('about.ctaBtn'))}
          </button>
          <div className="mt-12 flex justify-center items-center gap-6">
            <hr className="w-12 border-secondary/30" />
            <span className="text-on-surface-variant text-xs tracking-widest font-label uppercase italic">{c('cta_note', t('about.ctaNote'))}</span>
            <hr className="w-12 border-secondary/30" />
          </div>
        </div>
      </section>
    </div>
  )
}
