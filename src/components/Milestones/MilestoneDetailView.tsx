import React, { useState, useEffect } from 'react';
import type { Milestone } from '../../types';
import { X } from 'lucide-react';
import { useMilestoneAnalytics, type Frequency } from '../../hooks/useMilestoneAnalytics';
import MilestoneSummary from './MilestoneSummary';
import MilestoneTasks from './MilestoneTasks';
import MilestoneAnalyticsDrawer from './MilestoneAnalyticsDrawer';

interface MilestoneDetailViewProps {
  milestone: Milestone;
  currentValue: number;
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
  onAddItem: (label: string) => void;
  onReorderItem: (milestoneId: string, itemId: string, direction: 'up' | 'down') => void;
  onUpdateMilestone: (id: string, data: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
  initialEditMode?: boolean;
}

const MilestoneDetailView: React.FC<MilestoneDetailViewProps> = ({ 
  milestone, 
  currentValue, 
  onClose, 
  onToggleItem,
  onAddItem,
  onReorderItem,
  onUpdateMilestone,
  onDeleteMilestone,
  initialEditMode = false
}) => {
  const [frequency, setFrequency] = useState<Frequency>('month');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);
  const [isZoomedToGoal, setIsZoomedToGoal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [followedAssets, setFollowedAssets] = useState<{symbol: string, name: string}[]>([]);

  const chartData = useMilestoneAnalytics(milestone, currentValue, frequency);

  // Load Real Follow List Assets from Asset Mart
  useEffect(() => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    if (followedStr) {
      try {
        const assets = JSON.parse(followedStr);
        setFollowedAssets(assets.map((a: any) => ({ symbol: a.symbol, name: a.name })));
      } catch (e) {
        console.error('Failed to parse followed assets', e);
      }
    }
  }, []);

  return (
    <div className="milestone-detail-overlay">
      <button className="close-detail-btn" onClick={onClose}>
        <X size={20} />
      </button>

      <div className="detail-content-top">
        <div className="max-w-[1100px] mx-auto w-full">
          <MilestoneSummary 
            milestone={milestone}
            currentValue={currentValue}
            isEditing={isEditing}
            showDeleteConfirm={showDeleteConfirm}
            isAssetDropdownOpen={isAssetDropdownOpen}
            isDimensionDropdownOpen={isDimensionDropdownOpen}
            followedAssets={followedAssets}
            onToggleEdit={() => {
              setIsEditing(!isEditing);
              setShowDeleteConfirm(false);
            }}
            onShowDeleteConfirm={setShowDeleteConfirm}
            onDelete={() => {
              onDeleteMilestone(milestone.id);
              onClose();
            }}
            onUpdate={(data) => onUpdateMilestone(milestone.id, data)}
            onToggleAssetDropdown={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
            onToggleDimensionDropdown={() => setIsDimensionDropdownOpen(!isDimensionDropdownOpen)}
          />

          <MilestoneTasks 
            milestone={milestone}
            onToggleItem={onToggleItem}
            onAddItem={onAddItem}
            onReorderItem={onReorderItem}
          />
        </div>
      </div>

      <MilestoneAnalyticsDrawer 
        isDrawerOpen={isDrawerOpen}
        frequency={frequency}
        isZoomedToGoal={isZoomedToGoal}
        chartData={chartData}
        targetValue={milestone.targetValue}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        onFrequencyChange={setFrequency}
        onToggleZoom={() => setIsZoomedToGoal(!isZoomedToGoal)}
      />
    </div>
  );
};

export default MilestoneDetailView;
