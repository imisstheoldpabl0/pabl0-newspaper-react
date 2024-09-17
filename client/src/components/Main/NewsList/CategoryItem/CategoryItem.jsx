import React from "react";
import "../NewsList.css";

const CategoryItem = ({ date, title, img, category }) => {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`news-item ${category}`}>
      <img src={img} className='img' alt={title} />
      <h6 className='date'>{formattedDate}</h6>
      <h1 className='title'>{title}</h1>
      <h4 className='category-name'>{category}</h4>
    </div>
  );
};

export default CategoryItem;
