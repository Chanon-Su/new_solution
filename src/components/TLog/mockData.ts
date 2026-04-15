import { Bitcoin, Apple, Cpu } from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  category: string;
  asset: string;
  symbol: string;
  amount: string;
  price: string;
  total: string;
  icon: any;
  iconColor: string;
}

export const mockTransactions: Transaction[] = [
  { 
    id: '1', 
    date: '08-Apr-2026', 
    type: 'BUY', 
    category: 'Crypto', 
    asset: 'Bitcoin', 
    symbol: 'BTC', 
    amount: '0.0520', 
    price: '$64,250.00', 
    total: '$3,341.00',
    icon: Bitcoin,
    iconColor: '#f59e0b'
  },
  { 
    id: '2', 
    date: '07-Apr-2026', 
    type: 'BUY', 
    category: 'Stock', 
    asset: 'Apple Inc.', 
    symbol: 'AAPL', 
    amount: '15.00', 
    price: '$168.45', 
    total: '$2,526.75',
    icon: Apple,
    iconColor: '#FFFFFF'
  },
  { 
    id: '3', 
    date: '06-Apr-2026', 
    type: 'BUY', 
    category: 'Crypto', 
    asset: 'Ethereum', 
    symbol: 'ETH', 
    amount: '1.2500', 
    price: '$3,450.10', 
    total: '$4,312.62',
    icon: Cpu,
    iconColor: '#6366f1'
  },
];
