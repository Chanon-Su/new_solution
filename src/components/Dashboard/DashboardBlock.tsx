import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { DashboardBlock as IBlock } from '../../types';

interface DashboardBlockProps {
  block: IBlock;
  columns: number;
  rows: number;
  editMode: boolean;
  onUpdate: (id: string, updates: Partial<IBlock>) => void;
  onDelete: (id: string) => void;
}

// ─────────────────────────────────────────────
// Resize handle definitions — 8 จุดรอบ Block
// dir: ทิศทาง, dx/dy: ทิศที่ขยาย W/H, mx/my: ทิศที่เลื่อน X/Y
// ─────────────────────────────────────────────
type ResizeDir = 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'sw' | 'se';

interface HandleDef {
  dir: ResizeDir;
  cursor: string;
  // สำหรับ position ของ handle บน block
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  translateX?: string;
  translateY?: string;
  // ลูกศร Unicode ที่แสดงใน handle
  arrow: string;
}

const HANDLE_DEFS: HandleDef[] = [
  // ขอบ 4 ด้าน
  { dir: 'n',  cursor: 'n-resize',  top: 0,    left: '50%',  translateX: '-50%', translateY: '-50%', arrow: '↑' },
  { dir: 's',  cursor: 's-resize',  bottom: 0, left: '50%',  translateX: '-50%', translateY: '50%',  arrow: '↓' },
  { dir: 'e',  cursor: 'e-resize',  top: '50%',right: 0,     translateX: '50%',  translateY: '-50%', arrow: '→' },
  { dir: 'w',  cursor: 'w-resize',  top: '50%',left: 0,      translateX: '-50%', translateY: '-50%', arrow: '←' },
  // มุม 4 จุด
  { dir: 'nw', cursor: 'nw-resize', top: 0,    left: 0,      translateX: '-50%', translateY: '-50%', arrow: '↖' },
  { dir: 'ne', cursor: 'ne-resize', top: 0,    right: 0,     translateX: '50%',  translateY: '-50%', arrow: '↗' },
  { dir: 'sw', cursor: 'sw-resize', bottom: 0, left: 0,      translateX: '-50%', translateY: '50%',  arrow: '↙' },
  { dir: 'se', cursor: 'se-resize', bottom: 0, right: 0,     translateX: '50%',  translateY: '50%',  arrow: '↘' },
];

// ─────────────────────────────────────────────
// getContainerRect — ดึง rect ของ blocks-layer (parent ของ block)
// blocks-layer ต้องเป็น position:absolute/relative ที่ครอบ world-content-area
// ─────────────────────────────────────────────
function getContainerRect(el: HTMLElement | null): DOMRect | null {
  // blockRef.current → .dashboard-block → .blocks-layer (parent)
  return el?.parentElement?.getBoundingClientRect() ?? null;
}

const DashboardBlock: React.FC<DashboardBlockProps> = ({
  block, columns, rows, editMode, onUpdate, onDelete,
}) => {
  // Phase 3 & 4: ระบบการวางตำแหน่งและ Interaction แบบใหม่จะถูกเขียนลงที่นี่
  // ชั่วคราว: ไม่แสดงผลอะไรเลยเพื่อให้หน้า Dashboard ว่างเปล่าตามความต้องการ
  return null;
};

export default DashboardBlock;
