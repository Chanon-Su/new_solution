import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  date: string;
  progress: number;
  effort: number;
}

interface MilestoneChartProps {
  data: ChartData[];
  targetValue: number;
  isZoomedToGoal: boolean;
}

import { ReferenceLine } from 'recharts';

const MilestoneChart: React.FC<MilestoneChartProps> = ({ data, targetValue, isZoomedToGoal }) => {
  const maxProgress = Math.max(...data.map(d => d.progress), 0);
  
  // Manual Zoom Logic:
  // If isZoomedToGoal is true, show up to target + 10% padding
  // If false, zoom to 'auto' to see small steps clearly
  const rightDomain = isZoomedToGoal 
    ? [0, Math.max(targetValue * 1.1, maxProgress * 1.1)] 
    : ['auto', 'auto'];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => {
              // Shorten labels for hourly/daily
              if (value.includes(' ')) return value.split(' ')[1];
              return value;
            }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6B7280" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            allowDecimals={false}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#10B981" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            domain={rightDomain}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#131313', 
              border: '1px solid rgba(255,255,255,0.1)', 
              borderRadius: '12px',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#10B981' }}
          />
          
          {/* Target Goal Line */}
          {targetValue > 0 && (
            <ReferenceLine 
              yAxisId="right"
              y={targetValue} 
              stroke="#10B981" 
              strokeDasharray="5 5" 
              strokeOpacity={0.5}
              label={{ 
                value: `GOAL: ${targetValue.toLocaleString()}`, 
                position: 'insideBottomRight', 
                fill: '#10B981', 
                fontSize: 10,
                fontWeight: 'bold',
                opacity: 0.8
              }} 
            />
          )}

          <Bar 
            yAxisId="left"
            dataKey="effort" 
            barSize={20} 
            fill="#10B981" 
            opacity={0.3} 
            radius={[4, 4, 0, 0]} 
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="progress" 
            stroke="#10B981" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }} 
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MilestoneChart;
