import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../../types';
import { Settings, Trash2 } from 'lucide-react';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  
  // เก็บสถานะชั่วคราวขณะลาก/ขยาย
  const dragStart = useRef({ mouseX: 0, mouseY: 0, blockX: 0, blockY: 0, blockW: 0, blockH: 0 });

  const getContainerRect = useCallback(() => {
    return blockRef.current?.parentElement?.getBoundingClientRect();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = getContainerRect();
    if (!rect) return;

    const cellWidth = rect.width / columns;
    const cellHeight = rect.height / rows;

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.current.mouseX) / cellWidth;
      const deltaY = (e.clientY - dragStart.current.mouseY) / cellHeight;
      
      const nextX = Math.round(dragStart.current.blockX + deltaX);
      const nextY = Math.round(dragStart.current.blockY + deltaY);

      // ตรวจสอบการชน (Solid Object)
      if (isAreaAvailable(block.page, nextX, nextY, block.w, block.h, block.id)) {
        if (nextX !== block.x || nextY !== block.y) {
          onUpdate(block.id, { x: nextX, y: nextY });
        }
      }
    }

    if (isResizing) {
      const deltaW = (e.clientX - dragStart.current.mouseX) / cellWidth;
      const deltaH = (e.clientY - dragStart.current.mouseY) / cellHeight;
      
      const nextW = Math.max(1, Math.round(dragStart.current.blockW + deltaW));
      const nextH = Math.max(1, Math.round(dragStart.current.blockH + deltaH));

      // ตรวจสอบการชนขยาย (Solid Object Resize)
      if (isAreaAvailable(block.page, block.x, block.y, nextW, nextH, block.id)) {
        if (nextW !== block.w || nextH !== block.h) {
          onUpdate(block.id, { w: nextW, h: nextH });
        }
      }
    }
  }, [isDragging, isResizing, columns, rows, block, isAreaAvailable, onUpdate, getContainerRect]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    document.body.classList.remove('no-select');
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const onDragStart = (e: React.MouseEvent) => {
    if (!editMode || isResizing) return;
    setIsDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h
    };
    document.body.classList.add('no-select');
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h
    };
    document.body.classList.add('no-select');
  };

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
