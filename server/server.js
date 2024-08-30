// index.js
const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/all-news', async (req, res) => {
  try {
    const result = await pool.query('select * from news_articles order by id limit 10');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// API endpoint for fetching paginated news
app.get('/api/news', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get the total count of articles
    const countResult = await pool.query('SELECT COUNT(*) FROM news_articles');
    const count = parseInt(countResult.rows[0].count);

    // Get the articles for the current page
    const articlesResult = await pool.query(
      'SELECT * FROM news_articles ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      articles: articlesResult.rows,

    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});