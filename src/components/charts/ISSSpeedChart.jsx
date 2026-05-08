import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { formatISSChartData } from '../../utils/chartData';

export function ISSSpeedChart({ positions }) {
  const data = useMemo(() => formatISSChartData(positions), [positions]);

  return (
    <ChartWrapper title="ISS Speed History (km/h)">
      {data.length > 0 ? (
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} domain={['dataMin - 1000', 'dataMax + 1000']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="speed" 
            name="Speed"
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            animationDuration={500}
          />
        </LineChart>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          Gathering enough positions to calculate speed...
        </div>
      )}
    </ChartWrapper>
  );
}
