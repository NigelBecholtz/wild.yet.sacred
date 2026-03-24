import { useState, useEffect } from 'react'
import { getAdminAvailabilities, createAvailability, deleteAvailability } from '../../lib/api'
import type { Availability } from '../../lib/types'

interface SlotWithBookings extends Availability {
  bookings: { id: number; status: string; clientName: string }[]
}

export default function AdminAvailability() {
  const [slots, setSlots] = useState<SlotWithBookings[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getAdminAvailabilities()
      .then((r) => setSlots(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Group by date
  const byDate = slots.reduce<Record<string, SlotWithBookings[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})
  const sortedDates = Object.keys(byDate).sort()

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    if (!date || !startTime || !endTime) { setFormError('All fields are required.'); return }
    if (startTime >= endTime) { setFormError('End time must be after start time.'); return }
    setSubmitting(true)
    try {
      await createAvailability({ date, startTime, endTime })
      setDate(''); setStartTime(''); setEndTime('')
      load()
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setFormError(message || 'Failed to create slot.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await deleteAvailability(id)
      setSlots((prev) => prev.filter((s) => s.id !== id))
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(message || 'Cannot delete this slot.')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass = 'bg-transparent border-0 border-b border-outline-variant focus:border-secondary py-3 text-on-surface placeholder:text-outline/40 outline-none transition-colors w-full'

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <span className="font-label text-on-surface text-xs tracking-[0.3em] uppercase block mb-4">◆ Celestial Calendar</span>
        <h1 className="font-headline text-5xl text-on-surface font-light">Availability</h1>
      </div>

      {/* Create form */}
      <div className="bg-surface-container border border-outline-variant/10 rounded-lg p-8 mb-12">
        <h2 className="font-headline text-2xl text-on-surface mb-8">Add Time Slot</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block font-headline text-on-surface text-xs uppercase tracking-widest mb-2">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block font-headline text-on-surface text-xs uppercase tracking-widest mb-2">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block font-headline text-on-surface text-xs uppercase tracking-widest mb-2">End Time</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-secondary text-on-secondary px-6 py-3 rounded-sm font-label text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {submitting ? '✦' : '+ Add Slot'}
          </button>
        </form>
        {formError && <p className="text-error text-sm mt-4 font-label">{formError}</p>}
      </div>

      {/* Slots list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="text-on-surface font-headline italic text-4xl animate-pulse">✦</span>
        </div>
      ) : sortedDates.length === 0 ? (
        <p className="text-on-surface-variant italic font-headline text-xl">No availability slots yet.</p>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((d) => (
            <div key={d}>
              <h3 className="font-headline text-xl text-on-surface mb-4 pb-2 border-b border-outline-variant/20">
                {formatDate(d)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {byDate[d].map((slot) => {
                  const activeBooking = slot.bookings.find((b) => b.status !== 'cancelled')
                  return (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border flex items-center justify-between ${
                        activeBooking
                          ? 'bg-primary-container/10 border-primary/20'
                          : 'bg-surface-container border-outline-variant/10'
                      }`}
                    >
                      <div>
                        <p className="font-headline text-on-surface">{slot.startTime} – {slot.endTime}</p>
                        {activeBooking ? (
                          <p className="text-on-surface text-xs mt-1 font-label uppercase tracking-widest">
                            {activeBooking.clientName}
                          </p>
                        ) : (
                          <p className="text-on-surface-variant text-xs mt-1 font-label uppercase tracking-widest">Available</p>
                        )}
                      </div>
                      {!activeBooking && (
                        <button
                          onClick={() => handleDelete(slot.id)}
                          disabled={deletingId === slot.id}
                          className="text-error/60 hover:text-error transition-colors disabled:opacity-50"
                          aria-label="Delete slot"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
