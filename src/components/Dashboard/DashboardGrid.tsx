import React from 'react';

interface DashboardGridProps {
  columns: number;
  rows: number;
  layoutMode: boolean;
  editMode: boolean;
  onConfigChange: (cols: number, rows: number) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ columns, rows, layoutMode, editMode, onConfigChange }) => {
  const gridCells = Array.from({ length: columns * rows });

  return (
    <>
      {/* Grid Intersections Layer */}
      <div
        className={`dashboard-grid-container ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {gridCells.map((_, i) => (
          <div key={i} className="grid-intersection" />
        ))}
      </div>

      {/* Coordinate Circles Layer (Top & Left) */}
      {layoutMode && (
        <div className="coordinates-layer layout-mode">
          {/* Top X Coordinates */}
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={`x-${i}`}
              className="coordinate-circle"
              style={{
                top: '15px',
                left: `calc(40px + (100% - 80px) / ${columns} * ${i} + (100% - 80px) / ${columns} / 2)`,
                transform: 'translateX(-50%)'
              }}
            >
              {i + 1}
            </div>
          ))}
          {/* Left Y Coordinates */}
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={`y-${i}`}
              className="coordinate-circle"
              style={{
                left: '15px',
                top: `calc(40px + (100% - 80px) / ${rows} * ${i} + (100% - 80px) / ${rows} / 2)`,
                transform: 'translateY(-50%)'
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Floating Grid Configurator (Bottom Right) */}
      {layoutMode && (
        <div className="grid-configurator glass-panel">
          <div className="config-row">
            <span>COLUMNS:</span>
            <div className="num-control">
              <button onClick={() => onConfigChange(Math.max(4, columns - 1), rows)}>-</button>
              <span className="value">{columns}</span>
              <button onClick={() => onConfigChange(Math.min(20, columns + 1), rows)}>+</button>
            </div>
          </div>
          <div className="config-row">
            <span>ROWS:</span>
            <div className="num-control">
              <button onClick={() => onConfigChange(columns, Math.max(4, rows - 1))}>-</button>
              <span className="value">{rows}</span>
              <button onClick={() => onConfigChange(columns, Math.min(16, rows + 1))}>+</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardGrid;
