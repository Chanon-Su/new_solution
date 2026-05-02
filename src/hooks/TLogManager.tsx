import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Transaction } from '../types';
import * as storage from '../utils/storage';

interface TLogContextType {
  transactions: Transaction[];
  assetSummaries: any[];
  isLoading: boolean;
  addTransaction: (newTx: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (updatedTx: Transaction) => void;
  importTransactions: (imported: Transaction[]) => void;
}

const TLogContext = createContext<TLogContextType | undefined>(undefined);

export const TLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [internalTransactions, setInternalTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let data = storage.loadTransactions();
    
    // Migration: Add mock broker if missing for existing data
    let modified = false;
    const mockBrokers = ['Binance', 'Bitkub', 'SCB', 'K-Asset', 'Coinbase'];
    
    data = data.map(tx => {
      if (!tx.broker) {
        modified = true;
        // Deterministic mock based on asset or random
        const mockBroker = mockBrokers[tx.asset.length % mockBrokers.length];
        return { ...tx, broker: mockBroker };
      }
      return tx;
    });

    if (modified && data.length > 0) {
      storage.saveTransactions(data);
    }

    setInternalTransactions(data);
    setIsLoading(false);
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...internalTransactions].sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    });
  }, [internalTransactions]);

  const addTransaction = useCallback((newTx: Transaction) => {
    setInternalTransactions(prev => [...prev, newTx]);
    storage.addTransaction(newTx);
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setInternalTransactions(prev => prev.filter(tx => tx.id !== id));
    storage.deleteTransaction(id);
  }, []);

  const updateTransaction = useCallback((updatedTx: Transaction) => {
    setInternalTransactions(prev => prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
    storage.updateTransaction(updatedTx);
  }, []);

  const importTransactions = useCallback((imported: Transaction[]) => {
    setInternalTransactions(prev => {
      const merged = [...prev];
      imported.forEach(newTx => {
        const index = merged.findIndex(tx => tx.id === newTx.id);
        if (index !== -1) {
          merged[index] = newTx;
        } else {
          merged.push(newTx);
        }
      });
      storage.saveTransactions(merged);
      return merged;
    });
  }, []);

  const assetSummaries = useMemo(() => {
    const summaryMap: Record<string, { 
      symbol: string; 
      asset: string; 
      amount: number; 
      lastUpdate: string;
      totalDividendPrice: number;
      dividendCount: number;
      latestDividendPrice: number;
      latestDividendDate: string;
      hasDividends: boolean;
    }> = {};

    internalTransactions.forEach(tx => {
      if (!tx.asset) return;
      
      const key = tx.asset.toUpperCase();
      if (!summaryMap[key]) {
        summaryMap[key] = {
          symbol: tx.asset,
          asset: tx.asset,
          amount: 0,
          lastUpdate: tx.date || new Date().toISOString(),
          totalDividendPrice: 0,
          dividendCount: 0,
          latestDividendPrice: 0,
          latestDividendDate: '',
          hasDividends: false
        };
      }

      if (tx.type === 'BUY') {
        summaryMap[key].amount += tx.amount || 0;
      } else if (tx.type === 'SELL') {
        summaryMap[key].amount -= tx.amount || 0;
      } else if (tx.type === 'DIVIDEND') {
        summaryMap[key].hasDividends = true;
        summaryMap[key].totalDividendPrice += tx.price || 0;
        summaryMap[key].dividendCount += 1;
        
        const txDate = new Date(tx.date).getTime();
        const lastDivDate = summaryMap[key].latestDividendDate ? new Date(summaryMap[key].latestDividendDate).getTime() : 0;
        if (!isNaN(txDate) && (lastDivDate === 0 || txDate >= lastDivDate)) {
          summaryMap[key].latestDividendPrice = tx.price;
          summaryMap[key].latestDividendDate = tx.date;
        }
      }
      
      const txDate = new Date(tx.date).getTime();
      const lastDate = new Date(summaryMap[key].lastUpdate).getTime();
      if (!isNaN(txDate) && (isNaN(lastDate) || txDate > lastDate)) {
        summaryMap[key].lastUpdate = tx.date;
      }
    });

    return Object.values(summaryMap)
      .filter(s => s.amount > 0 || s.hasDividends)
      .map(s => ({
        ...s,
        avgDividend: s.dividendCount > 0 ? s.totalDividendPrice / s.dividendCount : 0
      }))
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdate).getTime() || 0;
        const dateB = new Date(b.lastUpdate).getTime() || 0;
        return dateB - dateA;
      });
  }, [internalTransactions]);

  const value = {
    transactions: sortedTransactions,
    assetSummaries,
    isLoading,
    addTransaction,
    removeTransaction,
    updateTransaction,
    importTransactions
  };

  return (
    <TLogContext.Provider value={value}>
      {children}
    </TLogContext.Provider>
  );
};

export const useTLog = () => {
  const context = useContext(TLogContext);
  if (context === undefined) {
    throw new Error('useTLog must be used within a TLogProvider');
  }
  return context;
};
