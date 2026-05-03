import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Transaction } from '../types';
import * as storage from '../utils/storage';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TLogDataContextType {
  transactions: Transaction[];
  assetSummaries: AssetSummary[];
  isLoading: boolean;
}

interface TLogActionContextType {
  addTransaction: (newTx: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (updatedTx: Transaction) => void;
  importTransactions: (imported: Transaction[]) => void;
}

// AssetSummary type เพื่อแทน any[]
interface AssetSummary {
  symbol: string;
  asset: string;
  amount: number;
  lastUpdate: string;
  totalDividendPrice: number;
  dividendCount: number;
  latestDividendPrice: number;
  latestDividendDate: string;
  hasDividends: boolean;
  avgDividend: number;
}

// ─── Contexts ─────────────────────────────────────────────────────────────────
// แยก Data กับ Action ออกจากกัน:
// - Component ที่อ่านข้อมูลอย่างเดียว → subscribe เฉพาะ TLogDataContext
// - Component ที่แค่เพิ่ม/ลบ transaction → subscribe เฉพาะ TLogActionContext
//   → ไม่ re-render เมื่อ transactions array เปลี่ยน

const TLogDataContext   = createContext<TLogDataContextType | undefined>(undefined);
const TLogActionContext = createContext<TLogActionContextType | undefined>(undefined);

// ─── Mock Brokers (Migration helper) ─────────────────────────────────────────
const MOCK_BROKERS = ['Binance', 'Bitkub', 'SCB', 'K-Asset', 'Coinbase'];

function migrateBrokerField(data: Transaction[]): { data: Transaction[]; modified: boolean } {
  let modified = false;
  const migrated = data.map(tx => {
    if (!tx.broker) {
      modified = true;
      return { ...tx, broker: MOCK_BROKERS[tx.asset.length % MOCK_BROKERS.length] };
    }
    return tx;
  });
  return { data: migrated, modified };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export const TLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [internalTransactions, setInternalTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load + broker migration (รันครั้งเดียว)
  useEffect(() => {
    const raw = storage.loadTransactions();
    const { data, modified } = migrateBrokerField(raw);
    if (modified && data.length > 0) storage.saveTransactions(data);
    setInternalTransactions(data);
    setIsLoading(false);
  }, []);

  // ─── Sorted transactions (Data) ──────────────────────────────────────────
  const sortedTransactions = useMemo(
    () => [...internalTransactions].sort((a, b) => {
      const dA = new Date(a.date).getTime() || 0;
      const dB = new Date(b.date).getTime() || 0;
      return dB - dA;
    }),
    [internalTransactions]
  );

  // ─── Asset Summaries (Data) ───────────────────────────────────────────────
  const assetSummaries = useMemo((): AssetSummary[] => {
    const map: Record<string, Omit<AssetSummary, 'avgDividend'>> = {};

    internalTransactions.forEach(tx => {
      if (!tx.asset) return;
      const key = tx.asset.toUpperCase();
      if (!map[key]) {
        map[key] = {
          symbol: tx.asset, asset: tx.asset, amount: 0,
          lastUpdate: tx.date || new Date().toISOString(),
          totalDividendPrice: 0, dividendCount: 0,
          latestDividendPrice: 0, latestDividendDate: '',
          hasDividends: false,
        };
      }

      if      (tx.type === 'BUY')      map[key].amount += tx.amount || 0;
      else if (tx.type === 'SELL')     map[key].amount -= tx.amount || 0;
      else if (tx.type === 'DIVIDEND') {
        map[key].hasDividends         = true;
        map[key].totalDividendPrice  += tx.price || 0;
        map[key].dividendCount       += 1;
        const txT  = new Date(tx.date).getTime();
        const lastT = map[key].latestDividendDate
          ? new Date(map[key].latestDividendDate).getTime() : 0;
        if (!isNaN(txT) && (lastT === 0 || txT >= lastT)) {
          map[key].latestDividendPrice = tx.price;
          map[key].latestDividendDate  = tx.date;
        }
      }

      const txT   = new Date(tx.date).getTime();
      const lastT = new Date(map[key].lastUpdate).getTime();
      if (!isNaN(txT) && (isNaN(lastT) || txT > lastT)) map[key].lastUpdate = tx.date;
    });

    return Object.values(map)
      .filter(s => s.amount > 0 || s.hasDividends)
      .map(s => ({ ...s, avgDividend: s.dividendCount > 0 ? s.totalDividendPrice / s.dividendCount : 0 }))
      .sort((a, b) => (new Date(b.lastUpdate).getTime() || 0) - (new Date(a.lastUpdate).getTime() || 0));
  }, [internalTransactions]);

  // ─── Actions (stable — ไม่เปลี่ยน reference เมื่อ transactions เปลี่ยน) ──
  const addTransaction = useCallback((newTx: Transaction) => {
    setInternalTransactions(prev => {
      const next = [...prev, newTx];
      storage.addTransaction(newTx);
      return next;
    });
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setInternalTransactions(prev => {
      const next = prev.filter(tx => tx.id !== id);
      storage.deleteTransaction(id);
      return next;
    });
  }, []);

  const updateTransaction = useCallback((updatedTx: Transaction) => {
    setInternalTransactions(prev => {
      const next = prev.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
      storage.updateTransaction(updatedTx);
      return next;
    });
  }, []);

  const importTransactions = useCallback((imported: Transaction[]) => {
    setInternalTransactions(prev => {
      const merged = [...prev];
      imported.forEach(newTx => {
        const idx = merged.findIndex(tx => tx.id === newTx.id);
        if (idx !== -1) merged[idx] = newTx;
        else merged.push(newTx);
      });
      storage.saveTransactions(merged);
      return merged;
    });
  }, []);

  // ─── Context Values ───────────────────────────────────────────────────────
  const dataValue = useMemo<TLogDataContextType>(
    () => ({ transactions: sortedTransactions, assetSummaries, isLoading }),
    [sortedTransactions, assetSummaries, isLoading]
  );

  // Actions object ไม่เปลี่ยน reference เลย (callbacks ล้วน stable)
  const actionValue = useMemo<TLogActionContextType>(
    () => ({ addTransaction, removeTransaction, updateTransaction, importTransactions }),
    [addTransaction, removeTransaction, updateTransaction, importTransactions]
  );

  return (
    <TLogActionContext.Provider value={actionValue}>
      <TLogDataContext.Provider value={dataValue}>
        {children}
      </TLogDataContext.Provider>
    </TLogActionContext.Provider>
  );
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** อ่านข้อมูล transactions, assetSummaries, isLoading */
export const useTLogData = (): TLogDataContextType => {
  const ctx = useContext(TLogDataContext);
  if (!ctx) throw new Error('useTLogData must be used within TLogProvider');
  return ctx;
};

/** เรียกใช้ actions: add/remove/update/import transactions */
export const useTLogActions = (): TLogActionContextType => {
  const ctx = useContext(TLogActionContext);
  if (!ctx) throw new Error('useTLogActions must be used within TLogProvider');
  return ctx;
};

/**
 * @deprecated ใช้ useTLogData() หรือ useTLogActions() แทน
 * Backward-compat hook — รวมทั้ง data และ actions ไว้ด้วยกัน
 * ยังใช้ได้ แต่จะ re-render ทุกครั้งที่ transactions เปลี่ยน
 */
export const useTLog = (): TLogDataContextType & TLogActionContextType => {
  const data    = useTLogData();
  const actions = useTLogActions();
  return { ...data, ...actions };
};
