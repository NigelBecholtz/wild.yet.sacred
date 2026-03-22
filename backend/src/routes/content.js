import { Router } from 'express'
import prisma from '../lib/prisma.js'

const router = Router()

// GET /api/content?locale=en
router.get('/', async (req, res) => {
  try {
    const locale = req.query.locale === 'es' ? 'es' : 'en'
    const items = await prisma.content.findMany({ where: { locale } })
    // Return as nested object: { page: { key: value } }
    const result = {}
    for (const item of items) {
      if (!result[item.page]) result[item.page] = {}
      result[item.page][item.key] = item.value
    }
    res.json(result)
  } catch {
    res.status(500).json({ message: 'Server error.' })
  }
})

export default router
