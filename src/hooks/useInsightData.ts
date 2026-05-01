import { useMemo } from 'react';
import { useTLog } from './TLogManager';
import { getMarketPrice } from '../data/marketData';

export type InsightTimeDimension = 'all' | 'year' | 'month' | 'yearly_avg' | 'monthly_avg';
export type InsightAssetFocus = 'all' | 'global' | 'custom';

export interface AssetStat {
  symbol: string;
  amount: number;
  avgPrice: number;
  costBasis: number;
  totalValue: number; // Based on average purchase price in T-Log
  marketPrice: number | null; // Live price from AssetMart
  unrealizedPnL: number | null; // (MarketPrice - AvgPrice) * Amount
  dividends: number;
  totalReturn: number; // Realized + Dividends + Unrealized (if market price available)
}

export interface InsightMetrics {
  totalNetWorth: number;
  totalPnL: number; // Realized Capital Gain
  totalDividends: number;
  totalReturn: number; 
  pnlPercentage: number;
  returnPercentage: number;
  dividendYield: number;
  assetCount: number;
  buyCount: number;
  sellCount: number;
  dividendCount: number;
  buyVolume: number;
  sellVolume: number;
  totalFees: number;
  avgBuyPrice: number;
  liquidityScore: number;
  stabilityScore: number;
  growthScore: number;
}

export interface AllocationData {
  name: string;
  value: number;
  color: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface ActivityDataPoint {
  month: string;
  buy: number;
  sell: number;
  dividend: number;
}

const isGlobalAsset = (symbol: string): boolean => {
  const globalSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'GOLD', 'XAU', 'USDT', 'USDC'];
  return globalSymbols.includes(symbol.toUpperCase().trim());
};

