import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../lib/useCmsContent'

export default function HowItWorks() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cms = useCmsContent('howItWorks')

  const c = (key: string, fallback: string) => cms[key] || fallback

  return (
    <div className="bg-surface text-on-surface">
      {/* Hero */}
      <section className="relative min-h-[60vh] sm:min-h-[700px] flex flex-col justify-center px-4 sm:px-8 md:px-24 glow-nebula overflow-hidden py-24 sm:py-0">
        <div className="absolute top-20 right-[5%] sm:right-[15%] w-48 sm:w-96 h-48 sm:h-96 bg-secondary-container/20 rounded-full blur-[120px]" />
        <div className="max-w-4xl relative z-10">
          <span className="font-label text-sm uppercase tracking-[0.3em] text-secondary-container mb-6 block font-light">
            {c('label', t('howItWorks.label'))}
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-on-surface mb-6 sm:mb-8 tracking-tighter leading-[1.1]">
            {c('title', t('howItWorks.title')).split('Archival')[0]}
            Archival <span className="italic font-light text-secondary-container">Readings</span>
          </h1>
          <p className="font-body text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed sm:ml-[10%]">
            {c('subtitle', t('howItWorks.subtitle'))}
          </p>
        </div>
        <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-8 md:left-24 animate-bounce">
          <span className="material-symbols-outlined text-on-surface/40">arrow_downward</span>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 sm:space-y-36 lg:space-y-48">
        {/* Step I */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-1">
            <span className="font-headline text-6xl md:text-8xl text-secondary-container/30 select-none">I.</span>
          </div>
          <div className="md:col-span-6">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-6">{c('step1_title', t('howItWorks.step1Title'))}</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">{c('step1_body', t('howItWorks.step1Body'))}</p>
            <div className="flex items-center gap-4 text-secondary-container font-label text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>{c('step1_tag', t('howItWorks.step1Tag'))}</span>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] bg-surface-container overflow-hidden rounded-sm border border-outline-variant/20 shadow-2xl flex items-center justify-center">
              {cms.step1_image
                ? <img src={cms.step1_image} alt="Step I" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-on-surface/15 text-[8rem]">style</span>
              }
            </div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 glass-card-dark rounded-full flex items-center justify-center border border-secondary-container/30">
              <span className="material-symbols-outlined text-secondary-container text-4xl">star</span>
            </div>
          </div>
        </div>

        {/* Step II */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5 order-2 md:order-1 relative">
            <div className="aspect-[4/5] bg-surface-container-high overflow-hidden rounded-sm border border-outline-variant/20 shadow-2xl flex items-center justify-center">
              {cms.step2_image
                ? <img src={cms.step2_image} alt="Step II" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-on-surface/15 text-[8rem]">videocam</span>
              }
            </div>
            {!cms.step2_image && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center border border-secondary-container/50 shadow-[0_0_30px_rgba(115,3,3,0.45)]">
                  <span className="material-symbols-outlined text-on-secondary text-3xl">videocam</span>
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-6 order-1 md:order-2">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-6">{c('step2_title', t('howItWorks.step2Title'))}</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">{c('step2_body', t('howItWorks.step2Body'))}</p>
            <div className="flex items-center gap-4 text-secondary-container font-label text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined">waves</span>
              <span>{c('step2_tag', t('howItWorks.step2Tag'))}</span>
            </div>
          </div>
          <div className="md:col-span-1 order-3 text-right">
            <span className="font-headline text-6xl md:text-8xl text-secondary-container/30 select-none">II.</span>
          </div>
        </div>

        {/* Step III */}
        <div className="grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-1">
            <span className="font-headline text-6xl md:text-8xl text-secondary-container/30 select-none">III.</span>
          </div>
          <div className="md:col-span-6">
            <h2 className="font-headline text-3xl md:text-4xl text-on-surface mb-6">{c('step3_title', t('howItWorks.step3Title'))}</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">{c('step3_body', t('howItWorks.step3Body'))}</p>
            <div className="flex items-center gap-4 text-secondary-container font-label text-xs uppercase tracking-widest">
              <span className="material-symbols-outlined">menu_book</span>
              <span>{c('step3_tag', t('howItWorks.step3Tag'))}</span>
            </div>
          </div>
          <div className="md:col-span-5">
            {cms.step3_image ? (
              <div className="aspect-[4/5] overflow-hidden rounded-sm border border-outline-variant/20 shadow-2xl">
                <img src={cms.step3_image} alt="Step III" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="p-8 glass-card-dark border border-outline-variant/30 rounded-lg shadow-inner">
                <div className="flex justify-between items-start mb-12">
                  <div className="h-12 w-1 bg-secondary-container opacity-80" />
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-light">Archive ID: 772-ALX</span>
                </div>
                <div className="space-y-4 mb-12">
                  <div className="h-4 w-3/4 bg-on-surface/10 rounded-full" />
                  <div className="h-4 w-1/2 bg-on-surface/10 rounded-full" />
                  <div className="h-4 w-full bg-on-surface/10 rounded-full" />
                </div>
                <div className="aspect-square bg-surface-container-highest flex items-center justify-center rounded-sm">
                  <span className="material-symbols-outlined text-on-surface/30 text-6xl">picture_as_pdf</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Inside the Archive */}
      <section className="py-16 sm:py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">{c('archive_title', t('howItWorks.archiveTitle'))}</h2>
            <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">{c('archive_subtitle', t('howItWorks.archiveSubtitle'))}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'history_edu', title: 'Narrative Synthesis', body: 'A written exploration of the thread connecting your past, present, and potential futures.', cta: 'View Example' },
              { icon: 'photo_camera', title: 'Studio Imagery', body: 'Macro photography of the specific cards drawn, capturing the physical essence of your reading.', cta: 'View Gallery' },
              { icon: 'psychology', title: 'Thematic Mapping', body: 'Analysis of planetary transits and numerical patterns emerging within your spreads.', cta: 'View Mapping' },
            ].map((item) => (
              <div key={item.title} className="group p-8 bg-surface-container border border-outline-variant/10 rounded-lg hover:border-secondary/40 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-on-surface/50 mb-4 block text-2xl">{item.icon}</span>
                <h3 className="font-headline text-xl text-on-surface mb-3">{item.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">{item.body}</p>
                <div className="text-xs font-label uppercase tracking-widest text-secondary-container flex items-center gap-2">
                  {item.cta} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary-container/10 -z-10" />
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-px bg-secondary-container mx-auto mb-12" />
          <h2 className="font-headline text-4xl md:text-6xl text-on-surface mb-8">{c('cta_title', t('howItWorks.ctaTitle'))}</h2>
          <p className="text-on-surface-variant text-lg mb-12 leading-relaxed">{c('cta_body', t('howItWorks.ctaBody'))}</p>
          <button
            onClick={() => navigate('/book')}
            className="bg-secondary text-on-secondary px-10 py-5 rounded-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(115,3,3,0.25)] font-medium"
          >
            {c('cta_btn', t('howItWorks.ctaBtn'))}
          </button>
        </div>
      </section>
    </div>
  )
}
