import React from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';

export function NewsToolbar({ searchQuery, setSearchQuery, sortBy, setSortBy, onRefresh, loading }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="relative flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          placeholder="Search space news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Filter size={16} />
          <span className="hidden sm:inline">Sort by:</span>
          <select 
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date">Latest Date</option>
            <option value="source">News Source</option>
          </select>
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="p-2 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          title="Refresh News"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
}
