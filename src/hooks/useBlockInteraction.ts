import { useState, useRef, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../types';

interface UseBlockInteractionProps {
  block: IBlock;
  columns: number;
  rows: number;
  editMode: boolean;
  onUpdate: (id: string, updates: Partial<IBlock>) => void;
  isAreaAvailable: (page: number, x: number, y: number, w: number, h: number, excludeId?: string) => boolean;
  blockRef: React.RefObject<HTMLDivElement | null>;
}

export const useBlockInteraction = ({
  block,
  columns,
  rows,
  editMode,
  onUpdate,
  isAreaAvailable,
  blockRef,
}: UseBlockInteractionProps) => {
  const [isDragging, setIsDragging]   = useState(false);
  const [isResizing, setIsResizing]   = useState(false);

  // dragStart ref เก็บ position ณ วินาทีที่กด mouse down
  const dragStart = useRef({ mouseX: 0, mouseY: 0, blockX: 0, blockY: 0, blockW: 0, blockH: 0 });

  // ─── Cell metric cache ────────────────────────────────────────────────────
  // คำนวณ cellWidth/Height เพียงครั้งเดียวตอน mousedown ไม่ใช่ทุก mousemove
  // หลีกเลี่ยง getBoundingClientRect() + layout reflow ที่ 60fps
  const cellMetrics = useRef({ cellWidth: 0, cellHeight: 0 });

  const cacheCellMetrics = useCallback(() => {
    const rect = blockRef.current?.parentElement?.getBoundingClientRect();
    if (!rect) return false;
    cellMetrics.current = {
      cellWidth:  rect.width  / columns,
      cellHeight: rect.height / rows,
    };
    return true;
  }, [blockRef, columns, rows]);

  // ─── Mouse Move ───────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { cellWidth, cellHeight } = cellMetrics.current;
    if (!cellWidth || !cellHeight) return;

    if (isDragging) {
      const deltaX = (e.clientX - dragStart.current.mouseX) / cellWidth;
      const deltaY = (e.clientY - dragStart.current.mouseY) / cellHeight;
      const nextX = Math.round(dragStart.current.blockX + deltaX);
      const nextY = Math.round(dragStart.current.blockY + deltaY);

      if (
        (nextX !== block.x || nextY !== block.y) &&
        isAreaAvailable(block.page, nextX, nextY, block.w, block.h, block.id)
      ) {
        onUpdate(block.id, { x: nextX, y: nextY });
      }
    }

    if (isResizing) {
      const deltaW = (e.clientX - dragStart.current.mouseX) / cellWidth;
      const deltaH = (e.clientY - dragStart.current.mouseY) / cellHeight;
      const nextW = Math.max(1, Math.round(dragStart.current.blockW + deltaW));
      const nextH = Math.max(1, Math.round(dragStart.current.blockH + deltaH));

      if (
        (nextW !== block.w || nextH !== block.h) &&
        isAreaAvailable(block.page, block.x, block.y, nextW, nextH, block.id)
      ) {
        onUpdate(block.id, { w: nextW, h: nextH });
      }
    }
  }, [isDragging, isResizing, block, isAreaAvailable, onUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    document.body.classList.remove('no-select');
  }, []);

  // ─── Event Listeners (attach เฉพาะช่วงที่ drag/resize) ───────────────────
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

  // ─── Drag / Resize Start ──────────────────────────────────────────────────
  const onDragStart = (e: React.MouseEvent) => {
    if (!editMode || isResizing) return;
    // cache cell metrics ตอน mousedown ครั้งเดียว
    if (!cacheCellMetrics()) return;

    setIsDragging(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h,
    };
    document.body.classList.add('no-select');
  };

  const onResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // cache cell metrics ตอน mousedown ครั้งเดียว
    if (!cacheCellMetrics()) return;

    setIsResizing(true);
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h,
    };
    document.body.classList.add('no-select');
  };

  return { isDragging, isResizing, onDragStart, onResizeStart };
};
