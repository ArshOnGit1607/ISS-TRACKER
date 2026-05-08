import React from 'react';
import { NewsToolbar } from './NewsToolbar';
import { NewsList } from './NewsList';
import { Newspaper } from 'lucide-react';

export function NewsDashboard({ data }) {
  const { 
    articles, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery, 
    sortBy, 
    setSortBy, 
    refresh 
  } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center uppercase tracking-wider">
          <Newspaper className="mr-3 text-blue-500" size={32} />
          Mission Briefings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest text-xs">
          Global aerospace intel and intelligence feeds
        </p>
      </div>

      <div className="bg-white/50 dark:bg-space-800/50 backdrop-blur-md p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-blue-500/5 transition-all">
        <NewsToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onRefresh={refresh}
          loading={loading}
        />
      </div>

      <NewsList 
        articles={articles} 
        loading={loading} 
        error={error} 
        onRetry={() => refresh(true)}
      />
    </div>
  );
}
