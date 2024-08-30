
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
        INSERT INTO news_articles (date, headline, body, img) VALUES (%s, %s, %s, %s)
    """, (
        article['date'],
        article['headline'],
        article['body'],
        article['img']
    ))

# Commit the transaction and close the connection
conn.commit()
cur.close()
conn.close()
