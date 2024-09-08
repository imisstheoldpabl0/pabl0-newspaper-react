import React from "react";
import "../../NewsList/NewsItem/NewsItem.css";

const PolicialesItem = ({ date, title, img }) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="news-item">
      <img src={img} className='img' alt={title} />
      <h6 className='date'>{formattedDate}</h6>
      <h1 className='title'>{title}</h1>
    </div>
  );
};

export default PolicialesItem;
