import React, { useState } from 'react';
import { useMilestones } from '../../hooks/useMilestones';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import MilestoneCard from './MilestoneCard';
import MilestoneDetailView from './MilestoneDetailView';
import { LayoutGrid, List as ListIcon, Plus } from 'lucide-react';
import './Milestones.css';

const MilestonesPage: React.FC = () => {
  const { milestones, addMilestone, updateMilestone, removeMilestone, toggleSubItem, updateSubChecklist, reorderSubItem, calculateProgress } = useMilestones();
  const { language } = useSettings();
  const t = translations[language] || translations.th;
  
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

  // Memoize milestones with their calculated progress
  const milestonesWithProgress = React.useMemo(() => {
    return milestones.map(m => ({
      ...m,
      currentProgress: calculateProgress(m.linkedAssets ?? [], m.trackingDimension, m.dividendPeriod, m.unit)
    }));
  }, [milestones, calculateProgress]);

  const handleAddBlank = () => {
    const newMilestone = addMilestone({
      title: language === 'th' ? 'เป้าหมายใหม่' : 'Untitled Goal',
      description: '',
      icon: 'trending-up',
      category: 'money',
      targetValue: 0,
      unit: '',
      linkedAssets: [],
      trackingDimension: 'Cash',
      precision: 2,
      tags: []
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
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 font-['Manrope']">{t.goals.title}</h1>
          <p className="text-gray-500 text-sm">
            {language === 'th' ? 'ติดตามความก้าวหน้าของเป้าหมายทางการเงินของคุณ' : 'Tracking the evolution of your financial goals.'}
          </p>
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
              <span>{t.goals.addBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={layout === 'grid' ? 'milestones-grid' : 'milestones-list'}>
        {milestonesWithProgress.map(milestone => (
          <MilestoneCard 
            key={milestone.id} 
            milestone={milestone}
            currentValue={milestone.currentProgress}
            onViewDetails={() => {
              setIsCreating(false);
              setSelectedMilestoneId(milestone.id);
            }}
          />
        ))}

        {milestonesWithProgress.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/[0.02] flex flex-col items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500/30">
              <Plus size={40} strokeWidth={1} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)] font-['Manrope']">
                {language === 'th' ? 'ยังไม่มีเป้าหมาย' : 'No Milestones Yet'}
              </h3>
              <p className="text-[var(--text-secondary)] max-w-xs mx-auto text-sm leading-relaxed">
                {language === 'th' 
                  ? 'เปลี่ยนความคาดหวังทางการเงินของคุณให้เป็นเป้าหมายที่วัดผลได้ เริ่มต้นด้วยการเพิ่มก้าวแรกของคุณ' 
                  : 'Transform your financial aspirations into trackable goals. Start by adding your first strategic milestone.'}
              </p>
            </div>
            <button className="add-milestone-btn mt-2" onClick={handleAddBlank}>
              <Plus size={18} />
              <span>{language === 'th' ? 'สร้างเป้าหมายแรกของคุณ' : 'Create Your First Goal'}</span>
            </button>
          </div>
        )}
      </div>

      {selectedMilestone && (() => {
          const selectedWithProgress = milestonesWithProgress.find(m => m.id === selectedMilestoneId);
          return (
            <MilestoneDetailView 
              milestone={selectedMilestone}
              currentValue={selectedWithProgress?.currentProgress ?? 0}
              onClose={handleCloseDetail}
              onToggleItem={(itemId) => toggleSubItem(selectedMilestoneId!, itemId)}
              onAddItem={(label) => updateSubChecklist(selectedMilestoneId!, label)}
              onReorderItem={reorderSubItem}
              onUpdateMilestone={updateMilestone}
              onDeleteMilestone={removeMilestone}
              initialEditMode={isCreating}
            />
          );
        })()}
    </div>
  );
};

export default MilestonesPage;
