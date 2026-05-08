import React from 'react';
import { ResponsiveContainer } from 'recharts';

export function ChartWrapper({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-96">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="flex-grow w-full h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
