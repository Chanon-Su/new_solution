import React from 'react';

interface DashboardGridProps {
  columns: number;
  rows: number;
  layoutMode: boolean;
  editMode: boolean;
  onConfigChange: (cols: number, rows: number) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ columns, rows, layoutMode, editMode, onConfigChange }) => {
  // เงื่อนไข: แสดงตารางเฉพาะเมื่อเปิด Edit Mode เท่านั้น
  if (!editMode) return null;

  // สร้าง Array ของช่องตารางตามจำนวน columns * rows (เช่น 6 * 4 = 24 ช่อง)
  const cells = Array.from({ length: columns * rows });

  return (
    <div
      className={`dashboard-grid-container ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
    >
      <div 
        className="grid-content-area"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells.map((_, i) => (
          <div key={i} className="grid-cell" />
        ))}
      </div>
    </div>
  );
};

export default DashboardGrid;
