CREATE DATABASE newspaper;

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news_articles (
    id SERIAL PRIMARY KEY,
    date TEXT,
    headline TEXT,
    body TEXT,
    img TEXT
);

INSERT INTO news (title, description, url) VALUES
('Title 1', 'Description for news 1', 'https://example.com/news1'),
('Title 2', 'Description for news 2', 'https://example.com/news2'),
-- Add more sample data as needed
('Title 20', 'Description for news 20', 'https://example.com/news20');
