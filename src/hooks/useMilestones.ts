import { useState, useEffect, useMemo } from 'react';
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

  // Logic to calculate progress from T-log
  const calculateProgress = (linkedSymbol: string, category: string, trackingDimension?: 'Cash' | 'Unit'): number => {
    const tLogData = localStorage.getItem('planto_transactions');
    if (!tLogData) return 0;
    
    try {
      const transactions: Transaction[] = JSON.parse(tLogData);
      const filtered = transactions.filter(t => t.asset.toUpperCase() === linkedSymbol.toUpperCase());

      if (category === 'dividend' || trackingDimension === 'Cash') {
        return filtered.reduce((sum, t) => {
          if (t.type === 'DIVIDEND') return sum + (t.amount * t.price);
          if (trackingDimension === 'Cash') {
            if (t.type === 'BUY') return sum + (t.amount * t.price);
            if (t.type === 'SELL') return sum - (t.amount * t.price);
          }
          return sum;
        }, 0);
      } else {
        // Default to Quantity (Unit)
        return filtered.reduce((sum, t) => {
          if (t.type === 'BUY') return sum + t.amount;
          if (t.type === 'SELL') return sum - t.amount;
          return sum;
        }, 0);
      }
    } catch (e) {
      return 0;
    }
  };

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
