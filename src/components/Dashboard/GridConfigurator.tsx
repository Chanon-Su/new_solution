import React, { useMemo } from 'react';
import type { DashboardBlock } from '../../types';

interface GridConfiguratorProps {
  columns: number;
  setColumns: (val: number) => void;
  rows: number;
  setRows: (val: number) => void;
  blocks: DashboardBlock[];
}

const GridConfigurator: React.FC<GridConfiguratorProps> = ({ 
  columns, 
  setColumns, 
  rows, 
  setRows,
  blocks
}) => {
  // คำนวณหาจุดที่ไกลที่สุดของบล็อกที่มีอยู่
  const { minCols, minRows } = useMemo(() => {
    let maxR = 4; // ค่าเริ่มต้นขั้นต่ำ
    let maxB = 2; // ค่าเริ่มต้นขั้นต่ำ
    
    blocks.forEach(b => {
      maxR = Math.max(maxR, b.x + b.w);
      maxB = Math.max(maxB, b.y + b.h);
    });
    
    return { minCols: maxR, minRows: maxB };
  }, [blocks]);

  return (
    <div className="grid-configurator">
      <div className="config-row">
        <span className="config-label">GRID | </span>
        <div className="num-control">
          <button className="step-btn" onClick={() => setColumns(Math.min(20, columns + 1))}>▲</button>
          <span className="value">{columns}</span>
          <button 
            className="step-btn" 
            onClick={() => {
              if (columns > minCols) setColumns(columns - 1);
            }} 
            style={{ opacity: columns <= minCols ? 0.2 : 0.5 }}
            disabled={columns <= minCols}
          >
            ▼
          </button>
        </div>
        <span className="config-divider">X</span>
        <div className="num-control">
          <button className="step-btn" onClick={() => setRows(Math.min(16, rows + 1))}>▲</button>
          <span className="value">{rows}</span>
          <button 
            className="step-btn" 
            onClick={() => {
              if (rows > minRows) setRows(rows - 1);
            }} 
            style={{ opacity: rows <= minRows ? 0.2 : 0.5 }}
            disabled={rows <= minRows}
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};

export default GridConfigurator;
