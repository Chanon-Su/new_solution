import React from 'react';

interface DashboardGridProps {
  columns: number;
  rows: number;
  layoutMode: boolean;
  editMode: boolean;
  onConfigChange: (cols: number, rows: number) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ columns, rows, layoutMode, editMode, onConfigChange }) => {
  // Generate vertices (intersections)
  const intersections = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= columns; c++) {
      // Is it on the topmost row or leftmost column? (Image 2 request)
      const isEdge = r === 0 || c === 0 || r === rows || c === columns;
      intersections.push({ r, c, isEdge });
    }
  }

  return (
    <>
      <div className={`dashboard-grid-container ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}>
        <div className="grid-content-area">
          {/* Intersection Marks (+) - Vertex Aligned */}
          {intersections.map(({ r, c, isEdge }) => (
            <div
              key={`dot-${r}-${c}`}
              className={`grid-intersection ${isEdge ? 'is-edge' : ''}`}
              style={{
                left: `${(100 / columns) * c}%`,
                top: `${(100 / rows) * r}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Coordinates Layer - ตัวเลขพิกัดเขียว (1-N) วางกึ่งกลางช่อง (Centered in Cells) */}
      <div className={`coordinates-layer standalone ${layoutMode ? 'layout-mode' : ''}`}>
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`x-${i}`}
            className="coordinate-circle"
            style={{
              top: 'calc(var(--dash-margin) + var(--dash-border-width) / 2)',
              left: `calc(var(--dash-margin) + var(--dash-padding) + var(--dash-border-width) + (100% - (var(--dash-margin) + var(--dash-padding) + var(--dash-border-width)) * 2) * ${(i + 0.5) / columns})`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100
            }}
          >
            {i + 1}
          </div>
        ))}
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={`y-${i}`}
            className="coordinate-circle"
            style={{
              left: 'calc(var(--dash-margin) + var(--dash-border-width) / 2)',
              top: `calc(var(--dash-margin) + var(--dash-padding) + var(--dash-border-width) + (100% - (var(--dash-margin) + var(--dash-padding) + var(--dash-border-width)) * 2) * ${(i + 0.5) / rows})`,
              transform: 'translate(-50%, -50%)',
              zIndex: 100
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardGrid;
