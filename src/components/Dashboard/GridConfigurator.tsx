import React from 'react';

interface GridConfiguratorProps {
  columns: number;
  setColumns: (val: number) => void;
  rows: number;
  setRows: (val: number) => void;
}

const GridConfigurator: React.FC<GridConfiguratorProps> = ({ 
  columns, 
  setColumns, 
  rows, 
  setRows 
}) => {
  return (
    <div className="grid-configurator">
      <div className="config-row">
        <span className="config-label">GRID | </span>
        <div className="num-control">
          <button className="step-btn" onClick={() => setColumns(Math.max(4, columns - 1))}>◀</button>
          <span className="value">{columns}</span>
          <button className="step-btn" onClick={() => setColumns(Math.min(30, columns + 1))}>▶</button>
        </div>
        <span className="config-divider">X</span>
        <div className="num-control">
          <button className="step-btn" onClick={() => setRows(Math.max(4, rows - 1))}>◀</button>
          <span className="value">{rows}</span>
          <button className="step-btn" onClick={() => setRows(Math.min(24, rows + 1))}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default GridConfigurator;
