import React from 'react';
import CategoryItem from './CategoryItem/CategoryItem.jsx';
import './NewsList.css';
import AdSense from '../../AdSense/AdSense.jsx';

const NewsList = ({ page, news, loading }) => {
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

  const renderCategoryNews = (categoryId, limit = 2) => {
    const articles = news[categoryId] || [];
    if (!Array.isArray(articles)) {
      console.error(`Articles for category ${categoryId} is not an array:`, articles);
      return null;
    }
    const startIndex = (page - 1) * limit;
    return articles.slice(startIndex, startIndex + limit).map((article, index) => (
      <CategoryItem
        key={`${page}-${categoryId}-${index}`}
        date={article.publication_date}
        title={article.title}
        img={article.featured_image_url || 'default-image-url.jpg'}
        id={article.id_article}
        category={getCategoryName(categoryId)}
      />
    ));
  };

  if (loading && Object.keys(news).length === 0) {
    return <div>Loading...</div>;
  }

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