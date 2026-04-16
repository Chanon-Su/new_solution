import { useState, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../types';

const STORAGE_KEY = 'alpha-zen-dashboard-v3';
const TOTAL_PAGES = 3;

export const useDashboard = () => {
  const [columns, setColumns] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).columns : 6;
  });

  const [rows, setRows] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).rows : 4;
  });

  const [activePage, setActivePage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState(false);

  const [blocks, setBlocks] = useState<IBlock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).blocks;
    
    // สร้างบล็อกเริ่มต้น 2 บล็อกเพื่อทดสอบ (Empty Blocks)
    return [
      {
        id: 'test-block-1',
        x: 0,
        y: 0,
        w: 2,
        h: 2,
        type: 'empty',
        title: 'Block 1',
        page: 0
      },
      {
        id: 'test-block-2',
        x: 3,
        y: 1,
        w: 2,
        h: 2,
        type: 'empty',
        title: 'Block 2',
        page: 0
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, rows, blocks }));
  }, [columns, rows, blocks]);

  // ฟังก์ชันตรวจสอบการชน (Collision Detection)
  const isAreaAvailable = useCallback((page: number, x: number, y: number, w: number, h: number, excludeId?: string) => {
    // ตรวจสอบว่าอยู่นอกขอบ Grid หรือไม่
    if (x < 0 || y < 0 || x + w > columns || y + h > rows) return false;

    // ตรวจสอบว่าทับซ้อนกับบล็อกอื่นในหน้าเดียวกันหรือไม่
    return !blocks.some(b => {
      if (b.page !== page || b.id === excludeId) return false;
      return (
        x < b.x + b.w &&
        x + w > b.x &&
        y < b.y + b.h &&
        y + h > b.y
      );
    });
  }, [blocks, columns, rows]);

  const updateBlock = (id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === id);
      if (!block) return prev;

      const nextX = updates.x !== undefined ? updates.x : block.x;
      const nextY = updates.y !== undefined ? updates.y : block.y;
      const nextW = updates.w !== undefined ? updates.w : block.w;
      const nextH = updates.h !== undefined ? updates.h : block.h;

      // ตรวจสอบพื้นที่ว่างก่อนอัปเดต (ถ้ามีการเปลี่ยนพิกัดหรือขนาด)
      if (
        updates.x !== undefined || 
        updates.y !== undefined || 
        updates.w !== undefined || 
        updates.h !== undefined
      ) {
        if (!isAreaAvailable(block.page, nextX, nextY, nextW, nextH, id)) {
          return prev; // ไม่ทำอะไรหากทับซ้อน
        }
      }

      return prev.map(b => b.id === id ? { ...b, ...updates } : b);
    });
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addBlock = () => {
    let foundX = -1;
    let foundY = -1;

    for (let r = 0; r <= rows - 2; r++) {
      for (let c = 0; c <= columns - 2; c++) {
        if (isAreaAvailable(activePage, c, r, 2, 2)) {
          foundX = c;
          foundY = r;
          break;
        }
      }
      if (foundX !== -1) break;
    }

    if (foundX !== -1) {
      const newBlock: IBlock = {
        id: Math.random().toString(36).substr(2, 9),
        x: foundX,
        y: foundY,
        w: 2,
        h: 2,
        type: 'empty',
        title: 'New Block',
        page: activePage
      };
      setBlocks([...blocks, newBlock]);
    }
  };

  const toggleEdit = () => setEditMode(prev => !prev);
  const toggleLayout = () => setLayoutMode(prev => !prev);
  const nextPage = () => setActivePage(prev => Math.min(prev + 1, TOTAL_PAGES - 1));
  const prevPage = () => setActivePage(prev => Math.max(prev - 1, 0));

  return {
    columns, setColumns,
    rows, setRows,
    activePage, setActivePage,
    editMode, layoutMode,
    blocks, totalPages: TOTAL_PAGES,
    updateBlock, deleteBlock, addBlock,
    toggleEdit, toggleLayout,
    nextPage, prevPage,
    isAreaAvailable
  };
};
