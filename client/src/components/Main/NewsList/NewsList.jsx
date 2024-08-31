import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem/NewsItem.jsx';
import './NewsList.css';
import NewsLoading from './NewsLoading/NewsLoading.jsx';

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/news?page=${page}&limit=10`);
      setNews((prevNews) => [...prevNews, ...response.data.articles]);
      setHasMore(response.data.articles.length > 0);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchNews();  // Initial fetch
  }, []);  // Only on component mount

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && hasMore && !loading) {
      fetchNews();  // Fetch more news when scrolled near the bottom
    }
  }, [fetchNews, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="news-list">
      {news.map((article, index) => (
        <NewsItem
          key={index}
          date={article.date}
          headline={article.headline}
          img={article.img || 'default-image-url.jpg'}
        />
      ))}
      <NewsLoading />
    </div>
  );
};

export default NewsList;
