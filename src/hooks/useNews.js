import { useState, useEffect, useCallback } from 'react';
import { fetchNewsArticles } from '../services/news';
import toast from 'react-hot-toast';

const CACHE_KEY = 'space_news_cache';
const CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const loadNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
            setArticles(data);
            setLoading(false);
            return;
          }
        }
      }

      const response = await fetchNewsArticles(50);
      const data = response.results;
      
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
      
      setArticles(data);
      if (forceRefresh) toast.success('News updated!');
    } catch (err) {
      setError('Failed to fetch news articles.');
      if (forceRefresh) toast.error('Failed to load latest news');
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setArticles(JSON.parse(cached).data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const processedArticles = articles
    .filter(article => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.news_site.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.published_at) - new Date(a.published_at);
      } else if (sortBy === 'source') {
        return a.news_site.localeCompare(b.news_site);
      }
      return 0;
    });

  return {
    articles: processedArticles,
    rawArticles: articles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    refresh: () => loadNews(true)
  };
}