export const useInsightData = (
  timeDimension: InsightTimeDimension,
  assetFocus: InsightAssetFocus,
  selectedYear?: number,
  selectedMonth?: number,
  selectedAssets: string[] = []
) => {
  const { transactions } = useTLog();

  const dropdownLists = useMemo(() => {
    const years = new Set<number>();
    const monthsByYear: Record<number, Set<number>> = {};
    const globals = new Set<string>();
    const customs = new Set<string>();

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const y = date.getFullYear();
      const m = date.getMonth();
      
      if (!isNaN(y)) {
        years.add(y);
        if (!monthsByYear[y]) monthsByYear[y] = new Set();
        monthsByYear[y].add(m);
      }

      if (isGlobalAsset(tx.asset)) globals.add(tx.asset.toUpperCase());
      else customs.add(tx.asset.toUpperCase());
    });

    return {
      availableYears: Array.from(years).sort((a, b) => b - a),
      availableMonths: monthsByYear,
      globalAssets: Array.from(globals).sort(),
      customAssets: Array.from(customs).sort()
    };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (selectedAssets.length > 0) {
        if (!selectedAssets.includes(tx.asset.toUpperCase())) return false;
      } else {
        if (assetFocus === 'global' && !isGlobalAsset(tx.asset)) return false;
        if (assetFocus === 'custom' && isGlobalAsset(tx.asset)) return false;
      }

      const txDate = new Date(tx.date);
      if (timeDimension === 'year' && selectedYear) {
        if (txDate.getFullYear() !== selectedYear) return false;
      }
      if (timeDimension === 'month' && selectedYear && selectedMonth !== undefined) {
        if (txDate.getFullYear() !== selectedYear || txDate.getMonth() !== selectedMonth) return false;
      }

      return true;
    });
  }, [transactions, assetFocus, timeDimension, selectedYear, selectedMonth, selectedAssets]);

  const assetStats = useMemo((): AssetStat[] => {
    const statsMap: Record<string, { totalAmount: number; totalCost: number; totalValue: number; totalDiv: number }> = {};
    
    filteredTransactions.forEach(tx => {
      const symbol = tx.asset.toUpperCase();
      if (!statsMap[symbol]) statsMap[symbol] = { totalAmount: 0, totalCost: 0, totalValue: 0, totalDiv: 0 };
      
      const val = tx.amount * tx.price;
      if (tx.type === 'BUY') {
        statsMap[symbol].totalAmount += tx.amount;
        statsMap[symbol].totalCost += val;
      } else if (tx.type === 'SELL') {
        statsMap[symbol].totalAmount -= tx.amount;
      } else if (tx.type === 'DIVIDEND') {
        statsMap[symbol].totalDiv += tx.price;
      }
      statsMap[symbol].totalValue = statsMap[symbol].totalAmount * tx.price;
    });

    return Object.entries(statsMap)
      .map(([symbol, data]) => {
        const mktPrice = getMarketPrice(symbol);
        const avgPrice = data.totalAmount > 0 ? data.totalCost / (data.totalAmount + 1e-9) : 0;
        const unrealizedPnL = mktPrice !== null ? (mktPrice - avgPrice) * data.totalAmount : null;
        const capitalGain = data.totalValue - data.totalCost;

        return {
          symbol,
          amount: data.totalAmount,
          avgPrice,
          costBasis: data.totalCost,
          totalValue: data.totalValue,
          marketPrice: mktPrice,
          unrealizedPnL: unrealizedPnL,
          dividends: data.totalDiv,
          totalReturn: capitalGain + data.totalDiv + (unrealizedPnL || 0)
        };
      })
      .filter(s => s.amount > 0 || s.dividends > 0)
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [filteredTransactions]);

  const metrics = useMemo((): InsightMetrics => {
    let buyCount = 0, sellCount = 0, divCount = 0;
    let buyVol = 0, sellVol = 0, totalDiv = 0, totalFees = 0;
    const assetsInvolved = new Set<string>();

    filteredTransactions.forEach(tx => {
      assetsInvolved.add(tx.asset.toUpperCase());
      const value = tx.amount * tx.price;
      totalFees += tx.fee || 0;
      
      if (tx.type === 'BUY') {
        buyCount++;
        buyVol += value;
      } else if (tx.type === 'SELL') {
        sellCount++;
        sellVol += value;
      } else if (tx.type === 'DIVIDEND') {
        divCount++;
        totalDiv += tx.price;
      }
    });

    let divisor = 1;
    if (timeDimension === 'yearly_avg') {
      divisor = Math.max(1, dropdownLists.availableYears.length);
    } else if (timeDimension === 'monthly_avg') {
      const totalMonths = Object.values(dropdownLists.availableMonths).reduce((acc, months) => acc + months.size, 0);
      divisor = Math.max(1, totalMonths);
    }

    // Total Unrealized from current inventory
    const totalUnrealized = assetStats.reduce((acc, stat) => acc + (stat.unrealizedPnL || 0), 0);

    const netWorth = (buyVol - sellVol) / divisor;
    const realizedPnL = ((sellVol + (netWorth > 0 ? netWorth * 1.05 : 0)) - buyVol) / divisor;
    const totalReturn = realizedPnL + (totalDiv / divisor) + (totalUnrealized / divisor);
    
    const pnlPct = buyVol > 0 ? (realizedPnL / buyVol) * 100 : 0;
    const returnPct = buyVol > 0 ? (totalReturn / buyVol) * 100 : 0;

    const cryptoCount = filteredTransactions.filter(t => t.category === 'CRYPTO').length;
    const stockCount = filteredTransactions.filter(t => t.category === 'STOCK').length;
    const totalTx = filteredTransactions.length || 1;

    return {
      totalNetWorth: netWorth,
      totalPnL: realizedPnL,
      totalDividends: totalDiv / divisor,
      totalReturn,
      pnlPercentage: pnlPct,
      returnPercentage: returnPct,
      dividendYield: buyVol > 0 ? (totalDiv / buyVol) * 100 : 0,
      assetCount: assetsInvolved.size,
      buyCount: buyCount / divisor,
      sellCount: sellCount / divisor,
      dividendCount: divCount / divisor,
      buyVolume: buyVol / divisor,
      sellVolume: sellVol / divisor,
      totalFees: totalFees / divisor,
      avgBuyPrice: buyCount > 0 ? (buyVol / divisor) / (buyCount / divisor) : 0,
      liquidityScore: 75,
      stabilityScore: 60,
      growthScore: Math.min(100, (cryptoCount + stockCount) / totalTx * 100),
    };
  }, [filteredTransactions, timeDimension, dropdownLists, assetStats]);

  const trendData = useMemo((): TrendDataPoint[] => {
    const sorted = [...filteredTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulativeValue = 0;
    const data: TrendDataPoint[] = [];

    sorted.forEach(tx => {
      const val = tx.amount * tx.price;
      if (tx.type === 'BUY') cumulativeValue += val;
      else if (tx.type === 'SELL') cumulativeValue -= val;
      
      data.push({
        date: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: cumulativeValue
      });
    });

    return data;
  }, [filteredTransactions]);

  const activityData = useMemo((): ActivityDataPoint[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const activityMap: Record<string, { buy: number; sell: number; dividend: number }> = {};
    
    filteredTransactions.forEach(tx => {
      const d = new Date(tx.date);
      const key = `${months[d.getMonth()]} ${d.getFullYear() % 100}`;
      if (!activityMap[key]) activityMap[key] = { buy: 0, sell: 0, dividend: 0 };
      
      const val = tx.amount * tx.price;
      if (tx.type === 'BUY') activityMap[key].buy += val;
      else if (tx.type === 'SELL') activityMap[key].sell += val;
      else if (tx.type === 'DIVIDEND') activityMap[key].dividend += tx.price;
    });

    return Object.entries(activityMap).map(([month, vals]) => ({
      month,
      buy: vals.buy,
      sell: vals.sell,
      dividend: vals.dividend
    })).slice(-6);
  }, [filteredTransactions]);

  const allocationData = useMemo((): AllocationData[] => {
    const catMap: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      catMap[tx.category] = (catMap[tx.category] || 0) + (tx.amount * tx.price);
    });

    const colors: Record<string, string> = {
      'CRYPTO': '#f59e0b', 'STOCK': '#10b981', 'CASH': '#3b82f6', 
      'GOLD': '#fbbf24', 'REALESTATE': '#8b5cf6', 'OTHER': '#6b7280'
    };

    return Object.entries(catMap).map(([name, value]) => ({
      name, value, color: colors[name] || colors['OTHER']
    }));
  }, [filteredTransactions]);

  return { metrics, allocationData, assetStats, trendData, activityData, dropdownLists, filteredTransactions };
};
