import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'

const app = express()
const PORT = 8080

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log('MongoDB Error:', err))
}

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'https://vercel-lms-frontend.vercel.app'],
  credentials: true 
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'LibraryMS Backend is running!', status: 'OK' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Running on: http://localhost:${PORT}`)
})

export default app;