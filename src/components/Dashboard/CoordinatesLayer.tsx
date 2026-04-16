import React from 'react';

interface CoordinatesLayerProps {
  columns: number;
  rows: number;
}

const CoordinatesLayer: React.FC<CoordinatesLayerProps> = ({ columns, rows }) => {
  // สร้างลำดับตัวเลข 1..columns และ 1..rows สำหรับระบุลำดับช่อง (Cells)
  const colLabels = Array.from({ length: columns }, (_, i) => i + 1);
  const rowLabels = Array.from({ length: rows }, (_, i) => i + 1);

  return (
    <div className="coordinates-layer standalone">
      {/* แนวนอน (X-Axis) - วางไว้กึ่งกลางช่องในแนวคอลัมน์ */}
      <div className="x-axis-labels" style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }}>
        {colLabels.map(label => (
          <div key={`col-${label}`} className="coord-label-wrapper" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className="coordinate-circle">{label}</div>
          </div>
        ))}
      </div>

      {/* แนวตั้ง (Y-Axis) - วางไว้กึ่งกลางช่องในแนวแถว */}
      <div className="y-axis-labels" style={{
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }}>
        {rowLabels.map(label => (
          <div key={`row-${label}`} className="coord-label-wrapper" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div className="coordinate-circle">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoordinatesLayer;
