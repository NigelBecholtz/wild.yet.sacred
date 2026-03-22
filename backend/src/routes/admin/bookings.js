import { Router } from 'express'
import prisma from '../../lib/prisma.js'

const router = Router()

// GET /api/admin/bookings?status=pending
router.get('/', async (req, res) => {
  try {
    const where = req.query.status ? { status: req.query.status } : {}
    const bookings = await prisma.booking.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, availability: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(bookings)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [pending, confirmed, completed, cancelled, total] = await Promise.all([
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'confirmed' } }),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.booking.count({ where: { status: 'cancelled' } }),
      prisma.booking.count(),
    ])
    const today = new Date().toISOString().split('T')[0]
    const todayCount = await prisma.booking.count({
      where: { availability: { date: today } },
    })
    res.json({ pending, confirmed, completed, cancelled, total, today: todayCount })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// PATCH /api/admin/bookings/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!valid.includes(status)) {
      return res.status(422).json({ message: 'Invalid status.' })
    }
    const booking = await prisma.booking.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: { user: { select: { id: true, name: true, email: true } }, availability: true },
    })
    res.json(booking)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
