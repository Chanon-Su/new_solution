import React, { useState } from 'react';
import { useMilestones } from '../../hooks/useMilestones';
import MilestoneCard from './MilestoneCard';
import MilestoneDetailView from './MilestoneDetailView';
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react';
import './Milestones.css';

const MilestonesPage: React.FC = () => {
  const { milestones, addMilestone, updateMilestone, removeMilestone, toggleSubItem, updateSubChecklist, reorderSubItem, calculateProgress } = useMilestones();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);

  React.useEffect(() => {
    const handleReset = () => {
      setSelectedMilestoneId(null);
      setIsCreating(false);
    };
    window.addEventListener('planto_reset_milestones', handleReset);
    return () => window.removeEventListener('planto_reset_milestones', handleReset);
  }, []);

  const selectedMilestone = milestones.find(m => m.id === selectedMilestoneId);

  const handleAddBlank = () => {
    const newMilestone = addMilestone({
      title: 'Untitled Goal',
      description: 'Add a description to your goal...',
      icon: 'trending-up',
      category: 'money',
      targetValue: 1000,
      unit: 'Units',
      linkedAssetSymbol: 'CASH',
      tags: ['NEW']
    });
    setIsCreating(true);
    setSelectedMilestoneId(newMilestone.id);
  };

  const handleCloseDetail = () => {
    setSelectedMilestoneId(null);
    setIsCreating(false);
  };

  return (
    <div className="milestones-container">
      <div className="milestones-header">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-['Manrope']">Project Milestones</h1>
          <p className="text-gray-500 text-sm">Tracking the evolution of your financial goals.</p>
        </div>
        
        <div className="milestones-controls">
          <div className="flex bg-white/5 p-1 rounded-xl">
            <button 
              className={`layout-switch-btn ${layout === 'list' ? 'active' : ''}`}
              onClick={() => setLayout('list')}
            >
              <ListIcon size={18} />
            </button>
            <button 
              className={`layout-switch-btn ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => setLayout('grid')}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <div className="flex gap-4">
            <button className="add-milestone-btn" onClick={handleAddBlank}>
              <Plus size={18} />
              <span>New Milestone</span>
            </button>
          </div>
        </div>
      </div>

      <div className={layout === 'grid' ? 'milestones-grid' : 'milestones-list'}>
        {milestones.map(milestone => (
          <MilestoneCard 
            key={milestone.id} 
            milestone={milestone}
            currentValue={calculateProgress(milestone.linkedAssetSymbol, milestone.category)}
            onViewDetails={() => {
              setIsCreating(false);
              setSelectedMilestoneId(milestone.id);
            }}
          />
        ))}

        {milestones.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-white/10 rounded-3xl">
            <p className="text-gray-500">ยังไม่มีเป้าหมาย? เริ่มต้นด้วยการเพิ่มเป้าหมายแรกของคุณ</p>
          </div>
        )}
      </div>

      {selectedMilestone && (
        <MilestoneDetailView 
          milestone={selectedMilestone}
          currentValue={calculateProgress(selectedMilestone.linkedAssetSymbol, selectedMilestone.category)}
          onClose={handleCloseDetail}
          onToggleItem={(itemId) => toggleSubItem(selectedMilestoneId!, itemId)}
          onAddItem={(label) => updateSubChecklist(selectedMilestoneId!, label)}
          onReorderItem={reorderSubItem}
          onUpdateMilestone={updateMilestone}
          onDeleteMilestone={removeMilestone}
          initialEditMode={isCreating}
        />
      )}
    </div>
  );
};

export default MilestonesPage;
