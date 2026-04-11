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
      {/* Help Circle - The Anchor Point at the Bottom */}
      <div className="control-btn help circle" title="Need help?">?</div>

      {/* Edit Button - Directly above Help */}
      <div 
        className={`control-btn edit ${editMode ? 'active' : ''}`} 
        onClick={onToggleEdit}
        title="Toggle Edit Mode"
      >
        ✏️
      </div>

      {/* Mode-specific Buttons - Stacked above Edit */}
      {editMode && (
        <>
          <div 
            className={`control-btn layout ${layoutMode ? 'active' : ''}`} 
            onClick={onToggleLayout}
            title="Toggle Layout Grid"
            style={{ animation: 'bounceIn 0.3s ease-out' }}
          >
            🔲
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
