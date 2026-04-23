import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Milestone, Transaction } from '../types';

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('planto_milestones');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse milestones', e);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever milestones change
  useEffect(() => {
    localStorage.setItem('planto_milestones', JSON.stringify(milestones));
  }, [milestones]);

  // Load transactions once and memoize
  const transactions = useMemo(() => {
    const tLogData = localStorage.getItem('planto_transactions');
    if (!tLogData) return [];
    try {
      return JSON.parse(tLogData) as Transaction[];
    } catch (e) {
      return [];
    }
  }, []);

  // Load followed assets for current prices and exchange rates
  const followedAssets = useMemo(() => {
    const saved = localStorage.getItem('planto_followed_assets');
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [];
    }
  }, []);

  // Logic to calculate progress from T-log (stable reference via useCallback)
  const calculateProgress = useCallback((linkedSymbol: string, category: string, trackingDimension?: 'Cash' | 'Unit', unit?: string): number => {
    if (!transactions.length || !linkedSymbol) return 0;
    
    const filtered = transactions.filter(t => t.asset.toUpperCase() === linkedSymbol.toUpperCase());

    if (category === 'dividend') {
      // Dividends are cumulative cash received (historically realized)
      return filtered.reduce((sum, t) => {
        if (t.type === 'DIVIDEND') return sum + (t.amount * t.price);
        return sum;
      }, 0);
    } else if (trackingDimension === 'Cash') {
      // Value (Cash) = Current Holding * Current Market Price
      const quantity = filtered.reduce((sum, t) => {
        if (t.type === 'BUY') return sum + t.amount;
        if (t.type === 'SELL') return sum - t.amount;
        return sum;
      }, 0);

      // Find current market price from Asset Mart
      const asset = followedAssets.find((a: any) => a.symbol.toUpperCase() === linkedSymbol.toUpperCase());
      // Prefer raw numeric price, fallback to string parsing for old data
      const currentPrice = asset ? (typeof asset.price === 'number' ? asset.price : parseFloat(String(asset.price).replace(/[^\d.]/g, ''))) : 0;
      
      let valuation = quantity * currentPrice;

      // Currency conversion if unit is THB
      if (unit?.toUpperCase() === 'THB') {
        const usdBthAsset = followedAssets.find((a: any) => a.symbol === 'USD/THB');
        const rate = usdBthAsset ? (typeof usdBthAsset.price === 'number' ? usdBthAsset.price : parseFloat(String(usdBthAsset.price).replace(/[^\d.]/g, ''))) : 35; // Default mockup rate
        valuation = valuation * rate;
      }

      return valuation;
    } else {
      // Default to Quantity (Unit) = Sum of BUY - SELL
      return filtered.reduce((sum, t) => {
        if (t.type === 'BUY') return sum + t.amount;
        if (t.type === 'SELL') return sum - t.amount;
        return sum;
      }, 0);
    }
  }, [transactions, followedAssets]);

  const addMilestone = (milestone: Omit<Milestone, 'id' | 'createdAt' | 'subChecklist'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newMilestone: Milestone = {
      ...milestone,
      id: newId,
      createdAt: new Date().toISOString(),
      subChecklist: []
    };
    setMilestones([...milestones, newMilestone]);
    return newMilestone;
  };

  const updateSubChecklist = (milestoneId: string, label: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          subChecklist: [...m.subChecklist, {
            id: Math.random().toString(36).substr(2, 9),
            label,
            isCompleted: false
          }]
        };
      }
      return m;
    }));
  };

  const toggleSubItem = (milestoneId: string, itemId: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          subChecklist: m.subChecklist.map(item => 
            item.id === itemId ? { ...item, isCompleted: !item.isCompleted, completedAt: !item.isCompleted ? new Date().toISOString() : undefined } : item
          )
        };
      }
      return m;
    }));
  };

  const reorderSubItem = (milestoneId: string, itemId: string, direction: 'up' | 'down') => {
    setMilestones(prev => prev.map(m => {
      if (m.id === milestoneId) {
        const activeItems = m.subChecklist.filter(item => !item.isCompleted);
        const indexInActive = activeItems.findIndex(item => item.id === itemId);
        
        if (indexInActive === -1) return m;
        
        const newIndexInActive = direction === 'up' ? indexInActive - 1 : indexInActive + 1;
        if (newIndexInActive < 0 || newIndexInActive >= activeItems.length) return m;

        // Find the actual indices in the original subChecklist
        const originalIndex = m.subChecklist.findIndex(item => item.id === itemId);
        const targetItemId = activeItems[newIndexInActive].id;
        const targetOriginalIndex = m.subChecklist.findIndex(item => item.id === targetItemId);

        const newChecklist = [...m.subChecklist];
        [newChecklist[originalIndex], newChecklist[targetOriginalIndex]] = [newChecklist[targetOriginalIndex], newChecklist[originalIndex]];
        
        return { ...m, subChecklist: newChecklist };
      }
      return m;
    }));
  };

  const updateMilestone = (id: string, data: Partial<Milestone>) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
  };

  const removeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(m => m.id !== id));
  };

  return {
    milestones,
    addMilestone,
    updateMilestone,
    removeMilestone,
    updateSubChecklist,
    toggleSubItem,
    reorderSubItem,
    calculateProgress
  };
};
