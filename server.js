// server.js
const express = require('express');
const app = express();

app.use(express.json());

// 📚 In-memory book list
let books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    copiesAvailable: 5
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    copiesAvailable: 3
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    copiesAvailable: 7
  }
];

// ===========================
// GET Endpoints
// ===========================

// Retrieve all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Retrieve one book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// ===========================
// POST, PUT, DELETE Endpoints
// ===========================

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre, copiesAvailable } = req.body;
  if (!title || !author || !genre) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newBook = {
    id: books.length + 1,
    title,
    author,
    genre,
    copiesAvailable: copiesAvailable || 0
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find(b => b.id === id);
  if (!book) return res.status(404).json({ error: 'Book not found' });

  const { title, author, genre, copiesAvailable } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (copiesAvailable !== undefined) book.copiesAvailable = copiesAvailable;

  res.json(book);
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  books.splice(index, 1);
  res.status(204).send();
});

// ===========================
// Server Start + Export
// ===========================

let server;

// Only start server when running directly (not during tests)
if (require.main === module) {
  server = app.listen(3000, () => console.log('Server running on port 3000'));
}

// Export both app and server so Jest can close it
module.exports = { app, server };
