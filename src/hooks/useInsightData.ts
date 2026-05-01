import { useMemo } from 'react';
import { useTLog } from './TLogManager';
import type { Transaction } from '../types';

export type InsightTimeDimension = 'all' | 'year' | 'month';
export type InsightAssetFocus = 'all' | 'global' | 'custom';

export interface InsightMetrics {
  totalNetWorth: number;
  totalPnL: number;
  pnlPercentage: number;
  annualizedYield: number;
  liquidityScore: number; // 0-100
  stabilityScore: number; // 0-100
  growthScore: number; // 0-100
  dividendYield: number;
  assetCount: number;
  monthlyInflow: number;
  monthlyOutflow: number;
}

export interface AllocationData {
  name: string;
  value: number;
  color: string;
}

// Heuristic to check if an asset is "Global" (Standard) vs "Custom" (Specialized)
const isGlobalAsset = (symbol: string): boolean => {
  const globalSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'GOLD', 'XAU', 'USDT', 'USDC'];
  return globalSymbols.includes(symbol.toUpperCase().trim());
};

export const useInsightData = (
  timeDimension: InsightTimeDimension,
  assetFocus: InsightAssetFocus,
  selectedYear?: number,
  selectedMonth?: number
) => {
  const { transactions, assetSummaries } = useTLog();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // 1. Filter by Asset Focus
      if (assetFocus === 'global' && !isGlobalAsset(tx.asset)) return false;
      if (assetFocus === 'custom' && isGlobalAsset(tx.asset)) return false;

      // 2. Filter by Time Dimension
      const txDate = new Date(tx.date);
      if (timeDimension === 'year' && selectedYear) {
        if (txDate.getFullYear() !== selectedYear) return false;
      }
      if (timeDimension === 'month' && selectedYear && selectedMonth !== undefined) {
        if (txDate.getFullYear() !== selectedYear || txDate.getMonth() !== selectedMonth) return false;
      }

      return true;
    });
  }, [transactions, assetFocus, timeDimension, selectedYear, selectedMonth]);

  const metrics = useMemo((): InsightMetrics => {
    let totalIn = 0;
    let totalOut = 0;
    let totalDiv = 0;
    const assetsInvolved = new Set<string>();

    filteredTransactions.forEach(tx => {
      assetsInvolved.add(tx.asset.toUpperCase());
      const value = (tx.amount * tx.price) + (tx.fee || 0);
      
      if (tx.type === 'BUY') totalIn += value;
      else if (tx.type === 'SELL') totalOut += value;
      else if (tx.type === 'DIVIDEND') totalDiv += tx.price; // price is the dividend amount usually
    });

    // Mock calculations for demo purposes
    const netWorth = totalIn - totalOut;
    const pnl = (totalOut + (netWorth > 0 ? netWorth * 1.1 : 0)) - totalIn; // Mocked 10% gain for visuals
    const pnlPct = totalIn > 0 ? (pnl / totalIn) * 100 : 0;
    
    // RPG-like stats but professional
    // Growth: based on Stock/Crypto ratio
    // Stability: based on Cash/Gold/Bonds ratio (mocked from categories)
    const cryptoCount = filteredTransactions.filter(t => t.category === 'CRYPTO').length;
    const stockCount = filteredTransactions.filter(t => t.category === 'STOCK').length;
    const totalCount = filteredTransactions.length || 1;

    return {
      totalNetWorth: netWorth,
      totalPnL: pnl,
      pnlPercentage: pnlPct,
      annualizedYield: 8.5, // Mocked
      liquidityScore: 75, // Mocked
      stabilityScore: 60, // Mocked
      growthScore: Math.min(100, (cryptoCount + stockCount) / totalCount * 100),
      dividendYield: totalIn > 0 ? (totalDiv / totalIn) * 100 : 0,
      assetCount: assetsInvolved.size,
      monthlyInflow: totalIn / 12, // Mocked average
      monthlyOutflow: totalOut / 12,
    };
  }, [filteredTransactions]);

  const allocationData = useMemo((): AllocationData[] => {
    const catMap: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + (tx.amount * tx.price);
    });

    const colors: Record<string, string> = {
      'CRYPTO': '#f59e0b',
      'STOCK': '#10b981',
      'CASH': '#3b82f6',
      'GOLD': '#fbbf24',
      'REALESTATE': '#8b5cf6',
      'OTHER': '#6b7280'
    };

    return Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || colors['OTHER']
    }));
  }, [filteredTransactions]);

  const radarData = useMemo(() => {
    return [
      { subject: 'Growth', A: metrics.growthScore, fullMark: 100 },
      { subject: 'Stability', A: metrics.stabilityScore, fullMark: 100 },
      { subject: 'Dividend', A: Math.min(100, metrics.dividendYield * 10), fullMark: 100 },
      { subject: 'Liquidity', A: metrics.liquidityScore, fullMark: 100 },
      { subject: 'Diversity', A: Math.min(100, metrics.assetCount * 10), fullMark: 100 },
    ];
  }, [metrics]);

  return {
    metrics,
    allocationData,
    radarData,
    filteredTransactions
  };
};
