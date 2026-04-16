import React from 'react';
import type { DashboardBlock as IBlock } from '../../types';
import DashboardBlock from './DashboardBlock';

interface BlocksLayerProps {
  blocks: IBlock[];
  pageIdx: number;
  columns: number;
  rows: number;
  editMode: boolean;
  onUpdate: (id: string, updates: Partial<IBlock>) => void;
  onDelete: (id: string) => void;
  isAreaAvailable: (page: number, x: number, y: number, w: number, h: number, excludeId?: string) => boolean;
}

const BlocksLayer: React.FC<BlocksLayerProps> = ({
  blocks,
  pageIdx,
  columns,
  rows,
  editMode,
  onUpdate,
  onDelete,
  isAreaAvailable
}) => {
  return (
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
            onUpdate={onUpdate}
            onDelete={onDelete}
            isAreaAvailable={isAreaAvailable}
          />
        ))}
    </div>
  );
};

export default BlocksLayer;
