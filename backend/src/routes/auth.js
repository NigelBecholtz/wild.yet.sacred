import { Router } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import { generateToken, authenticate } from '../middleware/auth.js'

const router = Router()

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(422).json({ message: 'Name, email and password are required.' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(422).json({ message: 'Email already in use.' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, password: hashed } })
    const token = generateToken(user)
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }
    const token = generateToken(user)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/logout (stateless — client drops token)
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out.' })
})

// GET /api/user
router.get('/user', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, isAdmin: true, createdAt: true },
    })
    res.json(user)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
