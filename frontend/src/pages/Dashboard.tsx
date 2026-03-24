import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { getMyBookings, cancelBooking } from '../lib/api'
import type { Booking } from '../lib/types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-on-surface border-secondary/30 bg-secondary/10',
  confirmed: 'text-on-surface border-secondary-container/30 bg-secondary-container/10',
  completed: 'text-on-surface-variant border-outline-variant/30 bg-surface-container',
  cancelled: 'text-error/70 border-error/20 bg-error/5',
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    getMyBookings()
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false))
  }, [])

  const upcoming = bookings.filter((b) => ['pending', 'confirmed'].includes(b.status))
  const past = bookings.filter((b) => ['completed', 'cancelled'].includes(b.status))

  const handleCancel = async (id: number) => {
    setCancellingId(id)
    try {
      await cancelBooking(id)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
      )
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (date: string) =>
    new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-on-surface font-headline italic text-4xl animate-pulse">✦</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest py-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span className="font-label text-on-surface text-xs tracking-[0.3em] uppercase block mb-4">◆ Personal Archive</span>
          <h1 className="font-headline text-5xl md:text-6xl text-on-surface font-light mb-4">
            {t('dashboard.title')}
          </h1>
          <p className="text-on-surface-variant">
            {t('dashboard.welcome')} <span className="text-on-surface">{user?.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { label: 'Upcoming', count: upcoming.length, color: 'text-on-surface' },
            { label: 'Completed', count: bookings.filter(b => b.status === 'completed').length, color: 'text-on-surface' },
            { label: 'Total', count: bookings.length, color: 'text-on-surface' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container border border-outline-variant/10 p-6 rounded-lg text-center">
              <div className={`font-headline text-4xl mb-2 ${stat.color}`}>{stat.count}</div>
              <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Book new */}
        <div className="mb-16">
          <button
            onClick={() => navigate('/book')}
            className="bg-secondary text-on-secondary px-8 py-3 rounded-sm font-label tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all font-medium"
          >
            + {t('dashboard.bookNew')}
          </button>
        </div>

        {/* Upcoming */}
        <section className="mb-16">
          <h2 className="font-headline text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/20">
            {t('dashboard.upcoming')}
          </h2>
          {upcoming.length === 0 ? (
            <p className="text-on-surface-variant italic font-headline">{t('dashboard.noUpcoming')}</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                  cancelling={cancellingId === b.id}
                  formatDate={formatDate}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="font-headline text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/20">
              {t('dashboard.past')}
            </h2>
            <div className="space-y-4">
              {past.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  onCancel={handleCancel}
                  cancelling={cancellingId === b.id}
                  formatDate={formatDate}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function BookingCard({
  booking,
  onCancel,
  cancelling,
  formatDate,
  t,
}: {
  booking: Booking
  onCancel: (id: number) => void
  cancelling: boolean
  formatDate: (d: string) => string
  t: (key: string) => string
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-xs font-label uppercase tracking-widest px-3 py-1 border rounded-sm ${STATUS_COLORS[booking.status]}`}>
            {booking.status}
          </span>
        </div>
        <p className="font-headline text-lg text-on-surface">{formatDate(booking.availability.date)}</p>
        <p className="text-on-surface-variant text-sm mt-1">
          {booking.availability.startTime} — {booking.availability.endTime}
        </p>
        {booking.notes && (
          <p className="text-on-surface-variant/60 text-xs mt-2 italic">{booking.notes}</p>
        )}
      </div>
      {['pending', 'confirmed'].includes(booking.status) && (
        <div>
          {confirming ? (
            <div className="flex items-center gap-3">
              <span className="text-on-surface-variant text-sm">{t('dashboard.confirmCancel')}</span>
              <button
                onClick={() => { onCancel(booking.id); setConfirming(false) }}
                disabled={cancelling}
                className="text-error text-sm font-label uppercase tracking-wider hover:opacity-80"
              >
                {t('dashboard.yes')}
              </button>
              <button onClick={() => setConfirming(false)} className="text-on-surface-variant text-sm font-label uppercase tracking-wider">
                {t('dashboard.no')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-error/70 border border-error/20 px-4 py-2 rounded-sm font-label text-xs uppercase tracking-widest hover:bg-error/10 transition-colors"
            >
              {t('dashboard.cancel')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
