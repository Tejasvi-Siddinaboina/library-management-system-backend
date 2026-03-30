import jwt from 'jsonwebtoken'

const JWT_SECRET = 'LibraryMS2024SecretKeyForJWT'

export const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' })
}

export const verifyToken = (req, res, next) => {
  const header = req.headers['authorization']
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }
  const token = header.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userEmail = decoded.email
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}
