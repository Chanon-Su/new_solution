import React from 'react';

interface DashboardControlsProps {
  editMode: boolean;
  layoutMode: boolean;
  onToggleEdit: () => void;
  onToggleLayout: () => void;
  onAddBlock: () => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  editMode,
  layoutMode,
  onToggleEdit,
  onToggleLayout,
  onAddBlock
}) => {
  return (
    <div className="dashboard-controls">
      {/* Help Circle (Anchor) */}
      <div className="control-btn help" title="Need help?">?</div>

      {/* Edit Mode Button (Bottom-most in stacking) */}
      <div 
        className={`control-btn edit ${editMode ? 'active' : ''}`} 
        onClick={onToggleEdit}
        title="Toggle Edit Mode"
      >
        ✏️
      </div>

      {/* These appear when Edit Mode is active */}
      {editMode && (
        <>
          <div 
            className={`control-btn layout ${layoutMode ? 'active' : ''}`} 
            onClick={onToggleLayout}
            title="Toggle Layout Grid"
            style={{ animation: 'bounceIn 0.3s ease-out' }}
          >
            📐
          </div>
          <div 
            className="control-btn add" 
            onClick={onAddBlock}
            title="Add New Block"
            style={{ animation: 'bounceIn 0.4s ease-out' }}
          >
            +
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardControls;
