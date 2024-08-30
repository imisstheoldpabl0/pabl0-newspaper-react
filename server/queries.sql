CREATE DATABASE newspaper;


CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    date TEXT,
    headline TEXT,
    body TEXT,
    img TEXT
);

SELECT COUNT(*) FROM news_articles;

SELECT * FROM news_articles ORDER BY created_at DESC LIMIT $1 OFFSET $2;


