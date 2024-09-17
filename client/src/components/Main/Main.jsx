import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import NewsList from "./NewsList/NewsList";
import "./Main.css";

const Main = () => {
  const [pages, setPages] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allNews, setAllNews] = useState({});

  const fetchNews = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/news?page=${page}&limit=8`);
      const newArticles = response.data.articles;

      setAllNews(prevNews => {
        const updatedNews = { ...prevNews };
        newArticles.forEach(article => {
          if (!updatedNews[article.id_category]) {
            updatedNews[article.id_category] = [];
          }
          updatedNews[article.id_category] = [
            ...updatedNews[article.id_category],
            article
          ];
        });
        return updatedNews;
      });

      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePages = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = pages.length + 1;
      setPages(prevPages => [...prevPages, nextPage]);
      fetchNews(nextPage);
    }
  }, [loading, hasMore, pages, fetchNews]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 200
    ) {
      loadMorePages();
    }
  }, [loadMorePages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  return (
    <section className="main">
      {pages.map(page => (
        <NewsList
          key={page}
          page={page}
          news={allNews}
          loading={loading}
        />
      ))}
    </section>
  );
};

export default Main;