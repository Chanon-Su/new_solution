import React from 'react';
import './Dashboard.css';
import DashboardGrid from './Dashboard/DashboardGrid';
import DashboardBlock from './Dashboard/DashboardBlock';
import DashboardControls from './Dashboard/DashboardControls';
import GridConfigurator from './Dashboard/GridConfigurator';
import NavigationArrows from './Dashboard/NavigationArrows';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const {
    columns,
    setColumns,
    rows,
    setRows,
    activePage,
    editMode,
    layoutMode,
    blocks,
    totalPages,
    updateBlock,
    deleteBlock,
    addBlock,
    toggleEdit,
    toggleLayout,
    nextPage,
    prevPage,
  } = useDashboard();

  return (
    <div className={`dashboard-page ${editMode ? 'edit-mode' : ''} ${layoutMode ? 'layout-mode' : ''}`}>
      <NavigationArrows 
        activePage={activePage}
        totalPages={totalPages}
        onPrev={prevPage}
        onNext={nextPage}
      />

      <div className="drift-viewport" style={{ transform: `translateX(-${(activePage * 100) / totalPages}%)` }} >
        {Array.from({ length: totalPages }).map((_, pageIdx) => (
          <div key={pageIdx} className="drift-screen">
            <div className="dashboard-world-space">
              <div className="world-content-area">
                <DashboardGrid
                  columns={columns}
                  rows={rows}
                  editMode={editMode}
                  layoutMode={layoutMode}
                  onConfigChange={(c, r) => { setColumns(c); setRows(r); }}
                />

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
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {layoutMode && (
        <GridConfigurator 
          columns={columns}
          setColumns={setColumns}
          rows={rows}
          setRows={setRows}
        />
      )}

      <DashboardControls
        editMode={editMode}
        layoutMode={layoutMode}
        onToggleEdit={toggleEdit}
        onToggleLayout={toggleLayout}
        onAddBlock={addBlock}
      />
    </div>
  );
};

export default Dashboard;
