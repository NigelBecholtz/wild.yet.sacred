import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/admin', label: 'Overview', icon: 'diamond', end: true },
  { to: '/admin/bookings', label: 'Bookings', icon: 'calendar_month', end: false },
  { to: '/admin/availability', label: 'Availability', icon: 'schedule', end: false },
  { to: '/admin/content', label: 'Content', icon: 'edit_note', end: false },
]

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* Admin nav bar */}
      <div className="bg-surface-container border-b border-outline-variant/20 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto">
          <span className="font-label text-xs uppercase tracking-widest text-secondary mr-6 whitespace-nowrap">Admin Archive</span>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-sm font-label text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-secondary text-on-secondary'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`
              }
            >
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  )
}
