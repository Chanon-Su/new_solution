import React, { useState, useRef, useEffect } from 'react';
import type { DashboardBlock as IBlock } from '../../types';

interface DashboardBlockProps {
  block: IBlock;
  columns: number;
  rows: number;
  editMode: boolean;
  onUpdate: (id: string, updates: Partial<IBlock>) => void;
  onDelete: (id: string) => void;
}

const DashboardBlock: React.FC<DashboardBlockProps> = ({ 
  block, columns, rows, editMode, onUpdate, onDelete 
}) => {
  const [isInteraction, setIsInteraction] = useState<'dragging' | 'resizing' | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, blockX: 0, blockY: 0, blockW: 0, blockH: 0 });

  const handleMouseDown = (e: React.MouseEvent, type: 'dragging' | 'resizing') => {
    if (!editMode) return;
    e.stopPropagation();
    setIsInteraction(type);
    
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h
    };
  };

  useEffect(() => {
    if (!isInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = blockRef.current?.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const cellW = rect.width / columns;
      const cellH = rect.height / rows;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      if (isInteraction === 'dragging') {
        const newX = Math.round(startPos.current.blockX + deltaX / cellW);
        const newY = Math.round(startPos.current.blockY + deltaY / cellH);
        
        // Boundaries & Snap
        const bufferedX = Math.max(1, Math.min(newX, columns - block.w + 1));
        const bufferedY = Math.max(1, Math.min(newY, rows - block.h + 1));
        
        if (bufferedX !== block.x || bufferedY !== block.y) {
          onUpdate(block.id, { x: bufferedX, y: bufferedY });
        }
      } else if (isInteraction === 'resizing') {
        const newW = Math.round(startPos.current.blockW + deltaX / cellW);
        const newH = Math.round(startPos.current.blockH + deltaY / cellH);
        
        const bufferedW = Math.max(1, Math.min(newW, columns - block.x + 1));
        const bufferedH = Math.max(1, Math.min(newH, rows - block.y + 1));
        
        if (bufferedW !== block.w || bufferedH !== block.h) {
          onUpdate(block.id, { w: bufferedW, h: bufferedH });
        }
      }
    };

    const handleMouseUp = () => setIsInteraction(null);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isInteraction, block.x, block.y, block.w, block.h, columns, rows, onUpdate, block.id]);

  // CSS Grid Area: grid-row-start / grid-column-start / grid-row-end / grid-column-end
  const style: React.CSSProperties = {
    gridArea: `${block.y} / ${block.x} / span ${block.h} / span ${block.w}`,
    position: 'relative' // Override absolute if in grid, but here we use grid layout
  };

  return (
    <div 
      ref={blockRef}
      className={`dashboard-block ${isInteraction === 'dragging' ? 'dragging' : ''}`}
      style={style}
      onMouseDown={(e) => isInteraction === null && handleMouseDown(e, 'dragging')}
    >
      {/* Mock Content (Vis/Tree) */}
      <div className="vis-tree-mock">
        <div className="vis-header">
          <span className="vis-title">{block.title}</span>
        </div>
        <div className="vis-content">
          {block.type === 'allocation' && <div className="mock-pie"></div>}
          {block.type === 'value' && <div className="mock-value">฿2,450,000</div>}
          {block.type === 'activity' && <div className="mock-lines"></div>}
          {block.type === 'empty' && <div className="mock-empty">VOID</div>}
        </div>
      </div>

      {/* Edit Actions */}
      {editMode && (
        <>
          <div className="block-actions">
            <button className="action-btn" title="Settings">⚙️</button>
            <button 
              className="action-btn delete" 
              title="Delete"
              onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
            >
              🗑️
            </button>
          </div>
          <div 
            className="resize-handle"
            onMouseDown={(e) => handleMouseDown(e, 'resizing')}
          ></div>
        </>
      )}
    </div>
  );
};

export default DashboardBlock;
