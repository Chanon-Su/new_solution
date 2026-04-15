import React from 'react';

interface DashboardGridProps {
  columns: number;
  rows: number;
  layoutMode: boolean;
  editMode: boolean;
  onConfigChange: (cols: number, rows: number) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ columns, rows, layoutMode, editMode, onConfigChange }) => {
  // Generate vertices (intersections) — (columns+1) x (rows+1) points
  const intersections = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= columns; c++) {
      const isEdge = r === 0 || c === 0 || r === rows || c === columns;
      intersections.push({ r, c, isEdge });
    }
  }

  return (
    <>
      <div
        className={`dashboard-grid-container ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}
      >
        <div className="grid-content-area">
          {intersections.map(({ r, c, isEdge }) => (
            <div
              key={`dot-${r}-${c}`}
              className={`grid-intersection ${isEdge ? 'is-edge' : ''}`}
              style={{
                left: `${(100 / columns) * c}%`,
                top: `${(100 / rows) * r}%`,
                // ✅ FIX: transform ทำให้ตัว + อยู่ตรงจุดตัดพอดี (ก่อนหน้านี้ไม่มี transform)
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Coordinates Layer — ตัวเลขพิกัดเขียว (0..N-1) วางกึ่งกลางช่อง */}
      <div
        className={`coordinates-layer standalone ${layoutMode ? 'layout-mode' : ''}`}
        style={{ pointerEvents: 'none' }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`x-${i}`}
            className="coordinate-circle"
            style={{
              top: '0',
              left: `${((i + 0.5) / columns) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
            }}
          >
            {i}
          </div>
        ))}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`y-${i}`}
            className="coordinate-circle"
            style={{
              left: '0',
              top: `${((i + 0.5) / rows) * 100}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100,
            }}
          >
            {i}
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardGrid;
