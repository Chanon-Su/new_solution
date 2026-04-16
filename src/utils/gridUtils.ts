import type { DashboardBlock } from '../types';

/**
 * ตรวจสอบว่าพื้นที่ใน Grid ว่างหรือไม่
 */
export const isAreaAvailable = (
  blocks: DashboardBlock[],
  page: number,
  x: number,
  y: number,
  w: number,
  h: number,
  columns: number,
  rows: number,
  excludeId?: string
): boolean => {
  // 1. ตรวจสอบขอบเขต (Boundary Check)
  if (x < 0 || y < 0 || x + w > columns || y + h > rows) return false;

  // 2. ตรวจสอบการทับซ้อน (Collision Check)
  return !blocks.some(b => {
    if (b.page !== page || b.id === excludeId) return false;
    return (
      x < b.x + b.w &&
      x + w > b.x &&
      y < b.y + b.h &&
      y + h > b.y
    );
  });
};

/**
 * ค้นหาพื้นที่ว่างแรกที่เหมาะสมสำหรับวางบล็อกใหม่
 */
export const findFirstAvailableSpace = (
  blocks: DashboardBlock[],
  page: number,
  columns: number,
  rows: number,
  w: number,
  h: number
): { x: number, y: number } | null => {
  for (let r = 0; r <= rows - h; r++) {
    for (let c = 0; c <= columns - w; c++) {
      if (isAreaAvailable(blocks, page, c, r, w, h, columns, rows)) {
        return { x: c, y: r };
      }
    }
  }
  return null;
};
