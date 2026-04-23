export interface SubChecklistItem {
  id: string;
  label: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'money' | 'asset' | 'dividend';
  targetValue: number;
  currentValue?: number; // Calculated from T-Log
  unit: string;
  linkedAssetSymbol: string; // ผูกกับ T-log และ Asset-mart
  trackingDimension?: 'Cash' | 'Unit';
  tags: string[];
  subChecklist: SubChecklistItem[];
  createdAt: string;
}

export type Transaction = {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  frequency?: '1m' | '3m' | '6m' | '1y' | 'OTHER';
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

export type BillingOption = {
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
};

export type SubscriptionPlan = {
  id: string;
  title: string;
  description: string;
  features: string[];
  billing: BillingOption;
  type: 'standard' | 'group' | 'vip';
  rank: number;
  isFeatured?: boolean;
};
