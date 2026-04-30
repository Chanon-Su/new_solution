import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { VisDataPoint, VisMilestonePoint } from '../../../../hooks/useVisData';

// ── Normal Bar Chart ──────────────────────────────────────────────────────────

interface VisBarChartProps {
  points: VisDataPoint[];
  currency?: string;
}

export const VisBarChart: React.FC<VisBarChartProps> = ({ points, currency = 'THB' }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
      <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false}
        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
      <Tooltip
        formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, '']}
        contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
        labelStyle={{ color: '#aaa' }}
        itemStyle={{ color: '#10b981' }}
      />
      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
        {points.map((entry, i) => (
          <Cell key={`cell-${i}`} fill={entry.color ?? '#10b981'} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

// ── Target Bar Chart (from Milestone) ────────────────────────────────────────

interface VisTargetBarChartProps {
  points: VisMilestonePoint[];
}

const CustomTargetBarLabel = ({ x, y, width, value }: any) => {
  if (!value && value !== 0) return null;
  return (
    <text x={x + width / 2} y={y - 4} fill="#10b981" textAnchor="middle" fontSize={10} fontWeight={600}>
      {`${value}%`}
    </text>
  );
};

export const VisTargetBarChart: React.FC<VisTargetBarChartProps> = ({ points }) => {
  const data = points.map(p => ({
    name: p.name,
    percent: p.percent,
    label: `${p.current.toLocaleString()} / ${p.target.toLocaleString()} ${p.unit}`,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#888', fontSize: 10 }}
          axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
        <YAxis type="category" dataKey="name" tick={{ fill: '#ccc', fontSize: 11 }}
          axisLine={false} tickLine={false} width={90} />
        <Tooltip
          formatter={(v: any, _: any, props: any) => [
            `${Number(v).toFixed(1)}% — ${props.payload?.label}`, ''
          ]}
          contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
          labelStyle={{ color: '#aaa' }}
          itemStyle={{ color: '#10b981' }}
        />
        <ReferenceLine x={100} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1} />
        <Bar dataKey="percent" radius={[0, 4, 4, 0]} label={<CustomTargetBarLabel />}>
          {data.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.percent >= 100 ? '#10b981' : entry.percent >= 60 ? '#3b82f6' : '#f59e0b'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
