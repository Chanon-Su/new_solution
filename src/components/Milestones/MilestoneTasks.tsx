import React, { useState } from 'react';
import type { Milestone, SubChecklistItem } from '../../types';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

interface MilestoneTasksProps {
  milestone: Milestone;
  onToggleItem: (itemId: string) => void;
  onAddItem: (label: string) => void;
  onReorderItem: (milestoneId: string, itemId: string, direction: 'up' | 'down') => void;
}

const MilestoneTasks: React.FC<MilestoneTasksProps> = ({
  milestone,
  onToggleItem,
  onAddItem,
  onReorderItem
}) => {
  const [newItemLabel, setNewItemLabel] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemLabel.trim()) {
      onAddItem(newItemLabel);
      setNewItemLabel('');
    }
  };

  return (
    <div className="sub-checklist-container">
      {/* Left Column: Active Tasks */}
      <div className="sub-checklist-column">
        <div className="column-panel active-panel">
          <h4 className="column-header">Active Tasks</h4>
          <div className="sub-checklist-list">
            {milestone.subChecklist
              .filter(item => !item.isCompleted)
              .map((item: SubChecklistItem, index: number, filteredArray: SubChecklistItem[]) => (
                <div key={item.id} className="sub-checklist-item active-task">
                  <div className="custom-checkbox" onClick={() => onToggleItem(item.id)}>
                    {/* Empty checkbox for active tasks */}
                  </div>
                  <span className="text-sm text-gray-200" onClick={() => onToggleItem(item.id)}>{item.label}</span>
                  
                  <div className="ml-auto flex flex-col reorder-controls">
                    <button 
                      className="reorder-btn" 
                      onClick={(e) => { e.stopPropagation(); onReorderItem(milestone.id, item.id, 'up'); }}
                      disabled={index === 0}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button 
                      className="reorder-btn" 
                      onClick={(e) => { e.stopPropagation(); onReorderItem(milestone.id, item.id, 'down'); }}
                      disabled={index === filteredArray.length - 1}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              ))}

            <form onSubmit={handleAdd} className="mt-2">
              <input 
                type="text" 
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                placeholder="+ เพิ่มเป้าหมายย่อย..."
                className="add-sub-item-btn text-left outline-none"
              />
            </form>
          </div>
        </div>
      </div>

      {/* Right Column: History */}
      <div className="sub-checklist-column">
        <div className="column-panel history-panel">
          <h4 className="column-header">Completed History</h4>
          <div className="sub-checklist-list">
            {milestone.subChecklist
              .filter(item => item.isCompleted)
              .sort((a, b) => {
                const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                return dateB - dateA; // Newest completion at top
              })
              .map((item: SubChecklistItem) => (
                <div key={item.id} className="sub-checklist-item completed" onClick={() => onToggleItem(item.id)}>
                  <div className="custom-checkbox checked">
                    <Check size={14} color="white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 line-through">{item.label}</span>
                    {item.completedAt && (
                      <span className="text-[9px] text-gray-600">
                        Completed: {new Date(item.completedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTasks;
