import React, { useState, useRef } from 'react';
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

  const {
    isDragging,
    isResizing,
    onDragStart,
    onResizeStart
  } = useBlockInteraction({
    block,
    columns,
    rows,
    editMode,
    onUpdate,
    isAreaAvailable,
    blockRef
  });

  // คำนวณตำแหน่ง % สำหรับ 0px Gap
  const style: React.CSSProperties = {
    left: `${(block.x / columns) * 100}%`,
    top: `${(block.y / rows) * 100}%`,
    width: `${(block.w / columns) * 100}%`,
    height: `${(block.h / rows) * 100}%`,
    position: 'absolute',
    transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
    zIndex: isDragging ? 100 : 10
  };

  const handleSaveConfig = (config: VisConfig) => {
    onUpdate(block.id, {
      type: config.visType,
      title: config.title,
      visConfig: config,
    });
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
        {/* Block title (แสดงเฉพาะ edit mode หรือ visType ที่ไม่ใช่ title/chart) */}
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

      {/* Config Popup — rendered outside block to avoid z-index issues */}
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

export default DashboardBlock;
