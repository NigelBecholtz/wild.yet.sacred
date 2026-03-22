import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'celestial-secret-key-change-in-production'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}
