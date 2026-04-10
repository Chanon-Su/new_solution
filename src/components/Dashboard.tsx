import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import DashboardGrid from './Dashboard/DashboardGrid';
import DashboardBlock from './Dashboard/DashboardBlock';
import DashboardControls from './Dashboard/DashboardControls';
import type { DashboardBlock as IBlock, VisType } from '../types';

const Dashboard: React.FC = () => {
  // Config & State
  const [columns, setColumns] = useState(20);
  const [rows, setRows] = useState(16);
  const [activePage, setActivePage] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [layoutMode, setLayoutMode] = useState(false);
  const [blocks, setBlocks] = useState<IBlock[]>([
    { id: '1', x: 2, y: 2, w: 8, h: 6, type: 'allocation', title: 'Asset Allocation', page: 0 },
    { id: '2', x: 11, y: 2, w: 8, h: 4, type: 'value', title: 'Total Portfolio Value', page: 0 },
    { id: '3', x: 11, y: 7, w: 8, h: 8, type: 'activity', title: 'Recent Activity', page: 0 }
  ]);

  const totalPages = 3;

  // Handle Updates
  const handleUpdateBlock = (id: string, updates: Partial<IBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const handleAddBlock = () => {
    // Search for first available 1x1 slot on current page
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
        w: 1,
        h: 1,
        type: 'empty',
        title: 'New Block',
        page: activePage
      };
      setBlocks([...blocks, newBlock]);
    } else {
        // Current page full, drift to next if possible
        if (activePage < totalPages - 1) {
            setActivePage(activePage + 1);
            // We'll add it in the next render cycle or just wait for user to click again in new page
            // For now, let's just toast/alert
            console.log("Page full, drifted to next");
        }
    }
  };

  // Drift Controls
  const goNext = () => setActivePage(prev => Math.min(prev + 1, totalPages - 1));
  const goPrev = () => setActivePage(prev => Math.max(prev - 1, 0));

  return (
    <div className={`dashboard-page ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}>
      {/* Ghost Navigation Arrows */}
      <div className={`ghost-nav left ${activePage === 0 ? 'disabled' : ''}`} onClick={goPrev}>
        <div className="arrow">‹</div>
      </div>
      <div className={`ghost-nav right ${activePage === totalPages - 1 ? 'disabled' : ''}`} onClick={goNext}>
        <div className="arrow">›</div>
      </div>

      <div 
        className="drift-viewport"
        style={{ transform: `translateX(-${activePage * 100}vw)` }}
      >
        {Array.from({ length: totalPages }).map((_, pageIdx) => (
          <div key={pageIdx} className="drift-screen">
            <div className="dashboard-grid-layout" style={{ height: '100%', position: 'relative' }}>
              
              {/* Grid Background */}
              <DashboardGrid 
                columns={columns}
                rows={rows}
                editMode={editMode}
                layoutMode={layoutMode}
                onConfigChange={(c, r) => { setColumns(c); setRows(r); }}
              />

              {/* Blocks */}
              <div 
                className="blocks-layer" 
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  gap: '12px',
                  width: 'calc(100% - 80px)',
                  height: 'calc(100% - 80px)',
                  position: 'absolute',
                  top: '40px',
                  left: '40px',
                  zIndex: 20
                }}
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
        ))}
      </div>

      {/* Floating UI Controls */}
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
