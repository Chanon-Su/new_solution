import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { QuickFillItem } from '../types';

interface QuickFillContextType {
  quickFills: QuickFillItem[];
  addQuickFill: (item: QuickFillItem) => void;
  removeQuickFill: (id: string) => void;
  updateQuickFill: (item: QuickFillItem) => void;
  applyQuickFill: (item: QuickFillItem) => void;
}

const QuickFillContext = createContext<QuickFillContextType | undefined>(undefined);

const STORAGE_KEY = 'planto_quick_fills';

export const QuickFillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quickFills, setQuickFills] = useState<QuickFillItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setQuickFills(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse quick fills', e);
      }
    } else {
      // Default items if empty
      const defaultItems: QuickFillItem[] = [
        { id: '1', name: 'A', icon: '💰', type: 'BUY', category: 'STOCK', currency: 'USD' },
        { id: '2', name: 'B', icon: '📊', type: 'SELL', category: 'CRYPTO', currency: 'USD' },
        { id: '3', name: 'C', icon: '🏢', type: 'DIVIDEND', category: 'REALESTATE', currency: 'THB' },
      ];
      setQuickFills(defaultItems);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
    }
  }, []);

  const save = (items: QuickFillItem[]) => {
    setQuickFills(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addQuickFill = useCallback((item: QuickFillItem) => {
    setQuickFills(prev => {
      const next = [...prev, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeQuickFill = useCallback((id: string) => {
    setQuickFills(prev => {
      const next = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuickFill = useCallback((updatedItem: QuickFillItem) => {
    setQuickFills(prev => {
      const next = prev.map(item => item.id === updatedItem.id ? updatedItem : item);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const applyQuickFill = useCallback((item: QuickFillItem) => {
    // Dispatch a custom event that TLog_zone1_Form will listen to
    const event = new CustomEvent('planto_apply_quick_fill', { detail: item });
    window.dispatchEvent(event);
  }, []);

  return (
    <QuickFillContext.Provider value={{ quickFills, addQuickFill, removeQuickFill, updateQuickFill, applyQuickFill }}>
      {children}
    </QuickFillContext.Provider>
  );
};

export const useQuickFill = () => {
  const context = useContext(QuickFillContext);
  if (context === undefined) {
    throw new Error('useQuickFill must be used within a QuickFillProvider');
  }
  return context;
};
