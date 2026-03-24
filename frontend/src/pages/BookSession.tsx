import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getAvailabilities, createBooking } from '../lib/api'
import { useCmsContent } from '../lib/useCmsContent'
import type { Availability } from '../lib/types'

const FOCUSES = [
  { key: 'focus1', icon: 'favorite' },
  { key: 'focus2', icon: 'stars' },
  { key: 'focus3', icon: 'brightness_4' },
  { key: 'focus4', icon: 'auto_awesome' },
]

export default function BookSession() {
  const { t } = useTranslation()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const cms = useCmsContent('book')
  const c = (key: string, fallback: string) => cms[key] || fallback

  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string>('deep')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null)
  const [clientName, setClientName] = useState(user?.name || '')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getAvailabilities().then((r) => setAvailabilities(r.data)).catch(() => {})
  }, [])

  // Group slots by date
  const byDate = availabilities.reduce<Record<string, Availability[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {})

  const availableDates = Object.keys(byDate).sort()
  const slotsForDate = selectedDate ? (byDate[selectedDate] || []) : []

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) { navigate('/login'); return }
    if (!selectedFocus) { setError(t('book.errorFocus')); return }
    if (!selectedSlot) { setError(t('book.errorSlot')); return }
    setError(null)
    setLoading(true)
    try {
      await createBooking({
        availabilityId: selectedSlot.id,
        clientName: clientName || user?.name || '',
        notes: notes ? `[${selectedFocus}] ${notes}` : `[${selectedFocus}]`,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen celestial-bg flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <div className="text-secondary-container text-5xl mb-8">✦</div>
          <h2 className="font-headline text-4xl md:text-5xl text-on-surface mb-6">{c('success_title', t('book.successTitle'))}</h2>
          <p className="text-on-surface-variant text-lg mb-12">{c('success_body', t('book.successBody'))}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-secondary text-on-secondary px-10 py-4 rounded-sm font-label tracking-widest uppercase hover:brightness-110 transition-all font-medium"
          >
            {t('nav.dashboard')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Fixed glow orbs */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="pt-16 pb-24 px-6 md:px-12 max-w-screen-xl mx-auto celestial-bg min-h-screen">
        {/* Hero */}
        <section className="mb-24 text-center pt-8">
          <h1 className="font-headline text-5xl md:text-7xl mb-6 tracking-tight italic text-on-surface">
            {c('hero_title', t('book.title'))}
          </h1>
          <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl font-light leading-relaxed">
            {c('hero_subtitle', t('book.subtitle'))}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-on-surface/30">
            <span className="text-xl">✦</span>
            <span className="text-xl">◇</span>
            <span className="text-xl">◆</span>
          </div>
        </section>

        {!isAuthenticated && (
          <div className="mb-12 p-6 border border-secondary/30 rounded-lg bg-secondary/5 text-center">
            <p className="text-on-surface-variant mb-4">{t('book.loginRequired')}</p>
            <Link
              to="/login"
              className="bg-secondary text-on-secondary px-8 py-3 rounded-sm font-label tracking-widest uppercase hover:brightness-110 transition-all font-medium"
            >
              {t('nav.login')}
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-32">
          {/* Step I */}
          <section className="editorial-grid">
            <div className="col-span-12 md:col-span-3">
              <div className="md:sticky md:top-40">
                <span className="font-headline text-secondary-container text-3xl block mb-4 italic">{c('step1_label', t('book.step1Label'))}</span>
                <h2 className="font-headline text-4xl mb-6 leading-tight">{c('step1_title', t('book.step1Title'))}</h2>
                <p className="text-on-surface-variant font-light">{c('step1_desc', t('book.step1Desc'))}</p>
              </div>
            </div>
            <div className="col-span-12 md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FOCUSES.map((f) => (
                <div
                  key={f.key}
                  onClick={() => setSelectedFocus(f.key)}
                  className={`tarot-border glass-card-dark p-8 cursor-pointer transition-all duration-300 relative overflow-hidden rounded-sm border ${
                    selectedFocus === f.key ? 'border-secondary bg-secondary-container/20' : 'border-transparent'
                  }`}
                >
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <span className="material-symbols-outlined text-9xl text-on-surface/40">{f.icon}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface/45 mb-6 text-3xl block">{f.icon}</span>
                  <h3 className="font-headline text-2xl mb-2">{c(`${f.key}_title`, t(`book.${f.key}Title`))}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{c(`${f.key}_desc`, t(`book.${f.key}Desc`))}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step II */}
          <section className="editorial-grid">
            <div className="col-span-12 md:col-span-3">
              <span className="font-headline text-secondary-container text-3xl block mb-4 italic">{c('step2_label', t('book.step2Label'))}</span>
              <h2 className="font-headline text-4xl mb-6">{c('step2_title', t('book.step2Title'))}</h2>
            </div>
            <div className="col-span-12 md:col-span-9 flex flex-col md:flex-row gap-8">
              {/* Standard */}
              <div
                onClick={() => setSelectedDuration('standard')}
                className={`flex-1 cursor-pointer p-8 border transition-colors text-center relative overflow-hidden ${
                  selectedDuration === 'standard'
                    ? 'border-2 border-secondary bg-surface-container'
                    : 'border-outline-variant hover:border-secondary'
                }`}
              >
                <h4 className={`font-label uppercase tracking-widest text-xs mb-4 ${selectedDuration === 'standard' ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                  {c('duration_standard', t('book.durationStandard'))}
                </h4>
                <div className="font-headline text-4xl mb-2">{c('duration_standard_time', '30 min')}</div>
                <div className="text-on-surface text-2xl">{c('price_standard', '$85')}</div>
              </div>
              {/* Deep */}
              <div
                onClick={() => setSelectedDuration('deep')}
                className={`flex-1 cursor-pointer p-8 border transition-colors text-center relative overflow-hidden ${
                  selectedDuration === 'deep'
                    ? 'border-2 border-secondary bg-surface-container'
                    : 'border-outline-variant hover:border-secondary'
                }`}
              >
                <div className="absolute top-0 right-0 bg-secondary text-on-secondary px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  {t('book.recommended')}
                </div>
                <h4 className={`font-label uppercase tracking-widest text-xs mb-4 ${selectedDuration === 'deep' ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                  {c('duration_deep', t('book.durationDeep'))}
                </h4>
                <div className="font-headline text-4xl mb-2">{c('duration_deep_time', '60 min')}</div>
                <div className="text-on-surface text-2xl">{c('price_deep', '$150')}</div>
              </div>
            </div>
          </section>

          {/* Step III — Date & Time */}
          <section className="editorial-grid">
            <div className="col-span-12 md:col-span-3">
              <span className="font-headline text-secondary-container text-3xl block mb-4 italic">{c('step3_label', t('book.step3Label'))}</span>
              <h2 className="font-headline text-4xl mb-6">{c('step3_title', t('book.step3Title'))}</h2>
            </div>
            <div className="col-span-12 md:col-span-9 space-y-8">
              {/* Date picker */}
              <div className="glass-card-dark border border-outline-variant/20 p-6 rounded-lg">
                <h4 className="font-label text-xs uppercase tracking-widest mb-4 text-on-surface-variant">Select Date</h4>
                <div className="flex flex-wrap gap-3">
                  {availableDates.length === 0 && (
                    <p className="text-on-surface-variant text-sm">{t('book.noSlots')}</p>
                  )}
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      type="button"
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null) }}
                      className={`px-4 py-3 font-headline text-sm transition-all ${
                        selectedDate === date
                          ? 'bg-secondary text-on-secondary'
                          : 'border border-outline-variant hover:border-secondary-container hover:text-secondary-container'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="glass-card-dark border border-outline-variant/20 p-6 rounded-lg">
                  <h4 className="font-label text-xs uppercase tracking-widest mb-6 text-on-surface-variant">
                    {t('book.availableWindows')}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {slotsForDate.length === 0 && (
                      <p className="text-on-surface-variant text-sm col-span-4">{t('book.noSlots')}</p>
                    )}
                    {slotsForDate.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-2 border text-center font-headline text-sm transition-all ${
                          selectedSlot?.id === slot.id
                            ? 'bg-secondary text-on-secondary border-secondary'
                            : 'border-outline-variant hover:border-secondary'
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Step IV */}
          <section className="editorial-grid">
            <div className="col-span-12 md:col-span-3">
              <span className="font-headline text-secondary-container text-3xl block mb-4 italic">{c('step4_label', t('book.step4Label'))}</span>
              <h2 className="font-headline text-4xl mb-6">{c('step4_title', t('book.step4Title'))}</h2>
            </div>
            <div className="col-span-12 md:col-span-9 space-y-12">
              <div>
                <label className="block font-headline text-secondary-container text-xs uppercase tracking-widest mb-2">
                  {c('field_name', t('book.fullName'))}
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={c('name_placeholder', t('book.namePlaceholder'))}
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary py-4 text-on-surface placeholder:text-outline/40 outline-none"
                />
              </div>
              <div>
                <label className="block font-headline text-secondary-container text-xs uppercase tracking-widest mb-2">
                  {c('field_notes', t('book.notes'))}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={c('notes_placeholder', t('book.notesPlaceholder'))}
                  rows={4}
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary py-4 text-on-surface placeholder:text-outline/40 resize-none outline-none"
                />
              </div>

              {error && (
                <p className="text-error text-sm font-label tracking-wide">{error}</p>
              )}

              <div className="pt-8 text-center md:text-left">
                <button
                  type="submit"
                  disabled={loading || !isAuthenticated}
                  className="bg-secondary text-on-secondary px-12 py-5 rounded-sm font-headline text-xl italic tracking-tight hover:scale-95 hover:shadow-[0_0_30px_rgba(115,3,3,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '✦' : c('submit_btn', t('book.submit'))}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  )
}
