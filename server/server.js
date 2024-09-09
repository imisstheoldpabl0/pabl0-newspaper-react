// index.js
const express = require('express');
const pool = require('./db');
require('dotenv').config();
const cors = require('cors')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

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
    const result = await pool.query('select * from news_articles order by id limit 5');
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

    const categoriesResult = await pool.query('SELECT id_category, category FROM news_categories');
    const categories = categoriesResult.rows;

    let allArticles = [];
    for (const category of categories) {
      const articlesResult = await pool.query(
        'SELECT news_articles.*, news_categories.category FROM news_articles JOIN news_categories ON news_articles.id_category = news_categories.id_category WHERE news_articles.id_category = $1 ORDER BY news_articles.created_at DESC LIMIT 2',
        [category.id_category]
      );
      allArticles = [...allArticles, ...articlesResult.rows];
    }

    const totalCount = await pool.query('SELECT COUNT(*) FROM news_articles');
    const count = parseInt(totalCount.rows[0].count);

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      articles: allArticles,
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for fetching news by category
app.get('/api/news/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get the total count of articles for the specific category
    const countResult = await pool.query('SELECT COUNT(*) FROM news_articles WHERE id_category = $1', [category]);
    const count = parseInt(countResult.rows[0].count);

    // Get the articles for the current page and category
    const articlesResult = await pool.query(
      'SELECT * FROM news_articles WHERE id_category = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [category, limit, offset]
    );

    res.json({
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      articles: articlesResult.rows,
    });
  } catch (error) {
    console.error('Error fetching news by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Optional: Serve static files (like a React app)
// If you're deploying just an API, you can skip this.
// If your app serves a frontend, ensure your build files are in a directory like 'client/build'.
// Uncomment the lines below if serving static files:
const path = require('path');
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});