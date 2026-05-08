import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { formatNewsDistribution } from '../../utils/chartData';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#14b8a6'];

export function NewsDistributionChart({ articles }) {
  const data = useMemo(() => formatNewsDistribution(articles), [articles]);

  return (
    <ChartWrapper title="News Source Distribution">
      {data.length > 0 ? (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
          />
          <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
        </PieChart>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No articles to display.
        </div>
      )}
    </ChartWrapper>
  );
}
