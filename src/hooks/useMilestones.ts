import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Milestone, Transaction } from '../types';

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('planto_milestones');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        // Migration guard: linkedAssetSymbol (string) → linkedAssets (string[])
        return parsed.map(m => ({
          ...m,
          linkedAssets: m.linkedAssets ?? (m.linkedAssetSymbol ? [m.linkedAssetSymbol] : []),
        })) as Milestone[];
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

  // คำนวณ progress จาก T-log รองรับ multi-asset + Dividend period
  const calculateProgress = useCallback((
    linkedAssets: string[],
    trackingDimension?: 'Cash' | 'Unit' | 'Dividend',
    dividendPeriod?: '1m' | '3m' | '6m' | '1y',
    unit?: string
  ): number => {
    if (!transactions.length || !linkedAssets.length) return 0;

    // Map dividend frequency string → number of months
    const freqMonths: Record<string, number> = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 };

    // USD/THB rate จาก followed assets
    const usdThbAsset = followedAssets.find((a: any) => a.symbol === 'USD/THB');
    const usdThbRate = usdThbAsset
      ? (typeof usdThbAsset.price === 'number' ? usdThbAsset.price : parseFloat(String(usdThbAsset.price).replace(/[^\d.]/g, '')))
      : 35;

    if (trackingDimension === 'Dividend' && dividendPeriod) {
      // --- Dividend Mode ---
      const targetMonths = freqMonths[dividendPeriod] ?? 12;
      let total = 0;

      for (const symbol of linkedAssets) {
        const assetTxs = transactions.filter(
          t => t.asset.toUpperCase() === symbol.toUpperCase() &&
               t.type === 'DIVIDEND' &&
               t.frequency !== 'OTHER'
        );

        // จัดกลุ่มตาม frequency แล้วดึง N รายการล่าสุด
        const freqGroups: Record<string, typeof assetTxs> = {};
        for (const tx of assetTxs) {
          const freq = tx.frequency ?? '1y';
          if (!freqGroups[freq]) freqGroups[freq] = [];
          freqGroups[freq].push(tx);
        }

        for (const [freq, txGroup] of Object.entries(freqGroups)) {
          const dividendMonths = freqMonths[freq];
          if (!dividendMonths) continue; // OTHER หรือ freq ที่ไม่รู้จัก → ข้าม

          const N = Math.round(targetMonths / dividendMonths);
          // เรียงจากใหม่สุด แล้วเอา N รายการ
          const recent = [...txGroup]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, N);

          let assetSum = recent.reduce((sum, t) => sum + (t.amount * t.price), 0);

          // Currency conversion: ถ้า tx เป็น THB แต่เป้าหมายเป็น USD → หาร
          // ถ้า tx เป็น USD แต่เป้าหมายเป็น THB → คูณ
          if (recent.length > 0) {
            const txCurrency = recent[0].currency ?? 'USD';
            const targetUnit = unit?.toUpperCase() ?? 'USD';
            if (txCurrency === 'THB' && targetUnit === 'USD') {
              assetSum = assetSum / usdThbRate;
            } else if (txCurrency === 'USD' && targetUnit === 'THB') {
              assetSum = assetSum * usdThbRate;
            }
          }
          total += assetSum;
        }
      }
      return total;

    } else if (trackingDimension === 'Cash') {
      // --- Value Mode (multi-asset sum of current market value) ---
      let total = 0;
      for (const symbol of linkedAssets) {
        const filtered = transactions.filter(t => t.asset.toUpperCase() === symbol.toUpperCase());
        const quantity = filtered.reduce((sum, t) => {
          if (t.type === 'BUY') return sum + t.amount;
          if (t.type === 'SELL') return sum - t.amount;
          return sum;
        }, 0);
        const asset = followedAssets.find((a: any) => a.symbol.toUpperCase() === symbol.toUpperCase());
        const currentPrice = asset
          ? (typeof asset.price === 'number' ? asset.price : parseFloat(String(asset.price).replace(/[^\d.]/g, '')))
          : 0;
        let valuation = quantity * currentPrice;
        if (unit?.toUpperCase() === 'THB') {
          valuation = valuation * usdThbRate;
        }
        total += valuation;
      }
      return total;

    } else {
      // --- Quantity Mode (multi-asset sum of units) ---
      let total = 0;
      for (const symbol of linkedAssets) {
        const filtered = transactions.filter(t => t.asset.toUpperCase() === symbol.toUpperCase());
        total += filtered.reduce((sum, t) => {
          if (t.type === 'BUY') return sum + t.amount;
          if (t.type === 'SELL') return sum - t.amount;
          return sum;
        }, 0);
      }
      return total;
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
