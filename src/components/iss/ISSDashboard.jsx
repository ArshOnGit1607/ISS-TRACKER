import React from 'react';
import { ISSMap } from './ISSMap';
import { ISSStats } from './ISSStats';
import { ISSAstronauts } from './ISSAstronauts';
import { RefreshCw, Satellite } from 'lucide-react';
import { ErrorState } from '../common/ErrorState';

export function ISSDashboard({ data }) {
  const { currentPos, positions, currentSpeed, altitude, nearestPlace, loading, error, refresh } = data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center uppercase tracking-wider">
            <Satellite className="mr-3 text-blue-500 animate-pulse" size={32} />
            ISS Live Telemetry
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest text-xs">
            SGP4 orbital propagation • real-time computation
          </p>
        </div>
        <button 
          onClick={() => refresh(true)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-space-700 rounded-lg transition-all shadow-sm hover:shadow-blue-500/20 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          <span className="uppercase tracking-wider text-sm font-bold">Sync</span>
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState title="Telemetry Error" message={error} onRetry={() => refresh(true)} />
        </div>
      )}

      <ISSStats 
        currentPos={currentPos} 
        currentSpeed={currentSpeed} 
        altitude={altitude}
        nearestPlace={nearestPlace}
        positionsCount={positions ? positions.length : 0}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-white/10 hover:shadow-blue-500/10 transition-shadow">
          <ISSMap positions={positions || []} currentPos={currentPos} />
        </div>
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <div className="flex-1 bg-white dark:bg-space-800 border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm hover:shadow-blue-500/10 transition-shadow">
            <ISSAstronauts />
          </div>
        </div>
      </div>
    </div>
  );
}
