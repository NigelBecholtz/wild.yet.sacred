import { Router } from 'express'
import prisma from '../lib/prisma.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/bookings — own bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { availability: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(bookings)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/bookings
router.post('/', authenticate, async (req, res) => {
  try {
    const { availabilityId, clientName, clientAge, notes } = req.body
    if (!availabilityId || !clientName) {
      return res.status(422).json({ message: 'availabilityId and clientName are required.' })
    }
    // Check slot is still free
    const existing = await prisma.booking.findFirst({
      where: { availabilityId: Number(availabilityId), status: { not: 'cancelled' } },
    })
    if (existing) {
      return res.status(409).json({ message: 'This slot is no longer available.' })
    }
    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        availabilityId: Number(availabilityId),
        clientName,
        clientAge: clientAge ? Number(clientAge) : null,
        notes: notes || null,
      },
      include: { availability: true },
    })
    res.status(201).json(booking)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// DELETE /api/bookings/:id — cancel own booking
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const booking = await prisma.booking.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
    })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'cancelled' },
    })
    res.json({ message: 'Booking cancelled.' })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
