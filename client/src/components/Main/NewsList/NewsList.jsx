import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PolicialesItem from './PolicialesItem/PolicialesItem.jsx';
import './NewsList.css';
import NewsLoading from './NewsLoading/NewsLoading.jsx';
import AdSense from '../../AdSense/AdSense.jsx';

const NewsList = () => {
  const [news, setNews] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const getCategoryName = (categoryId) => {
    const categories = {
      '1': 'Policiales',
      '2': 'Provinciales',
      '3': 'Nacionales',
      '4': 'Internacionales',
      '5': 'Más Deportivo'
    };
    return categories[categoryId] || 'Unknown Category';
  };

  const fetchNews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/news?page=${page}&limit=10`);
      const newArticles = response.data.articles;

      setNews(prevNews => {
        const updatedNews = { ...prevNews };
        newArticles.forEach(article => {
          if (!updatedNews[article.id_category]) {
            updatedNews[article.id_category] = [];
          }
          updatedNews[article.id_category].push(article);
        });
        return updatedNews;
      });

      setHasMore(response.data.currentPage < response.data.totalPages);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchNews();
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && hasMore && !loading) {
      fetchNews();
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

  const renderCategoryNews = (categoryId, limit = 2) => {
    const articles = news[categoryId] || [];
    return articles.slice(0, limit).map((article, index) => (
      <PolicialesItem
        key={index}
        date={article.publication_date}
        title={article.title}
        img={article.featured_image_url || 'default-image-url.jpg'}
        id={article.id_article}
        category={getCategoryName(categoryId)}
      />
    ));
  };

  return (
    <div className="news-list">
      <div className="policiales-1 item">{renderCategoryNews('1', 2)}</div>
      <div className="nacionales-1 item">{renderCategoryNews('3', 2)}</div>
      <div className="provinciales-1 item">{renderCategoryNews('2', 2)}</div>
      <div className="internacionales-1 item">{renderCategoryNews('4', 2)}</div>
      <div className="mas-deportivo-1 item">{renderCategoryNews('5', 2)}</div>
      <div className="ad-1 ad-item"><AdSense /></div>
      <div className="ad-2 ad-item"><AdSense /></div>
      {loading && <NewsLoading />}
    </div>
  );
};

export default NewsList;