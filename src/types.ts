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

export type VisType = 'allocation' | 'value' | 'activity' | 'empty';

export type DashboardBlock = {
  id: string;
  x: number; // 0-indexed vertex (0 = leftmost)
  y: number; // 0-indexed vertex (0 = topmost)
  w: number; // Width in grid units
  h: number; // Height in grid units
  type: VisType;
  title: string;
  page: number; // 0, 1, 2
};
