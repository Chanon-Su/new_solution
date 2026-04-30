import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { VisDataPoint } from '../../../../hooks/useVisData';

interface VisPieChartProps {
  points: VisDataPoint[];
  currency?: string;
}

const VisPieChart: React.FC<VisPieChartProps> = ({ points, currency = 'THB' }) => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={points}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius="40%"
        outerRadius="70%"
        paddingAngle={2}
      >
        {points.map((entry, i) => (
          <Cell key={`cell-${i}`} fill={entry.color} stroke="transparent" />
        ))}
      </Pie>
      <Tooltip
        formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, '']}
        contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
        labelStyle={{ color: '#aaa' }}
        itemStyle={{ color: '#10b981' }}
      />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: 11, color: '#888' }}
      />
    </PieChart>
  </ResponsiveContainer>
);

export default VisPieChart;
