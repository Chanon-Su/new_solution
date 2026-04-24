import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer,
} from 'recharts';
import type { VisDataPoint } from '../../../../hooks/useVisData';

interface VisHistogramProps {
  points: VisDataPoint[];
}

const VisHistogram: React.FC<VisHistogramProps> = ({ points }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={points} margin={{ top: 8, right: 8, bottom: 24, left: 0 }} barCategoryGap="5%">
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
      <XAxis
        dataKey="name"
        tick={{ fill: '#888', fontSize: 9 }}
        axisLine={false}
        tickLine={false}
        angle={-30}
        textAnchor="end"
      />
      <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
      <Tooltip
        formatter={(v: number) => [v, 'Count']}
        contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
        labelStyle={{ color: '#aaa' }}
        itemStyle={{ color: '#10b981' }}
      />
      <Bar dataKey="value" radius={[3, 3, 0, 0]}>
        {points.map((entry, i) => (
          <Cell key={`cell-${i}`} fill="#10b981" fillOpacity={0.5 + (i / points.length) * 0.5} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default VisHistogram;
