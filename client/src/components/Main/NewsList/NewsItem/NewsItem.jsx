import React from 'react';
import "./NewsItem.css";

const NewsItem = ({ date, title, img }) => {
  // Transform the date string into a Date object
  const dateObj = new Date(date);
  
  // Format the date as desired (e.g., "Month Day, Year")
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="news-item">
      <img src={img} className='img' />
      <h6 className='date'>{formattedDate}</h6>
      <h1 className='title'>{title}</h1> {/* Changed 'headline' to 'title' to match the prop name */}
    </div>
  );
};

export default NewsItem;
