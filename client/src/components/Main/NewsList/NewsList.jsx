import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import NewsItem from './NewsItem/NewsItem.jsx';
import './NewsList.css';
import NewsLoading from './NewsLoading/NewsLoading.jsx';

const NewsList = () => {
  const [news, setNews] = useState([]); // Guarda lista de noticias
  const [page, setPage] = useState(1); // Guarda el numero de pag
  const [loading, setLoading] = useState(false); // Indica si se esta cargando contenido
  const [hasMore, setHasMore] = useState(true); // Indica si hay mas noticias por cargar

  // Obtiene las noticias desde la API
  const fetchNews = useCallback(async () => {

    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/news?page=${page}&limit=10`);
      setNews((prevNews) => [...prevNews, ...response.data.articles]); // Añade las nuevas noticias a las existentes
      setHasMore(response.data.articles.length > 0); // Verifica si hay que cargar más noticias
      setPage((prevPage) => prevPage + 1); // Suma la página
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false); // Cambia el estado de loading a false una vez haya contenido
    }
  }, [page, loading, hasMore]);

  // Muestra las noticias llamando a fetchNews()
  useEffect(() => {
    fetchNews();  // Initial fetch
  }, []);  // Only on component mount

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && hasMore && !loading) {
      fetchNews();  // Verifica si el usuario ha desplazado cerca del final de la página para cargar más noticias
    }
  }, [fetchNews, hasMore, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll); // Escucha evento scroll
    window.addEventListener('resize', handleScroll); // Escucha evento redimension
    return () => {
      window.removeEventListener('scroll', handleScroll); // Limpia los event listeners
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]); // Solo ejecuta si cambia handleScroll()

  return (
    <div className="news-list">
      {news.map((article, index) => (
        <NewsItem
          key={index}
          date={article.date}
          headline={article.headline}
          img={article.img || 'default-image-url.jpg'}
        />
      ))}
      <NewsLoading />
    </div>
  );
};

export default NewsList;
