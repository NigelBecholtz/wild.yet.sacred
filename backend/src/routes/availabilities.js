import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/availabilities — public, returns only slots with no booking
router.get('/', async (req, res) => {
  try {
    const slots = await prisma.availability.findMany({
      where: { bookings: { none: {} } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    res.json(slots)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
