// tests/api.test.js
const request = require('supertest');
const { app } = require('../server');

let server;

beforeAll(() => {
  // Start a test-only server (so Jest can close it later)
  server = app.listen(4000);
});

afterAll((done) => {
  // Gracefully close server after tests
  server.close(done);
});

describe('📚 Books API', () => {

  it('GET /api/books should return all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/books/:id should return a specific book', async () => {
    const res = await request(app).get('/api/books/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /api/books/:id should return 404 for invalid ID', async () => {
    const res = await request(app).get('/api/books/999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Book not found');
  });

  it('POST /api/books should create a new book', async () => {
    const newBook = {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      genre: 'Dystopian Fiction',
      copiesAvailable: 4
    };
    const res = await request(app).post('/api/books').send(newBook);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newBook.title);
  });

  it('PUT /api/books/:id should update an existing book', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ title: 'The Great Gatsby (Updated)' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('The Great Gatsby (Updated)');
  });

  it('PUT /api/books/:id should return 404 for invalid ID', async () => {
    const res = await request(app)
      .put('/api/books/999')
      .send({ title: 'Nonexistent' });
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/books/:id should delete a book', async () => {
    const res = await request(app).delete('/api/books/2');
    expect(res.statusCode).toBe(204);
  });

  it('DELETE /api/books/:id should return 404 for invalid ID', async () => {
    const res = await request(app).delete('/api/books/999');
    expect(res.statusCode).toBe(404);
  });
});
