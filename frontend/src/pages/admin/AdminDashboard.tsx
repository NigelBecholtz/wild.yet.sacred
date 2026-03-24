import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminStats } from '../../lib/api'
import type { AdminStats } from '../../lib/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-on-surface font-headline italic text-4xl animate-pulse">✦</span>
      </div>
    )
  }

  const statCards = [
    { label: 'Pending', value: stats?.pending ?? 0, color: 'text-on-surface', icon: 'pending' },
    { label: 'Confirmed', value: stats?.confirmed ?? 0, color: 'text-on-surface', icon: 'check_circle' },
    { label: 'Today', value: stats?.today ?? 0, color: 'text-on-surface', icon: 'today' },
    { label: 'Total', value: stats?.total ?? 0, color: 'text-on-surface', icon: 'bar_chart' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="mb-12">
        <span className="font-label text-on-surface text-xs tracking-[0.3em] uppercase block mb-4">◆ Command Center</span>
        <h1 className="font-headline text-5xl text-on-surface font-light">The Archive</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface-container border border-outline-variant/10 p-8 rounded-lg">
            <span className="material-symbols-outlined text-outline/40 text-2xl mb-4 block">{card.icon}</span>
            <div className={`font-headline text-5xl mb-2 ${card.color}`}>{card.value}</div>
            <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-headline text-2xl text-on-surface mb-8 pb-4 border-b border-outline-variant/20">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { to: '/admin/bookings?status=pending', label: 'Review Pending', icon: 'pending', desc: `${stats?.pending ?? 0} awaiting review` },
            { to: '/admin/availability', label: 'Manage Slots', icon: 'calendar_add_on', desc: 'Add or remove time slots' },
            { to: '/admin/content', label: 'Edit Content', icon: 'edit_note', desc: 'Update site text & images' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group p-8 bg-surface-container border border-outline-variant/10 rounded-lg hover:border-secondary/40 transition-all"
            >
              <span className="material-symbols-outlined text-on-surface mb-4 block text-2xl">{action.icon}</span>
              <h3 className="font-headline text-lg text-on-surface mb-2">{action.label}</h3>
              <p className="text-on-surface-variant text-sm">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
