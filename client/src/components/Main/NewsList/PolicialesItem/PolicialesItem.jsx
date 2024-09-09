import React from "react";
import "../NewsList.css";

const PolicialesItem = ({ date, title, img, id, category }) => {
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
      <p className='description'>ID: {id}</p>
      <p className='description'>Category: {category}</p>
    </div>
  );
};

export default PolicialesItem;
