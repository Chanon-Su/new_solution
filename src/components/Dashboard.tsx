import React from 'react';
import './Dashboard.css';
import DashboardGrid from './Dashboard/DashboardGrid';
import BlocksLayer from './Dashboard/BlocksLayer';
import DashboardControls from './Dashboard/DashboardControls';
import GridConfigurator from './Dashboard/GridConfigurator';
import NavigationArrows from './Dashboard/NavigationArrows';
import CoordinatesLayer from './Dashboard/CoordinatesLayer';
import { useDashboard } from '../hooks/useDashboard';

const Dashboard: React.FC = () => {
  const {
    columns, setColumns,
    rows, setRows,
    activePage, editMode, layoutMode,
    blocks, totalPages,
    updateBlock, deleteBlock, addBlock,
    toggleEdit, toggleLayout,
    nextPage, prevPage,
    isAreaAvailable,
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

                <BlocksLayer 
                  blocks={blocks}
                  pageIdx={pageIdx}
                  columns={columns}
                  rows={rows}
                  editMode={editMode}
                  onUpdate={updateBlock}
                  onDelete={deleteBlock}
                  isAreaAvailable={isAreaAvailable}
                />
              </div>
              <CoordinatesLayer columns={columns} rows={rows} />
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
          blocks={blocks}
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
