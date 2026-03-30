// In-memory database (same concept as H2 in Spring Boot)
import bcrypt from 'bcryptjs'

export const db = {
  users: [],
  books: [],
  nextUserId: 1,
  nextBookId: 1,
}

// Seed admin user
const hashedPassword = bcrypt.hashSync('admin123', 10)
db.users.push({
  id: 1,
  fullName: 'Admin Librarian',
  email: 'admin@library.com',
  password: hashedPassword,
  role: 'ADMIN',
  createdAt: new Date().toISOString(),
})
db.nextUserId = 2

// Seed sample books
const sampleBooks = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', publisher: 'Scribner', publishYear: 1925, totalCopies: 5, availableCopies: 5 },
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', category: 'Technology', publisher: 'Prentice Hall', publishYear: 2008, totalCopies: 3, availableCopies: 2 },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061935466', category: 'Fiction', publisher: 'HarperCollins', publishYear: 1960, totalCopies: 4, availableCopies: 4 },
  { title: '1984', author: 'George Orwell', isbn: '9780451524935', category: 'Fiction', publisher: 'Signet Classic', publishYear: 1949, totalCopies: 6, availableCopies: 6 },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '9780201616224', category: 'Technology', publisher: 'Addison-Wesley', publishYear: 1999, totalCopies: 2, availableCopies: 1 },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '9780201633610', category: 'Technology', publisher: 'Addison-Wesley', publishYear: 1994, totalCopies: 3, availableCopies: 3 },
]

sampleBooks.forEach((book, i) => {
  db.books.push({
    id: i + 1,
    ...book,
    status: book.availableCopies > 0 ? 'AVAILABLE' : 'CHECKED_OUT',
    addedAt: new Date().toISOString(),
  })
  db.nextBookId = i + 2
})
