import React, { useState, useRef, memo } from 'react';
import type { DashboardBlock as IBlock, VisConfig } from '../../types';
import { Settings, Trash2 } from 'lucide-react';
import { useBlockInteraction } from '../../hooks/useBlockInteraction';
import VisRenderer from './Vis/VisRenderer';
import VisConfigPopup from './Vis/VisConfigPopup';
import { useSettings } from '../../hooks/SettingsManager';
import './Vis/Vis.css';

interface DashboardBlockProps {
  block: IBlock;
  columns: number;
  rows: number;
  editMode: boolean;
  onUpdate: (id: string, updates: Partial<IBlock>) => void;
  onDelete: (id: string) => void;
  isAreaAvailable: (page: number, x: number, y: number, w: number, h: number, excludeId?: string) => boolean;
}

const DashboardBlock: React.FC<DashboardBlockProps> = ({
  block, columns, rows, editMode, onUpdate, onDelete, isAreaAvailable
}) => {
  const { language } = useSettings();
  const blockRef = useRef<HTMLDivElement>(null);
  const [showConfig, setShowConfig] = useState(false);

  const { isDragging, isResizing, onDragStart, onResizeStart } = useBlockInteraction({
    block, columns, rows, editMode, onUpdate, isAreaAvailable, blockRef,
  });

  // คำนวณตำแหน่ง % สำหรับ 0px Gap
  const style: React.CSSProperties = {
    left:     `${(block.x / columns) * 100}%`,
    top:      `${(block.y / rows) * 100}%`,
    width:    `${(block.w / columns) * 100}%`,
    height:   `${(block.h / rows) * 100}%`,
    position: 'absolute',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    zIndex:   isDragging ? 100 : 10,
  };

  const handleSaveConfig = (config: VisConfig) => {
    onUpdate(block.id, { type: config.visType, title: config.title, visConfig: config });
    setShowConfig(false);
  };

  return (
    <>
      <div
        ref={blockRef}
        className={`dashboard-block ${isDragging ? 'dragging' : ''}`}
        style={style}
        onMouseDown={onDragStart}
      >
        {editMode && (
          <div className="block-header">
            <span className="block-title">{block.title}</span>
          </div>
        )}

        <div className="block-content">
          <VisRenderer
            config={block.visConfig}
            editMode={editMode}
            onConfigure={() => setShowConfig(true)}
          />
        </div>

        {editMode && (
          <>
            <div className="block-actions">
              <button
                className="action-btn"
                onClick={(e) => { e.stopPropagation(); setShowConfig(true); }}
                title={language === 'th' ? 'ตั้งค่า Visualization' : 'Configure Visualization'}
              >
                <Settings size={14} />
              </button>
              <button
                className="action-btn"
                onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
                title={language === 'th' ? 'ลบ Block' : 'Delete Block'}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="resize-handle" onMouseDown={onResizeStart} />
          </>
        )}
      </div>

      {showConfig && (
        <VisConfigPopup
          blockId={block.id}
          initialConfig={block.visConfig}
          onSave={handleSaveConfig}
          onCancel={() => setShowConfig(false)}
        />
      )}
    </>
  );
};

// React.memo — ป้องกัน block re-render เมื่อ blocks อื่นเปลี่ยน
// หรือเมื่อ parent state เปลี่ยนแต่ block นี้ไม่ได้รับผลกระทบ
export default memo(DashboardBlock, (prev, next) => {
  return (
    prev.block     === next.block     && // object reference (useDashboard ส่ง immutable updates)
    prev.editMode  === next.editMode  &&
    prev.columns   === next.columns   &&
    prev.rows      === next.rows      &&
    prev.onUpdate  === next.onUpdate  && // stable ref จาก useCallback
    prev.onDelete  === next.onDelete  && // stable ref จาก useCallback
    prev.isAreaAvailable === next.isAreaAvailable
  );
});
