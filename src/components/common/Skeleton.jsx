import React from 'react';

export function Skeleton({ className = '', variant = 'rectangular' }) {
  const baseClass = "bg-gray-200 dark:bg-gray-700 animate-pulse";
  const roundedClass = variant === 'circular' ? "rounded-full" : "rounded-xl";
  
  return (
    <div className={`${baseClass} ${roundedClass} ${className}`}></div>
  );
}
