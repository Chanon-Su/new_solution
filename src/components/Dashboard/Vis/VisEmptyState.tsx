import React from 'react';
import { BarChart2, Settings } from 'lucide-react';

interface VisEmptyStateProps {
  editMode: boolean;
  onConfigure?: () => void;
}

const VisEmptyState: React.FC<VisEmptyStateProps> = ({ editMode, onConfigure }) => (
  <div className="vis-empty-state">
    <BarChart2 className="vis-empty-state__icon" size={28} />
    <p className="vis-empty-state__label">ยังไม่มี Visualization</p>
    {editMode && onConfigure && (
      <button className="vis-empty-state__btn" onClick={onConfigure}>
        <Settings size={13} />
        ตั้งค่า Vis
      </button>
    )}
  </div>
);

export default VisEmptyState;
