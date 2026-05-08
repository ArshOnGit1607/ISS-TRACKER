import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, User } from 'lucide-react';

export function NewsCard({ article }) {
  return (
    <div className="group bg-white dark:bg-space-800 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl dark:hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-space-900">
        {article.image_url ? (
          <img 
            src={article.image_url} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
          {article.news_site}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-1">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-mono">
            <Clock size={14} className="mr-1.5" />
            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link"
          >
            READ <ExternalLink size={16} className="ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
