import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import type { VisDataPoint } from '../../../../hooks/useVisData';

interface VisTreeMapProps {
  points: VisDataPoint[];
  currency?: string;
}

const CustomContent = ({ x, y, width, height, name, value, color }: any) => {
  if (!width || !height || width < 30 || height < 20) return null;
  const showText = width > 50 && height > 30;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} rx={4} stroke="#0D0D0D" strokeWidth={2} />
      {showText && (
        <>
          <text x={x + 8} y={y + 18} fill="#fff" fontSize={Math.min(13, width / 6)} fontWeight={600}>
            {name}
          </text>
          {height > 44 && (
            <text x={x + 8} y={y + 34} fill="rgba(255,255,255,0.6)" fontSize={Math.min(10, width / 8)}>
              {value?.toLocaleString()}
            </text>
          )}
        </>
      )}
    </g>
  );
};

const VisTreeMap: React.FC<VisTreeMapProps> = ({ points, currency = 'THB' }) => (
  <ResponsiveContainer width="100%" height="100%">
    <Treemap
      data={points.map(p => ({ ...p, size: p.value }))}
      dataKey="size"
      content={<CustomContent />}
      isAnimationActive={false}
    >
      <Tooltip
        formatter={(v: any) => [`${currency} ${Number(v).toLocaleString()}`, '']}
        contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8 }}
        labelStyle={{ color: '#aaa' }}
        itemStyle={{ color: '#10b981' }}
      />
    </Treemap>
  </ResponsiveContainer>
);

export default VisTreeMap;
