import { useState, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../types';
import { isAreaAvailable, findFirstAvailableSpace } from '../utils/gridUtils';

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
    
    return [
      { id: 'test-block-1', x: 0, y: 0, w: 2, h: 2, type: 'empty', title: 'Block 1', page: 0 },
      { id: 'test-block-2', x: 3, y: 1, w: 2, h: 2, type: 'empty', title: 'Block 2', page: 0 }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, rows, blocks }));
  }, [columns, rows, blocks]);

  const checkArea = useCallback((page: number, x: number, y: number, w: number, h: number, excludeId?: string) => {
    return isAreaAvailable(blocks, page, x, y, w, h, columns, rows, excludeId);
  }, [blocks, columns, rows]);

  const updateBlock = (id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === id);
      if (!block) return prev;

      const nextX = updates.x !== undefined ? updates.x : block.x;
      const nextY = updates.y !== undefined ? updates.y : block.y;
      const nextW = updates.w !== undefined ? updates.w : block.w;
      const nextH = updates.h !== undefined ? updates.h : block.h;

      if (updates.x !== undefined || updates.y !== undefined || updates.w !== undefined || updates.h !== undefined) {
        if (!isAreaAvailable(prev, block.page, nextX, nextY, nextW, nextH, columns, rows, id)) {
          return prev;
        }
      }

      return prev.map(b => b.id === id ? { ...b, ...updates } : b);
    });
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addBlock = () => {
    const space = findFirstAvailableSpace(blocks, activePage, columns, rows, 1, 1);

    if (space) {
      const newBlock: IBlock = {
        id: Math.random().toString(36).substr(2, 9),
        x: space.x,
        y: space.y,
        w: 1,
        h: 1,
        type: 'empty',
        title: 'New Block',
        page: activePage
      };
      setBlocks([...blocks, newBlock]);
    }
  };

  const toggleEdit = () => setEditMode(prev => {
    const next = !prev;
    // ถ้าปิด Edit Mode ให้ปิด Layout Mode ด้วยเสมอ
    if (!next) setLayoutMode(false);
    return next;
  });
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
    isAreaAvailable: checkArea
  };
};
