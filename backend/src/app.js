import express from 'express'
import cors from 'cors'
import { authenticate } from './middleware/auth.js'
import { requireAdmin } from './middleware/admin.js'

import authRoutes from './routes/auth.js'
import availabilitiesRoutes from './routes/availabilities.js'
import bookingsRoutes from './routes/bookings.js'
import contentRoutes from './routes/content.js'
import adminBookingsRoutes from './routes/admin/bookings.js'
import adminAvailabilitiesRoutes from './routes/admin/availabilities.js'
import adminContentRoutes from './routes/admin/content.js'

const app = express()

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())

// Public routes
app.use('/api', authRoutes)
app.use('/api/availabilities', availabilitiesRoutes)
app.use('/api/content', contentRoutes)

// Authenticated user routes
app.use('/api/bookings', bookingsRoutes)

// Admin routes
app.use('/api/admin/bookings', authenticate, requireAdmin, adminBookingsRoutes)
app.use('/api/admin/availabilities', authenticate, requireAdmin, adminAvailabilitiesRoutes)
app.use('/api/admin/content', authenticate, requireAdmin, adminContentRoutes)

// GET /api/admin/stats
app.get('/api/admin/stats', authenticate, requireAdmin, async (req, res) => {
  const { default: prisma } = await import('./lib/prisma.js')
  const [pending, confirmed, completed, cancelled, total] = await Promise.all([
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.count({ where: { status: 'confirmed' } }),
    prisma.booking.count({ where: { status: 'completed' } }),
    prisma.booking.count({ where: { status: 'cancelled' } }),
    prisma.booking.count(),
  ])
  const today = new Date().toISOString().split('T')[0]
  const todayCount = await prisma.booking.count({ where: { availability: { date: today } } })
  res.json({ pending, confirmed, completed, cancelled, total, today: todayCount })
})

export default app
