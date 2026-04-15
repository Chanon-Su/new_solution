import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import DashboardGrid from './Dashboard/DashboardGrid';
import DashboardBlock from './Dashboard/DashboardBlock';
import DashboardControls from './Dashboard/DashboardControls';
import type { DashboardBlock as IBlock, VisType } from '../types';
const STORAGE_KEY = 'obsidian-zen-dashboard-config';

const Dashboard: React.FC = () => {
  const [columns, setColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).columns : 20;
  });
  const [rows, setRows] = useState(() => {
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

  const totalPages = 3;

  const handleUpdateBlock = (id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddBlock = () => {
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
    } else if (activePage < totalPages - 1) {
      setActivePage(activePage + 1);
    }
  };

  const goNext = () => setActivePage(prev => Math.min(prev + 1, totalPages - 1));
  const goPrev = () => setActivePage(prev => Math.max(prev - 1, 0));

  return (
    <div className={`dashboard-page ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}>
      <div className={`ghost-nav left ${activePage === 0 ? 'disabled' : ''}`} onClick={goPrev}>
        <div className="arrow">‹</div>
      </div>
      <div className={`ghost-nav right ${activePage === totalPages - 1 ? 'disabled' : ''}`} onClick={goNext}>
        <div className="arrow">›</div>
      </div>

      <div className="drift-viewport" style={{ transform: `translateX(-${(activePage * 100) / totalPages}%)` }} >
        {Array.from({ length: totalPages }).map((_, pageIdx) => (
          <div key={pageIdx} className="drift-screen">
              {/* Unified World Space - พื้นที่พิกัดกลางที่คุมทั้งเลเยอร์ตารางและเลเยอร์บล็อก */}
              <div className="dashboard-world-space">
                <div className="world-content-area">
                  <DashboardGrid
                    columns={columns}
                    rows={rows}
                    editMode={editMode}
                    layoutMode={layoutMode}
                    onConfigChange={(c, r) => { setColumns(c); setRows(r); }}
                  />

                  {/* Blocks Layer — plain absolute container, blocks position themselves via % */}
                  <div
                    className="blocks-layer"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 20,
                      pointerEvents: 'none',
                    } as React.CSSProperties}
                  >
                    {blocks
                      .filter(b => b.page === pageIdx)
                      .map(block => (
                        <DashboardBlock
                          key={block.id}
                          block={block}
                          columns={columns}
                          rows={rows}
                          editMode={editMode}
                          onUpdate={handleUpdateBlock}
                          onDelete={handleDeleteBlock}
                        />
                      ))}
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>

      {/* Grid Configuration Pill */}
      {layoutMode && (
        <div className="grid-configurator">
          <div className="config-row">
            <span className="config-label">GRID | </span>
            <div className="num-control">
              <button className="step-btn" onClick={() => setColumns(Math.max(4, columns - 1))}>◀</button>
              <span className="value">{columns}</span>
              <button className="step-btn" onClick={() => setColumns(Math.min(30, columns + 1))}>▶</button>
            </div>
            <span className="config-divider">X</span>
            <div className="num-control">
              <button className="step-btn" onClick={() => setRows(Math.max(4, rows - 1))}>◀</button>
              <span className="value">{rows}</span>
              <button className="step-btn" onClick={() => setRows(Math.min(24, rows + 1))}>▶</button>
            </div>
          </div>
        </div>
      )}

      <DashboardControls
        editMode={editMode}
        layoutMode={layoutMode}
        onToggleEdit={() => { setEditMode(!editMode); if (editMode) setLayoutMode(false); }}
        onToggleLayout={() => setLayoutMode(!layoutMode)}
        onAddBlock={handleAddBlock}
      />
    </div>
  );
};

export default Dashboard;
