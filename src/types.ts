export type Transaction = {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  asset: string;
  category: string;
  amount: number;
  price: number;
  currency: 'THB' | 'USD';
  fee: number;
  notes: string;
};
