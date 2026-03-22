import { Router } from 'express'
import multer from 'multer'
import { put } from '@vercel/blob'
import prisma from '../../lib/prisma.js'

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()

// GET /api/admin/content
router.get('/', async (req, res) => {
  try {
    const items = await prisma.content.findMany({ orderBy: [{ page: 'asc' }, { key: 'asc' }] })
    res.json(items)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// PUT /api/admin/content
router.put('/', async (req, res) => {
  try {
    const { updates } = req.body // [{ page, key, locale, value }]
    if (!Array.isArray(updates)) return res.status(422).json({ message: 'updates array required.' })
    const results = await Promise.all(
      updates.map((u) =>
        prisma.content.upsert({
          where: { page_key_locale: { page: u.page, key: u.key, locale: u.locale } },
          update: { value: u.value },
          create: u,
        })
      )
    )
    res.json(results)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

// POST /api/admin/content/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(422).json({ message: 'No file uploaded.' })
    const filename = `uploads/${Date.now()}-${req.file.originalname.replace(/\s+/g, '-')}`
    const { url } = await put(filename, req.file.buffer, {
      access: 'public',
      contentType: req.file.mimetype,
    })
    res.json({ url })
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
