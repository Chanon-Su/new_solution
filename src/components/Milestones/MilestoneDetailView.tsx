import React, { useState, useEffect, useRef } from 'react';
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
  const [frequency, setFrequency] = useState<Frequency>(() => {
    const saved = localStorage.getItem(`planto_milestone_freq_${milestone.id}`);
    return (saved as Frequency) || 'month';
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isAddAssetDropdownOpen, setIsAddAssetDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [isZoomedToGoal, setIsZoomedToGoal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [followedAssets, setFollowedAssets] = useState<{symbol: string, name: string}[]>([]);
  const summaryRef = useRef<HTMLDivElement>(null);
  
  const [isComputing, setIsComputing] = useState(false);
  const [shouldCalculate, setShouldCalculate] = useState(false);

  const chartData = useMilestoneAnalytics(milestone, currentValue, frequency, shouldCalculate);

  // Persistence: Save frequency selection for this specific milestone
  useEffect(() => {
    localStorage.setItem(`planto_milestone_freq_${milestone.id}`, frequency);
  }, [frequency, milestone.id]);

  // Defer calculation until drawer is fully opened
  useEffect(() => {
    if (isDrawerOpen) {
      setIsComputing(true);
      const timer = setTimeout(() => {
        setShouldCalculate(true);
        setIsComputing(false);
      }, 800); // Wait for drawer animation (400ms) + small buffer
      return () => clearTimeout(timer);
    } else {
      setShouldCalculate(false);
      setIsComputing(false);
    }
  }, [isDrawerOpen]);

  // Load Assets from Follow List + T-log
  useEffect(() => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    const transactionsStr = localStorage.getItem('planto_transactions');
    
    let allAssets: { symbol: string, name: string }[] = [];
    const seenSymbols = new Set<string>();

    // 1. From Follow List
    if (followedStr) {
      try {
        const assets = JSON.parse(followedStr);
        assets.forEach((a: any) => {
          if (!seenSymbols.has(a.symbol)) {
            allAssets.push({ symbol: a.symbol, name: a.name });
            seenSymbols.add(a.symbol);
          }
        });
      } catch (e) {
        console.error('Failed to parse followed assets', e);
      }
    }

    // 2. From T-log (Transaction history)
    if (transactionsStr) {
      try {
        const txs = JSON.parse(transactionsStr);
        txs.forEach((tx: any) => {
          const symbol = tx.asset;
          if (symbol && !seenSymbols.has(symbol)) {
            allAssets.push({ symbol: symbol, name: symbol }); // Use symbol as name if not in Mart
            seenSymbols.add(symbol);
          }
        });
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    }

    setFollowedAssets(allAssets);
  }, []);

  // Click Outside Detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (summaryRef.current && !summaryRef.current.contains(event.target as Node)) {
        setIsAddAssetDropdownOpen(false);
        setIsDimensionDropdownOpen(false);
        setIsUnitDropdownOpen(false);
      }
    };

    if (isAddAssetDropdownOpen || isDimensionDropdownOpen || isUnitDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddAssetDropdownOpen, isDimensionDropdownOpen, isUnitDropdownOpen]);

  return (
    <div className="milestone-detail-overlay">
      <button className="close-detail-btn" onClick={onClose}>
        <X size={20} />
      </button>

      <div className="detail-content-top">
        <div className="max-w-[1100px] mx-auto w-full" ref={summaryRef}>
          <MilestoneSummary 
            milestone={milestone}
            currentValue={currentValue}
            isEditing={isEditing}
            showDeleteConfirm={showDeleteConfirm}
            isAddAssetDropdownOpen={isAddAssetDropdownOpen}
            isDimensionDropdownOpen={isDimensionDropdownOpen}
            followedAssets={followedAssets}
            onToggleEdit={() => {
              setIsEditing(!isEditing);
              setShowDeleteConfirm(false);
              setIsAddAssetDropdownOpen(false);
              setIsDimensionDropdownOpen(false);
            }}
            onShowDeleteConfirm={setShowDeleteConfirm}
            onDelete={() => {
              onDeleteMilestone(milestone.id);
              onClose();
            }}
            onUpdate={(data) => onUpdateMilestone(milestone.id, data)}
            onToggleAddAssetDropdown={() => {
              setIsAddAssetDropdownOpen(!isAddAssetDropdownOpen);
              setIsDimensionDropdownOpen(false);
              setIsUnitDropdownOpen(false);
            }}
            onToggleDimensionDropdown={() => {
              setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
              setIsAddAssetDropdownOpen(false);
              setIsUnitDropdownOpen(false);
            }}
            isUnitDropdownOpen={isUnitDropdownOpen}
            onToggleUnitDropdown={() => {
              setIsUnitDropdownOpen(!isUnitDropdownOpen);
              setIsAddAssetDropdownOpen(false);
              setIsDimensionDropdownOpen(false);
            }}
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
        isComputing={isComputing}
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
