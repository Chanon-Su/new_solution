import { useMemo } from 'react';
import type { Milestone } from '../types';
import * as storage from '../utils/storage';

export type Frequency = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface ChartData {
  date: string;
  progress: number;
  effort: number;
}

export const useMilestoneAnalytics = (
  milestone: Milestone, 
  currentValue: number, 
  frequency: Frequency,
  enabled: boolean = true
) => {
  const chartData = useMemo(() => {
    if (!enabled) return [{ date: 'Loading...', progress: 0, effort: 0 }];
    
    // 1. Load All Transactions
    const allTransactions = storage.loadTransactions();
    
    // 2. Filter transactions for the linked asset
    const filteredTxs = allTransactions.filter(tx => 
      milestone.linkedAssets?.[0] && 
      tx.asset.toUpperCase() === milestone.linkedAssets[0].toUpperCase()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dataMap: Record<string, { date: string; progress: number; effort: number }> = {};
    
    // If we have asset transactions, use them for the chart
    if (filteredTxs.length > 0) {
      let cumulativeBalance = 0;
      
      filteredTxs.forEach(tx => {
        const date = new Date(tx.date);
        let key = '';
        
        if (frequency === 'year') {
          key = `${date.getFullYear()}`;
        } else if (frequency === 'quarter') {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
        } else if (frequency === 'month') {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (frequency === 'week') {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
        } else if (frequency === 'day') {
          key = date.toISOString().split('T')[0];
        } else {
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
        }

        if (!dataMap[key]) {
          dataMap[key] = { date: key, progress: 0, effort: 0 };
        }

        // Calculate value based on tracking dimension
        const txAmount = tx.type === 'SELL' ? -tx.amount : tx.amount;
        const txValue = tx.type === 'SELL' ? -(tx.amount * tx.price) : (tx.amount * tx.price);
        
        cumulativeBalance += (milestone.trackingDimension === 'Cash' || milestone.category === 'dividend' ? txValue : txAmount);
        
        dataMap[key].progress = cumulativeBalance;
        dataMap[key].effort += 1; // Count of activities
      });

      const sortedKeys = Object.keys(dataMap).sort();
      return sortedKeys.map(key => dataMap[key]);
    }

    // Fallback to Checklist grouping if no asset transactions found
    milestone.subChecklist.forEach(item => {
      if (item.isCompleted && item.completedAt) {
        const date = new Date(item.completedAt);
        let key = '';
        
        if (frequency === 'year') {
          key = `${date.getFullYear()}`;
        } else if (frequency === 'quarter') {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
        } else if (frequency === 'month') {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (frequency === 'week') {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
        } else if (frequency === 'day') {
          key = date.toISOString().split('T')[0];
        } else {
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
        }

        if (!dataMap[key]) {
          dataMap[key] = { date: key, progress: 0, effort: 0 };
        }
        dataMap[key].effort += 1;
      }
    });

    const sortedKeys = Object.keys(dataMap).sort();
    let cumulativeProgress = 0;
    
    return sortedKeys.length > 0 ? sortedKeys.map(key => {
      cumulativeProgress += (currentValue / (sortedKeys.length || 1));
      return {
        ...dataMap[key],
        progress: cumulativeProgress
      };
    }) : [
      { date: 'Waiting for Data', progress: 0, effort: 0 }
    ];
  }, [milestone.subChecklist, frequency, currentValue, milestone.linkedAssets, milestone.trackingDimension, milestone.category, enabled]);

  return chartData;
};
