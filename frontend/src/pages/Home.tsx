import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../lib/useCmsContent'

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const cms = useCmsContent('home')

  const c = (key: string, fallback: string) => cms[key] || fallback

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden celestial-bg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10 text-left w-full">
          <div>
            <span className="font-label text-secondary tracking-[0.4em] uppercase mb-6 block text-sm">
              {c('hero_label', t('home.heroLabel'))}
            </span>
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface mb-8 tracking-tight leading-tight font-light">
              {c('hero_title', t('home.heroTitle'))} <br />
              <span className="italic font-normal text-primary">{c('hero_subtitle', t('home.heroSubtitle'))}</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 leading-relaxed">
              {c('hero_body', t('home.heroBody'))}
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <button
                onClick={() => navigate('/book')}
                className="bg-secondary text-on-secondary px-10 py-4 rounded-sm font-label tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all font-medium"
              >
                {c('cta_primary', t('home.ctaPrimary'))}
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="border border-outline-variant/30 text-primary px-10 py-4 rounded-sm font-label tracking-widest uppercase hover:bg-primary-container/20 transition-all active:scale-95 font-medium"
              >
                {c('cta_secondary', t('home.ctaSecondary'))}
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-90 transition-transform group-hover:scale-100 duration-1000" />
            <div className="relative rounded-xl border border-outline-variant/20 overflow-hidden w-full h-[500px] bg-surface-container-high flex items-center justify-center">
              {cms.hero_image
                ? <img src={cms.hero_image} alt="Hero" className="w-full h-full object-cover" />
                : <span className="material-symbols-outlined text-secondary/20 text-[12rem]">auto_awesome</span>
              }
            </div>
            <div className="absolute -bottom-6 -right-6 p-6 glass-card rounded-lg border border-outline-variant/20 hidden md:block">
              <p className="font-headline italic text-secondary text-lg">
                "The stars are but a map <br /> to your inner world."
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-container/20 rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-[100px]" />
      </section>

      {/* USP Cards */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'person_search', title: c('usp1_title', t('home.usp1Title')), body: c('usp1_body', t('home.usp1Body')), elevated: false },
            { icon: 'auto_awesome', title: c('usp2_title', t('home.usp2Title')), body: c('usp2_body', t('home.usp2Body')), elevated: true },
            { icon: 'language', title: c('usp3_title', t('home.usp3Title')), body: c('usp3_body', t('home.usp3Body')), elevated: false },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-10 border border-outline-variant/10 rounded-lg group transition-all duration-500 ${
                card.elevated
                  ? 'bg-surface-container shadow-[0_20px_50px_rgba(75,0,130,0.15)]'
                  : 'hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-secondary text-4xl mb-6 block">{card.icon}</span>
              <h3 className="font-headline text-2xl mb-4 text-on-surface">{card.title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="font-label text-secondary-fixed-dim tracking-widest text-sm uppercase block mb-4">The Process</span>
              <h2 className="font-headline text-5xl text-on-surface leading-tight font-light">
                {c('process_title', t('home.processTitle'))}
              </h2>
            </div>
            <div className="h-px bg-outline-variant/30 flex-grow mx-8 hidden md:block mb-6" />
            <div className="text-secondary font-headline italic text-xl">◇ Sacred Geometry ◇</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-16">
              {[
                { num: 'I', title: c('step1_title', t('home.step1Title')), body: c('step1_body', t('home.step1Body')) },
                { num: 'II', title: c('step2_title', t('home.step2Title')), body: c('step2_body', t('home.step2Body')) },
                { num: 'III', title: c('step3_title', t('home.step3Title')), body: c('step3_body', t('home.step3Body')) },
              ].map((step) => (
                <div key={step.num} className="relative pl-12">
                  <span className="absolute left-0 top-0 font-headline text-4xl text-secondary-fixed-dim opacity-40">
                    {step.num}
                  </span>
                  <h4 className="font-headline text-2xl mb-4 text-on-surface">{step.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-outline-variant/20 bg-surface-container flex items-center justify-center">
                {cms.process_image
                  ? <img src={cms.process_image} alt="Process" className="w-full h-full object-cover" />
                  : <span className="material-symbols-outlined text-secondary/20 text-[10rem]">style</span>
                }
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 border border-secondary/20 rounded-full animate-[spin_20s_linear_infinite]" />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Bento Grid */}
      <section className="py-32 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="font-headline text-4xl md:text-5xl text-center mb-24 text-on-surface font-light">
            {c('explore_title', t('home.exploreTitle'))}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-3 h-96 glass-card rounded-xl p-8 flex flex-col justify-end group cursor-pointer relative overflow-hidden border border-outline-variant/10">
              <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
              <div className="relative z-10">
                <span className="material-symbols-outlined text-secondary text-4xl mb-4 block">favorite</span>
                <h3 className="font-headline text-3xl mb-2 text-primary">Love &amp; Relationships</h3>
                <p className="text-on-surface-variant">Navigate the currents of connection and emotional resonance.</p>
              </div>
            </div>
            <div className="md:col-span-3 h-96 bg-surface-container-high rounded-xl p-8 flex flex-col justify-end group cursor-pointer border border-outline-variant/10 relative overflow-hidden">
              <h3 className="font-headline text-3xl mb-2 text-secondary">Career &amp; Purpose</h3>
              <p className="text-on-surface-variant">Uncover the dharma of your professional trajectory.</p>
            </div>
            <div className="md:col-span-2 h-80 bg-surface-container rounded-xl p-8 flex flex-col justify-end cursor-pointer border border-outline-variant/10">
              <h3 className="font-headline text-2xl mb-2 text-on-surface">Personal Growth</h3>
              <p className="text-on-surface-variant">Inner alchemy and self-realization.</p>
            </div>
            <div className="md:col-span-2 h-80 glass-card rounded-xl p-8 flex flex-col justify-end cursor-pointer border border-outline-variant/10">
              <h3 className="font-headline text-2xl mb-2 text-on-surface">Life Decisions</h3>
              <p className="text-on-surface-variant">Clarity for the crossroads you face today.</p>
            </div>
            <div className="md:col-span-2 h-80 bg-surface-container rounded-xl p-8 flex flex-col justify-end cursor-pointer border border-outline-variant/10">
              <h3 className="font-headline text-2xl mb-2 text-on-surface">Spiritual Path</h3>
              <p className="text-on-surface-variant">Deepen your connection to the unseen.</p>
            </div>
            <div className="md:col-span-6 h-48 bg-primary-container/20 rounded-xl p-8 flex items-center justify-between cursor-pointer border border-primary/20 group">
              <div>
                <h3 className="font-headline text-3xl mb-2 text-on-surface">General Guidance</h3>
                <p className="text-on-surface-variant">A holistic overview of your current astrological climate.</p>
              </div>
              <span className="material-symbols-outlined text-6xl text-primary/30 group-hover:text-primary transition-colors">diamond</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-surface text-center">
        <div className="max-w-4xl mx-auto px-6">
          <span className="text-secondary text-3xl mb-12 block">◆ ◆ ◆</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { text: c('t1', t('home.t1')), author: c('t1_author', t('home.t1author')) },
              { text: c('t2', t('home.t2')), author: c('t2_author', t('home.t2author')) },
              { text: c('t3', t('home.t3')), author: c('t3_author', t('home.t3author')) },
            ].map((testimonial, i) => (
              <div key={i} className="italic font-headline text-lg leading-relaxed text-on-surface px-4">
                {testimonial.text}
                <span className="block mt-6 not-italic font-label text-sm tracking-widest text-secondary">
                  {testimonial.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-container/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-8 text-center relative z-10">
          <h2 className="font-headline text-5xl md:text-7xl mb-12 text-on-surface font-light">
            {c('final_cta', t('home.finalCta'))}
          </h2>
          <button
            onClick={() => navigate('/book')}
            className="bg-secondary text-on-secondary px-12 py-5 rounded-sm font-label tracking-[0.2em] uppercase text-lg hover:scale-105 transition-all shadow-[0_10px_30px_rgba(201,168,76,0.2)] font-medium"
          >
            {c('schedule_btn', t('home.scheduleBtn'))}
          </button>
        </div>
      </section>
    </div>
  )
}
