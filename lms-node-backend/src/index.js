import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'

const app = express()
const PORT = 8080

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))
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
  console.log('========================================')
  console.log('  LibraryMS Backend Started!')
  console.log(`  Running on: http://localhost:${PORT}`)
  console.log('  Demo Login:')
  console.log('  Email   : admin@library.com')
  console.log('  Password: admin123')
  console.log('========================================')
})
