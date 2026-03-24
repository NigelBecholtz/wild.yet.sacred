import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="text-on-surface font-headline italic text-2xl animate-pulse">✦</span></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><span className="text-on-surface font-headline italic text-2xl animate-pulse">✦</span></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!user?.isAdmin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
