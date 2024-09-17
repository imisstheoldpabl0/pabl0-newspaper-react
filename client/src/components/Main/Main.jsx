import React, { useState, useEffect, useCallback } from "react";
import NewsList from "./NewsList/NewsList";
import "./Main.css";

const Main = () => {
  const [pages, setPages] = useState([1]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMorePages = useCallback(() => {
    if (!loading && hasMore) {
      setPages(prevPages => [...prevPages, prevPages.length + 1]);
    }
  }, [loading, hasMore]);

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

  return (
    <section className="main">
      {pages.map(page => (
        <NewsList
          key={page}
          page={page}
          setLoading={setLoading}
          setHasMore={setHasMore}
        />
      ))}
    </section>
  );
};

export default Main;
