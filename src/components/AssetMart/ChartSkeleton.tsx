import React from 'react';
import './ChartSkeleton.css';

const ChartSkeleton: React.FC = () => {
  return (
    <div className="chart-skeleton-container">
      <div className="skeleton-shimmer"></div>
      <div className="skeleton-content">
        <div className="skeleton-header">
          <div className="skeleton-price"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-chart-area"></div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
