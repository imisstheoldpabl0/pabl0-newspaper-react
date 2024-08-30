import React from 'react';
import "./NewsItem.css";

const NewsItem = ({ date, headline, body, img }) => {
  return (
    <div className="news-item">
      <h1 className='headline'>{headline}</h1>
      <h6 className='date'>{date}</h6>
      <p className='body'>{body}</p>
      <img src={img} className='img' />
    </div>
  );
};

export default NewsItem;
