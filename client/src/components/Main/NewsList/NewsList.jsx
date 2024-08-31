import React, { useEffect, useState } from 'react';
import NewsItem from "./NewsItem/NewsItem";
import axios from "axios";
import './NewsList.css';

const NewsList = ({ city, myLat, myLong }) => {

  const [articles, setArticles] = useState([]); // Para guardar las tarjetas de clima

  useEffect(() => {
    async function fetchData() {
      try {
        // Petición HTTP
        const res = await axios.get(`/api/all-news`);
        let news = res.data;
        // weather (res.data.list) is an [array] of objects [{},{},{}]
        console.log(res);
        console.log(news);

        // Guarda en el array de articles el resultado. Procesa los datos
        setArticles(news
          .map(l => l));

      } catch (e) {
        setArticles([]); // No pintes nada
      }
    }

    fetchData();
  }, []); // cuando hay un cambio en la ciudad se vueve a ejecutar el useEffect              <img src={`http://openweathermap.org/img/w/${card.weather[0].icon}.png`} alt="Weather icon" />

  const displayArticles = () => {
    return articles.length !== 0
      ? articles.map((article, index) => {
        return (
          <NewsItem
            key={index}
            date={article.date}
            headline={article.headline}
            img={article.img}
          />
        );
      })
      : "";
  };

  return (
    <section className='news-list'>

      {displayArticles()}

    </section>
  );
};

export default NewsList;


// Madrid in metric units ${cityName}
//https://api.openweathermap.org/data/2.5/forecast?units=metric&q=madrid&appid=3a5cea6cca9761e16b10a370cf420965

//https://api.openweathermap.org/data/2.5/forecast?units=metric&q= ${city} &appid=3a5cea6cca9761e16b10a370cf420965

// New API url with: ${lat}, ${lon}, ${apiKey}
//https://api.openweathermap.org/data/2.5/forecast?units=metric&lat={lat}&lon={lon}&appid={apiKey}