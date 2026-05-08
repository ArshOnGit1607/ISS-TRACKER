import React from 'react';
import { NewsCard } from './NewsCard';
import { Telescope } from 'lucide-react';
import { Skeleton } from '../common/Skeleton';
import { ErrorState } from '../common/ErrorState';

export function NewsList({ articles, loading, error, onRetry }) {
  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="h-96">
        <ErrorState title="Failed to load news" message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
        <Telescope size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No articles found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
