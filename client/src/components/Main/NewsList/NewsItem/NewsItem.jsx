import React from 'react';
import "./NewsItem.css";

const NewsItem = ({ date, headline, img }) => {
  return (
    <div className="news-item">
      <img src={img} className='img' />
      <h6 className='date'>{date}</h6>
      <h1 className='headline'>{headline}</h1>
    </div>
  );
};

export default NewsItem;
