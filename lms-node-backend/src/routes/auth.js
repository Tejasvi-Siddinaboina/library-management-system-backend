import express from 'express'
import bcrypt from 'bcryptjs'
import { db } from '../data/db.js'
import { generateToken } from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    const exists = db.users.find(u => u.email === email)
    if (exists)
      return res.status(400).json({ success: false, message: 'Email already registered' })

    const hashed = bcrypt.hashSync(password, 10)
    const user = {
      id: db.nextUserId++,
      fullName, email,
      password: hashed,
      role: 'USER',
      createdAt: new Date().toISOString(),
    }
    db.users.push(user)
    const token = generateToken(email)
    res.status(201).json({
      success: true,
      message: 'Registered successfully',
      data: { token, id: user.id, email, fullName, role: user.role }
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = db.users.find(u => u.email === email)
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    const token = generateToken(email)
    res.json({
      success: true,
      message: 'Login successful',
      data: { token, id: user.id, email, fullName: user.fullName, role: user.role }
    })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
