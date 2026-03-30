import express from 'express'
import { db } from '../data/db.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// All book routes require auth
router.use(verifyToken)

// GET /api/books
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Success', data: db.books })
})

// GET /api/books/stats
router.get('/stats', (req, res) => {
  const categories = [...new Set(db.books.map(b => b.category).filter(Boolean))]
  res.json({
    success: true, message: 'Success',
    data: {
      totalBooks: db.books.length,
      availableBooks: db.books.filter(b => b.status === 'AVAILABLE').length,
      checkedOutBooks: db.books.filter(b => b.status === 'CHECKED_OUT').length,
      totalCategories: categories.length,
      categories,
    }
  })
})

// GET /api/books/:id
router.get('/:id', (req, res) => {
  const book = db.books.find(b => b.id === parseInt(req.params.id))
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' })
  res.json({ success: true, message: 'Success', data: book })
})

// POST /api/books
router.post('/', (req, res) => {
  const { title, author, isbn, category, publisher, publishYear, totalCopies, availableCopies } = req.body
  if (!title || !author)
    return res.status(400).json({ success: false, message: 'Title and author are required' })

  const copies = parseInt(totalCopies) || 1
  const available = parseInt(availableCopies) || copies
  const book = {
    id: db.nextBookId++,
    title, author,
    isbn: isbn || '',
    category: category || '',
    publisher: publisher || '',
    publishYear: parseInt(publishYear) || new Date().getFullYear(),
    totalCopies: copies,
    availableCopies: available,
    status: available > 0 ? 'AVAILABLE' : 'CHECKED_OUT',
    addedAt: new Date().toISOString(),
  }
  db.books.push(book)
  res.status(201).json({ success: true, message: 'Book added', data: book })
})

// PUT /api/books/:id
router.put('/:id', (req, res) => {
  const idx = db.books.findIndex(b => b.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ success: false, message: 'Book not found' })

  const updated = {
    ...db.books[idx],
    ...req.body,
    id: db.books[idx].id,
    status: parseInt(req.body.availableCopies) > 0 ? 'AVAILABLE' : 'CHECKED_OUT',
  }
  db.books[idx] = updated
  res.json({ success: true, message: 'Book updated', data: updated })
})

// DELETE /api/books/:id
router.delete('/:id', (req, res) => {
  const idx = db.books.findIndex(b => b.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ success: false, message: 'Book not found' })
  db.books.splice(idx, 1)
  res.json({ success: true, message: 'Book deleted', data: null })
})

export default router
