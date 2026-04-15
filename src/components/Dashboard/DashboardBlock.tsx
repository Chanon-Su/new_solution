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
  // ─── State ───────────────────────────────────
  const [interactionType, setInteractionType] = useState<'dragging' | 'resizing' | null>(null);
  const [resizeDir, setResizeDir] = useState<ResizeDir | null>(null);

  const blockRef = useRef<HTMLDivElement>(null);

  // เก็บค่า start ณ ตอนที่ mousedown
  const startRef = useRef({
    mouseX: 0,   // clientX ตอน mousedown
    mouseY: 0,   // clientY ตอน mousedown
    blockX: 0,   // block.x ตอน mousedown (1-indexed grid col)
    blockY: 0,   // block.y ตอน mousedown (1-indexed grid row)
    blockW: 0,
    blockH: 0,
  });

  // ─── MouseDown: Drag ─────────────────────────
  const handleDragMouseDown = useCallback((e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    e.preventDefault();
    setInteractionType('dragging');
    setResizeDir(null);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h,
    };
  }, [editMode, block]);

  // ─── MouseDown: Resize ───────────────────────
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, dir: ResizeDir) => {
    if (!editMode) return;
    e.stopPropagation();
    e.preventDefault();
    setInteractionType('resizing');
    setResizeDir(dir);
    startRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      blockX: block.x,
      blockY: block.y,
      blockW: block.w,
      blockH: block.h,
    };
  }, [editMode, block]);

  // ─── MouseMove / MouseUp ─────────────────────
  useEffect(() => {
    if (!interactionType) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = getContainerRect(blockRef.current);
      if (!rect) return;

      const cellW = rect.width / columns;
      const cellH = rect.height / rows;

      // Delta ในหน่วย pixel จาก mousedown
      const dxPx = e.clientX - startRef.current.mouseX;
      const dyPx = e.clientY - startRef.current.mouseY;

      // Delta ในหน่วย cell (snap ด้วย Math.round)
      const dxCell = Math.round(dxPx / cellW);
      const dyCell = Math.round(dyPx / cellH);

      if (interactionType === 'dragging') {
        // ✅ SNAP FIX: คำนวณจาก startPos + delta ที่ snap แล้ว
        // ทำให้มุม Block ไปตรงกับ vertex + ไม่ขึ้นกับจุดที่จับ
        const rawX = startRef.current.blockX + dxCell;
        const rawY = startRef.current.blockY + dyCell;

        const newX = Math.max(1, Math.min(rawX, columns - block.w + 1));
        const newY = Math.max(1, Math.min(rawY, rows - block.h + 1));

        if (newX !== block.x || newY !== block.y) {
          onUpdate(block.id, { x: newX, y: newY });
        }
      } else if (interactionType === 'resizing' && resizeDir) {
        // ─── Resize ตามทิศทาง ────────────────────
        const s = startRef.current;

        let newX = s.blockX;
        let newY = s.blockY;
        let newW = s.blockW;
        let newH = s.blockH;

        // แกน X
        if (resizeDir.includes('e')) {
          // ขยายทางขวา → เปลี่ยน W
          newW = Math.max(1, Math.min(s.blockW + dxCell, columns - s.blockX + 1));
        }
        if (resizeDir.includes('w')) {
          // ขยายทางซ้าย → เปลี่ยน X และ W พร้อมกัน
          const proposedX = Math.max(1, Math.min(s.blockX + dxCell, s.blockX + s.blockW - 1));
          newW = s.blockW - (proposedX - s.blockX);
          newX = proposedX;
        }

        // แกน Y
        if (resizeDir.includes('s')) {
          // ขยายลง → เปลี่ยน H
          newH = Math.max(1, Math.min(s.blockH + dyCell, rows - s.blockY + 1));
        }
        if (resizeDir.includes('n')) {
          // ขยายขึ้น → เปลี่ยน Y และ H พร้อมกัน
          const proposedY = Math.max(1, Math.min(s.blockY + dyCell, s.blockY + s.blockH - 1));
          newH = s.blockH - (proposedY - s.blockY);
          newY = proposedY;
        }

        if (newX !== block.x || newY !== block.y || newW !== block.w || newH !== block.h) {
          onUpdate(block.id, { x: newX, y: newY, w: newW, h: newH });
        }
      }
    };

    const handleMouseUp = () => {
      setInteractionType(null);
      setResizeDir(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interactionType, resizeDir, block, columns, rows, onUpdate]);

  // ─── Style: Absolute % positioning ──────────
  // block.x, block.y คือ vertex index นับจาก 1
  // vertex col=1 → left=0%, col=2 → left=(1/columns)*100% เป็นต้น
  // → left   = ((block.x - 1) / columns) * 100%
  // → top    = ((block.y - 1) / rows)    * 100%
  // → width  =  (block.w / columns)      * 100%
  // → height =  (block.h / rows)         * 100%
  const pctL = ((block.x - 1) / columns) * 100;
  const pctT = ((block.y - 1) / rows)    * 100;
  const pctW = (block.w / columns)       * 100;
  const pctH = (block.h / rows)         * 100;

  const style: React.CSSProperties = {
    position: 'absolute',
    left:   `${pctL}%`,
    top:    `${pctT}%`,
    width:  `${pctW}%`,
    height: `${pctH}%`,
    cursor: interactionType === 'dragging' ? 'grabbing' : 'grab',
    userSelect: 'none',
    boxSizing: 'border-box',
  };

  // ─── Render ──────────────────────────────────
  return (
    <div
      ref={blockRef}
      className={`dashboard-block ${interactionType === 'dragging' ? 'dragging' : ''}`}
      style={style}
      onMouseDown={handleDragMouseDown}
    >
      {/* ── Block Content ── */}
      <div className="vis-tree-mock">
        <div className="vis-header">
          <span className="vis-title">{block.title}</span>
        </div>
        <div className="vis-content">
          {block.type === 'allocation' && <div className="mock-pie" />}
          {block.type === 'value'      && <div className="mock-value">฿2,450,000</div>}
          {block.type === 'activity'   && <div className="mock-lines" />}
          {block.type === 'empty'      && <div className="mock-empty">VOID</div>}
        </div>
      </div>

      {/* ── Edit Mode UI ── */}
      {editMode && (
        <>
          {/* ⚙️ 🗑️ Actions */}
          <div className="block-actions">
            <button className="action-btn" title="Settings" onMouseDown={e => e.stopPropagation()}>⚙️</button>
            <button
              className="action-btn delete"
              title="Delete"
              onMouseDown={e => e.stopPropagation()}
              onClick={e => { e.stopPropagation(); onDelete(block.id); }}
            >
              🗑️
            </button>
          </div>

          {/* 🟢 Corner triangle indicator (มุมขวาล่าง) — เหมือนเดิม */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              background: 'linear-gradient(135deg, transparent 50%, var(--neon-emerald, #10b981) 50%)',
              borderBottomRightRadius: 12,
              pointerEvents: 'none',
              zIndex: 55,
            }}
          />

          {/* 🟢 8 Resize Handles — ลูกศรสีเขียวรอบ Block */}
          {HANDLE_DEFS.map(h => {
            const transforms: string[] = [];
            if (h.translateX) transforms.push(`translateX(${h.translateX})`);
            if (h.translateY) transforms.push(`translateY(${h.translateY})`);

            const posStyle: React.CSSProperties = {
              position: 'absolute',
              cursor: h.cursor,
              ...(h.top    !== undefined ? { top:    h.top    } : {}),
              ...(h.bottom !== undefined ? { bottom: h.bottom } : {}),
              ...(h.left   !== undefined ? { left:   h.left   } : {}),
              ...(h.right  !== undefined ? { right:  h.right  } : {}),
              ...(transforms.length > 0  ? { transform: transforms.join(' ') } : {}),
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 900,
              color: 'var(--neon-emerald, #10b981)',
              lineHeight: 1,
              zIndex: 60,
              padding: 4,
              boxSizing: 'content-box' as const,
              pointerEvents: 'all',
              background: 'transparent',
              border: 'none',
              userSelect: 'none',
            };

            return (
              <div
                key={h.dir}
                style={posStyle}
                onMouseDown={e => handleResizeMouseDown(e, h.dir)}
              >
                {h.arrow}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default DashboardBlock;
