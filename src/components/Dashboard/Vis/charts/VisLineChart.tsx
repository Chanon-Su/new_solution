import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import type { VisTimePoint } from '../../../../hooks/useVisData';
import type { PricePoint } from '../../../../utils/mockPriceHistory';

// ── T-Log Line Chart (time series จาก transactions) ───────────────────────────

interface VisLineChartTLogProps {
  points: VisTimePoint[];
  currency?: string;
}

export const VisLineChartTLog: React.FC<VisLineChartTLogProps> = ({ points, currency = 'THB' }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={points} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
      <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: '#888', fontSize: 10 }} axisLine={false} tickLine={false}
        tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
      <Tooltip
        formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, 'Value']}
        contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
        labelStyle={{ color: '#aaa' }}
        itemStyle={{ color: '#10b981' }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#10b981"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 4, fill: '#10b981' }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ── AssetMart Line Chart (mock price history) ─────────────────────────────────

interface VisLineChartAssetProps {
  points: PricePoint[];
  symbol: string;
  currentPrice: number;
}

export const VisLineChartAsset: React.FC<VisLineChartAssetProps> = ({ points, symbol, currentPrice }) => {
  const firstPrice = points[0]?.price ?? currentPrice;
  const isUp = currentPrice >= firstPrice;
  const color = isUp ? '#10b981' : '#ef4444';

  return (
    <div className="vis-asset-line-wrapper">
      <div className="vis-asset-line-header">
        <span className="vis-asset-symbol">{symbol}</span>
        <span className={`vis-asset-price ${isUp ? 'up' : 'down'}`}>
          {currentPrice.toLocaleString()}
        </span>
        <span className={`vis-asset-change ${isUp ? 'up' : 'down'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(((currentPrice - firstPrice) / firstPrice) * 100).toFixed(2)}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <LineChart data={points} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <defs>
            <linearGradient id={`assetGrad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis domain={['auto', 'auto']} tick={{ fill: '#666', fontSize: 9 }} axisLine={false} tickLine={false}
            tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
          <Tooltip
            formatter={(v: any) => [Number(v).toLocaleString(), symbol]}
            contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
            labelStyle={{ color: '#888' }}
            itemStyle={{ color }}
          />
          <ReferenceLine y={firstPrice} stroke="#ffffff20" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
