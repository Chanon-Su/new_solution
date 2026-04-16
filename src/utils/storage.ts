import type { Transaction } from '../types';

const STORAGE_KEY = 'planto_transactions';

export const loadTransactions = (): Transaction[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    // Safety check: ensure it's an array
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to load transactions from localStorage:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
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
