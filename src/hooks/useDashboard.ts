import { useState, useEffect } from 'react';
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
    return []; // ล้างข้อมูลเริ่มต้นให้เป็นช่องว่าง
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

    // ระบบ 0-indexed: เริ่มต้นหาจากคอลัมน์ 0 และแถว 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const isOccupied = blocks.some(b =>
          b.page === activePage &&
          c >= b.x && c < b.x + b.w &&
          r >= b.y && r < b.y + b.h
        );
        if (!isOccupied) {
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
        w: 4, // Default width 4 units
        h: 4, // Default height 4 units
        type: 'empty',
        title: 'New Block',
        page: activePage
      };
      setBlocks([...blocks, newBlock]);
    } else {
      // แจ้งเตือนหรือจัดการเมื่อ Grid เต็ม
      console.warn('Dashboard is full on this page.');
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
