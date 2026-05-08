import React from 'react';
import { Navigation, MapPin, Gauge, ArrowUp } from 'lucide-react';

export function ISSStats({ currentPos, currentSpeed, nearestPlace, altitude, positionsCount }) {
  const stats = [
    {
      label: 'Latitude',
      value: currentPos ? currentPos.lat.toFixed(4) : '--',
      icon: Navigation,
      color: 'text-blue-500'
    },
    {
      label: 'Longitude',
      value: currentPos ? currentPos.lng.toFixed(4) : '--',
      icon: Navigation,
      color: 'text-blue-500'
    },
    {
      label: 'Velocity',
      value: currentSpeed ? `${Math.round(currentSpeed).toLocaleString()} km/h` : 'Calculating...',
      icon: Gauge,
      color: 'text-purple-500'
    },
    {
      label: 'Altitude',
      value: altitude ? `${Math.round(altitude)} km` : 'Computing...',
      icon: ArrowUp,
      color: 'text-amber-500'
    },
    {
      label: 'Nearest Region',
      value: nearestPlace || 'Scanning...',
      icon: MapPin,
      color: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="bg-white/80 dark:bg-space-800/80 backdrop-blur-md p-6 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-blue-500/20 transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-stone-50 dark:bg-space-900 border border-gray-100 dark:border-white/5 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 font-mono tracking-tight">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
