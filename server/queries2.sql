/* news-api database */

CREATE TABLE news_articles (
    id_article SERIAL PRIMARY KEY,
    publication_date DATE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    featured_image_url TEXT,
    article_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT COUNT(*) FROM news_articles;

SELECT * FROM news_articles ORDER BY created_at DESC LIMIT $1 OFFSET $2;
