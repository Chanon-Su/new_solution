import { useState, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../types';
import { isAreaAvailable, findFirstAvailableSpace } from '../utils/gridUtils';

const STORAGE_KEY = 'planto-zen-dashboard-v3';
const TOTAL_PAGES = 3;

const DEFAULT_BLOCKS: IBlock[] = [
  { id: 'test-block-1', x: 0, y: 0, w: 2, h: 2, type: 'empty', title: 'Block 1', page: 0 },
  { id: 'test-block-2', x: 3, y: 1, w: 2, h: 2, type: 'empty', title: 'Block 2', page: 0 },
];

// อ่าน localStorage ครั้งเดียว parse ครั้งเดียว
function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { columns: number; rows: number; blocks: IBlock[] };
  } catch {
    return null;
  }
}

export const useDashboard = () => {
  // อ่าน + parse localStorage ครั้งเดียวใน initializer
  const [columns, setColumns] = useState<number>(() => loadSavedState()?.columns ?? 6);
  const [rows, setRows]       = useState<number>(() => loadSavedState()?.rows ?? 4);
  const [blocks, setBlocks]   = useState<IBlock[]>(() => loadSavedState()?.blocks ?? DEFAULT_BLOCKS);

  const [activePage, setActivePage] = useState(0);
  const [editMode, setEditMode]     = useState(false);
  const [layoutMode, setLayoutMode] = useState(false);

  // Persist เมื่อ state เปลี่ยน
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, rows, blocks }));
  }, [columns, rows, blocks]);

  // ─── Stable callbacks (useCallback — ทำให้ DashboardBlock ไม่ re-render โดยไม่จำเป็น) ───

  const checkArea = useCallback(
    (page: number, x: number, y: number, w: number, h: number, excludeId?: string) =>
      isAreaAvailable(blocks, page, x, y, w, h, columns, rows, excludeId),
    [blocks, columns, rows]
  );

  const updateBlock = useCallback((id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => {
      const block = prev.find(b => b.id === id);
      if (!block) return prev;

      const nextX = updates.x !== undefined ? updates.x : block.x;
      const nextY = updates.y !== undefined ? updates.y : block.y;
      const nextW = updates.w !== undefined ? updates.w : block.w;
      const nextH = updates.h !== undefined ? updates.h : block.h;

      if (
        (updates.x !== undefined || updates.y !== undefined ||
         updates.w !== undefined || updates.h !== undefined) &&
        !isAreaAvailable(prev, block.page, nextX, nextY, nextW, nextH, columns, rows, id)
      ) {
        return prev;
      }

      return prev.map(b => (b.id === id ? { ...b, ...updates } : b));
    });
  }, [columns, rows]);

  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const addBlock = useCallback(() => {
    setBlocks(prev => {
      const space = findFirstAvailableSpace(prev, activePage, columns, rows, 1, 1);
      if (!space) return prev;
      const newBlock: IBlock = {
        id: Math.random().toString(36).substr(2, 9),
        x: space.x,
        y: space.y,
        w: 1,
        h: 1,
        type: 'empty',
        title: 'New Block',
        page: activePage,
      };
      return [...prev, newBlock];
    });
  }, [activePage, columns, rows]);

  const toggleEdit = useCallback(() => setEditMode(prev => {
    const next = !prev;
    if (!next) setLayoutMode(false);
    return next;
  }), []);

  const toggleLayout = useCallback(() => setLayoutMode(prev => !prev), []);
  const nextPage = useCallback(() => setActivePage(prev => Math.min(prev + 1, TOTAL_PAGES - 1)), []);
  const prevPage = useCallback(() => setActivePage(prev => Math.max(prev - 1, 0)), []);

  return {
    columns, setColumns,
    rows, setRows,
    activePage, setActivePage,
    editMode, layoutMode,
    blocks, totalPages: TOTAL_PAGES,
    updateBlock, deleteBlock, addBlock,
    toggleEdit, toggleLayout,
    nextPage, prevPage,
    isAreaAvailable: checkArea,
  };
};
