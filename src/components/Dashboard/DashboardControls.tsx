import React from 'react';
import { useSettings } from '../../hooks/SettingsManager';

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
  const { language } = useSettings();

  return (
    <div className="dashboard-controls">
      {/* Help Circle - The Anchor Point at the Bottom */}
      <div className="control-btn help circle" title={language === 'th' ? 'ต้องการความช่วยเหลือ?' : 'Need help?'}>?</div>

      {/* Edit Button - Directly above Help */}
      <div 
        className={`control-btn edit ${editMode ? 'active' : ''}`} 
        onClick={onToggleEdit}
        title={language === 'th' ? 'เปิด/ปิด โหมดแก้ไข' : 'Toggle Edit Mode'}
      >
        ✏️
      </div>

      {/* Mode-specific Buttons - Stacked above Edit */}
      {editMode && (
        <>
          <div 
            className={`control-btn layout ${layoutMode ? 'active' : ''}`} 
            onClick={onToggleLayout}
            title={language === 'th' ? 'เปิด/ปิด ตาราง Layout' : 'Toggle Layout Grid'}
            style={{ animation: 'bounceIn 0.3s ease-out' }}
          >
            🔲
          </div>
          <div 
            className="control-btn add" 
            onClick={onAddBlock}
            title={language === 'th' ? 'เพิ่ม Block ใหม่' : 'Add New Block'}
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
