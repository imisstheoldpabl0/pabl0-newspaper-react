import React from 'react';
import "./NewsItem.css";

const NewsItem = ({ date, headline, body, img }) => {
  return (
    <div className="news-item">
      <h2>{headline}</h2>
      <h4>{date}</h4>
      <p>{body}</p>
      <img src={img} className='news-img' />
    </div>
  );
};

export default NewsItem;
