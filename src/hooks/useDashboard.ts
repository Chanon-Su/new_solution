import { useState, useEffect } from 'react';
import type { DashboardBlock as IBlock } from '../types';

const STORAGE_KEY = 'obsidian-zen-dashboard-config';
const TOTAL_PAGES = 3;

export const useDashboard = () => {
  const [columns, setColumns] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).columns : 20;
  });

  const [rows, setRows] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).rows : 16;
  });

  const [activePage, setActivePage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState(false);

  const [blocks, setBlocks] = useState<IBlock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved).blocks;
    return [
      { id: '1', x: 2, y: 2, w: 8, h: 6, type: 'allocation', title: 'Asset Allocation', page: 0 },
      { id: '2', x: 11, y: 2, w: 8, h: 4, type: 'value', title: 'Total Portfolio Value', page: 0 },
      { id: '3', x: 11, y: 7, w: 8, h: 8, type: 'activity', title: 'Recent Activity', page: 0 }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, rows, blocks }));
  }, [columns, rows, blocks]);

  const updateBlock = (id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const addBlock = () => {
    let foundX = -1;
    let foundY = -1;

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        const isOccupied = blocks.some(b =>
          b.page === activePage &&
          c >= b.x && c < b.x + b.w &&
          r >= b.y && r < b.y + b.h
        );
        if (!isOccupied) {
          foundX = c; foundY = r; break;
        }
      }
      if (foundX !== -1) break;
    }

    if (foundX !== -1) {
      const newBlock: IBlock = {
        id: Math.random().toString(36).substr(2, 9),
        x: foundX, y: foundY, w: 1, h: 1,
        type: 'empty', title: 'New Block', page: activePage
      };
      setBlocks([...blocks, newBlock]);
    } else if (activePage < TOTAL_PAGES - 1) {
      setActivePage(activePage + 1);
    }
  };

  const toggleEdit = () => {
    setEditMode(prev => {
      const next = !prev;
      if (!next) setLayoutMode(false);
      return next;
    });
  };

  const toggleLayout = () => setLayoutMode(prev => !prev);
  const nextPage = () => setActivePage(prev => Math.min(prev + 1, TOTAL_PAGES - 1));
  const prevPage = () => setActivePage(prev => Math.max(prev - 1, 0));

  return {
    columns,
    setColumns,
    rows,
    setRows,
    activePage,
    setActivePage,
    editMode,
    layoutMode,
    blocks,
    totalPages: TOTAL_PAGES,
    updateBlock,
    deleteBlock,
    addBlock,
    toggleEdit,
    toggleLayout,
    nextPage,
    prevPage,
  };
};
