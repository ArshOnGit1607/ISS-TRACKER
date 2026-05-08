import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl h-full w-full min-h-[200px]">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors font-medium"
        >
          <RefreshCw size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
