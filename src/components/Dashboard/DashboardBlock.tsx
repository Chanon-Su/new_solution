import React, { useRef } from 'react';
import type { DashboardBlock as IBlock } from '../../types';
import { Settings, Trash2 } from 'lucide-react';
import { useBlockInteraction } from '../../hooks/useBlockInteraction';

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
  const blockRef = useRef<HTMLDivElement>(null);
  
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

  return (
    <div 
      ref={blockRef}
      className={`dashboard-block ${isDragging ? 'dragging' : ''}`}
      style={style}
      onMouseDown={onDragStart}
    >
      <div className="block-header">
        <span className="block-title">{block.title}</span>
      </div>

      <div className="block-content">
        {/* Placeholder for future Vis components */}
      </div>

      {editMode && (
        <>
          <div className="block-actions">
            <button className="action-btn" onClick={(e) => { e.stopPropagation(); /* Settings Placeholder */ }}>
              <Settings size={14} />
            </button>
            <button className="action-btn" onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}>
              <Trash2 size={14} />
            </button>
          </div>
          <div className="resize-handle" onMouseDown={onResizeStart} />
        </>
      )}
    </div>
  );
};

export default DashboardBlock;
