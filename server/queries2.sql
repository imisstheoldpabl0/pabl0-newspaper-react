/* news-api database */

CREATE TABLE news_categories (
    id_category SERIAL PRIMARY KEY,
    category TEXT NOT NULL UNIQUE
);

CREATE TABLE news_articles (
    id_article SERIAL PRIMARY KEY,
    publication_date DATE NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    featured_image_url TEXT,
    article_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_category INTEGER NOT NULL,
    FOREIGN KEY (id_category) REFERENCES news_categories(id_category)
);

INSERT INTO news_categories (id_category, category) VALUES
(1, 'policiales'),
(2, 'provinciales'),
(3, 'nacionales'),
(4, 'internacionales'),
(5, 'mas-deportivo');

SELECT COUNT(*) FROM news_articles;

SELECT * FROM news_articles ORDER BY created_at DESC LIMIT $1 OFFSET $2;
