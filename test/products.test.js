const request = require('supertest');
const sqlite3 = require('sqlite3').verbose();
const createApp = require('../index'); // Adjust the path as necessary

describe('Products API', () => {
  let app;
  let db;

  beforeAll(done => {
    db = new sqlite3.Database(':memory:');
    db.serialize(() => {
      db.run("CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)", () => {
        db.run("INSERT INTO products (name, price) VALUES ('Sample Product', 19.99)", done);
      });
    });
    app = createApp(db);
  });

  afterAll(done => {
    db.close(done);
  });

  test('GET /products should return all products', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('name', 'Sample Product');
  });

  test('GET /products/:id should return a single product', async () => {
    const response = await request(app).get('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'Sample Product');
  });

  test('POST /products should create a new product', async () => {
    const newProduct = { name: 'New Product', price: 29.99 };
    const response = await request(app).post('/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Product added successfully.');
    expect(response.body).toHaveProperty('productId');
  });

  test('PATCH /products/:id should update a product', async () => {
    const updatedProduct = { name: 'Updated Product', price: 39.99 };
    const response = await request(app).patch('/products/1').send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product updated successfully.');
  });

  test('DELETE /products/:id should delete a product', async () => {
    const response = await request(app).delete('/products/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Product deleted successfully.');
  });
});
