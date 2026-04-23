import type { Transaction } from '../types';

const STORAGE_KEY = 'planto_transactions';

let cachedTransactions: Transaction[] | null = null;

export const loadTransactions = (): Transaction[] => {
  if (cachedTransactions) return cachedTransactions;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      cachedTransactions = [];
      return [];
    }
    
    const parsed = JSON.parse(data);
    // Safety check: ensure it's an array
    cachedTransactions = Array.isArray(parsed) ? parsed : [];
    return cachedTransactions;
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    cachedTransactions = transactions; // Update cache
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
  }
};

export const addTransaction = (transaction: Transaction): void => {
  const transactions = loadTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const deleteTransaction = (id: string): void => {
  const transactions = loadTransactions();
  const filtered = transactions.filter(tx => tx.id !== id);
  saveTransactions(filtered);
};

export const updateTransaction = (updatedTx: Transaction): void => {
  const transactions = loadTransactions();
  const index = transactions.findIndex(tx => tx.id === updatedTx.id);
  if (index !== -1) {
    transactions[index] = updatedTx;
    saveTransactions(transactions);
  }
};
