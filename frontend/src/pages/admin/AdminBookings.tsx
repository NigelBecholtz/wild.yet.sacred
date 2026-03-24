import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAdminBookings, updateBookingStatus } from '../../lib/api'
import type { Booking } from '../../lib/types'

const STATUSES = ['all', 'pending', 'confirmed', 'completed', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-on-surface border-secondary/30 bg-secondary/10',
  confirmed: 'text-on-surface border-secondary-container/30 bg-secondary-container/10',
  completed: 'text-on-surface-variant border-outline-variant/30 bg-surface-container',
  cancelled: 'text-error/70 border-error/20 bg-error/5',
}

const NEXT_ACTIONS: Record<string, { label: string; status: string; color: string }[]> = {
  pending: [
    { label: 'Confirm', status: 'confirmed', color: 'bg-secondary-container/20 text-on-surface hover:bg-secondary-container/30' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-error/10 text-error/70 hover:bg-error/20' },
  ],
  confirmed: [
    { label: 'Complete', status: 'completed', color: 'bg-secondary/20 text-on-surface hover:bg-secondary/30' },
    { label: 'Cancel', status: 'cancelled', color: 'bg-error/10 text-error/70 hover:bg-error/20' },
  ],
  completed: [],
  cancelled: [],
}

export default function AdminBookings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    getAdminBookings(statusFilter === 'all' ? undefined : statusFilter)
      .then((r) => setBookings(r.data))
      .finally(() => setLoading(false))
  }, [statusFilter])

  const handleStatus = async (id: number, status: string) => {
    setUpdating(id)
    try {
      const { data } = await updateBookingStatus(id, status)
      setBookings((prev) => prev.map((b) => (b.id === id ? data : b)))
    } finally {
      setUpdating(null)
    }
  }

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <span className="font-label text-on-surface text-xs tracking-[0.3em] uppercase block mb-4">◆ Session Registry</span>
        <h1 className="font-headline text-5xl text-on-surface font-light">Bookings</h1>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setSearchParams(s === 'all' ? {} : { status: s })}
            className={`px-4 py-2 font-label text-xs uppercase tracking-widest rounded-sm transition-all ${
              statusFilter === s
                ? 'bg-secondary text-on-secondary'
                : 'border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-on-surface'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <span className="text-on-surface font-headline italic text-4xl animate-pulse">✦</span>
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-on-surface-variant italic font-headline text-xl">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-surface-container border border-outline-variant/10 rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`text-xs font-label uppercase tracking-widest px-3 py-1 border rounded-sm ${STATUS_COLORS[b.status]}`}>
                    {b.status}
                  </span>
                  <span className="text-on-surface-variant text-xs font-label">#{b.id}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Client</p>
                    <p className="font-headline text-on-surface">{b.clientName}</p>
                    {b.user && <p className="text-on-surface-variant text-xs">{b.user.email}</p>}
                  </div>
                  <div>
                    <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Session</p>
                    <p className="font-headline text-on-surface">{formatDate(b.availability.date)}</p>
                    <p className="text-on-surface-variant text-sm">{b.availability.startTime} – {b.availability.endTime}</p>
                  </div>
                  {b.notes && (
                    <div>
                      <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Notes</p>
                      <p className="text-on-surface-variant text-sm italic">{b.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(NEXT_ACTIONS[b.status] || []).map((action) => (
                  <button
                    key={action.status}
                    onClick={() => handleStatus(b.id, action.status)}
                    disabled={updating === b.id}
                    className={`px-4 py-2 rounded-sm font-label text-xs uppercase tracking-widest transition-all disabled:opacity-50 ${action.color}`}
                  >
                    {updating === b.id ? '…' : action.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
