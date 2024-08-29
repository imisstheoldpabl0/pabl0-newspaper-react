// index.js
const express = require('express');
const pool = require('./db');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
