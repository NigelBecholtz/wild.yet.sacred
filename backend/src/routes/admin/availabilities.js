import { Router } from 'express'
import prisma from '../../lib/prisma.js'

const router = Router()

// GET /api/admin/availabilities
router.get('/', async (req, res) => {
  try {
    const slots = await prisma.availability.findMany({
      include: { bookings: { select: { id: true, status: true, clientName: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    })
    res.json(slots)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/admin/availabilities
router.post('/', async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body
    if (!date || !startTime || !endTime) {
      return res.status(422).json({ message: 'date, startTime and endTime are required.' })
    }
    const slot = await prisma.availability.create({ data: { date, startTime, endTime } })
    res.status(201).json(slot)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// DELETE /api/admin/availabilities/:id
router.delete('/:id', async (req, res) => {
  try {
    const slot = await prisma.availability.findUnique({
      where: { id: Number(req.params.id) },
      include: { bookings: true },
    })
    if (!slot) return res.status(404).json({ message: 'Slot not found.' })
    if (slot.bookings.length > 0) {
      return res.status(409).json({ message: 'Cannot delete a slot that has bookings.' })
    }
    await prisma.availability.delete({ where: { id: slot.id } })
    res.json({ message: 'Slot deleted.' })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
