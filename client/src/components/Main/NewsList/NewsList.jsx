import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CategoryItem from './CategoryItem/CategoryItem.jsx';
import './NewsList.css';
// import NewsLoading from './NewsLoading/NewsLoading.jsx';
import AdSense from '../../AdSense/AdSense.jsx';

const NewsList = ({ page, setLoading, setHasMore }) => {
  const [news, setNews] = useState({});

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
    setLoading(true);
    try {
      const response = await axios.get(`/api/news?page=${page}&limit=10`);
      const newArticles = response.data.articles;
      console.log(newArticles);

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
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [page, setLoading, setHasMore]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const renderCategoryNews = (categoryId, limit = 2) => {
    const articles = news[categoryId] || [];
    return articles.slice(0, limit).map((article, index) => (
      <CategoryItem
        key={`${page}-${categoryId}-${index}`}
        date={article.publication_date}
        title={article.title}
        img={article.featured_image_url || 'default-image-url.jpg'}
        id={article.id_article}
        category={getCategoryName(categoryId)}
        url={article.article_url}
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
    </div>
  );
};

export default NewsList;