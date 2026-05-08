import React from 'react';
import { useAstronauts } from '../../hooks/useAstronauts';
import { Users } from 'lucide-react';
import { Skeleton } from '../common/Skeleton';

export function ISSAstronauts() {
  const { astronauts, loading, error } = useAstronauts();

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center mb-4 uppercase tracking-wider"><Users className="mr-2 text-blue-500" size={20}/> Crew Manifest</h3>
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center uppercase tracking-wider">
          <Users className="mr-2 text-blue-500" size={20}/> 
          Crew Manifest
        </h3>
        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-bold font-mono border border-blue-200 dark:border-blue-800/50">
          {astronauts.length} Active
        </span>
      </div>
      <ul className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[400px]">
        {astronauts.map((astro, idx) => (
          <li key={idx} className="flex items-center p-3 bg-gray-50 dark:bg-space-900 rounded-lg border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-colors group">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3 group-hover:scale-110 transition-transform">
              {astro.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{astro.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">{astro.craft}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
