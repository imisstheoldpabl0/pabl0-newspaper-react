import os
import json
import psycopg2
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Load JSON data
with open('../server/utils/scraped-news.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Connect to your ElephantSQL database
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Insert each record
for article in data:
    cur.execute("""
        INSERT INTO news_articles (publication_date, title, body, featured_image_url, article_url) VALUES (%s, %s, %s, %s, %s)
    """, (
        article['publication_date'],
        article['title'],
        article['body'],
        article['featured_image_url'],
        article['article_url']
    ))
    cur.execute("""
        INSERT INTO news_categories (category) VALUES (%s)
    """, (article['category'],))
    
# Commit the transaction and close the connection
conn.commit()
cur.close()
conn.close()
