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
  linkedAssets: string[];              // Multi-asset list (แทน linkedAssetSymbol)
  linkedAssetSymbol?: string;          // @deprecated — ใช้เพื่อ migration เท่านั้น
  trackingDimension?: 'Cash' | 'Unit' | 'Dividend';
  dividendPeriod?: '1m' | '3m' | '6m' | '1y'; // ใช้เฉพาะ Dividend mode
  precision?: number;
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
  fee_discount?: number;
  fee_vat?: number;
  notes: string;
  broker?: string;
};

export interface QuickFillItem {
  id: string;
  name: string;
  icon?: string;
  type?: 'BUY' | 'SELL' | 'DIVIDEND';
  frequency?: '1m' | '3m' | '6m' | '1y' | 'OTHER';
  asset?: string;
  category?: string;
  amount?: number;
  price?: number;
  currency?: 'THB' | 'USD';
  fee?: number;
  fee_vat?: number;
  fee_discount?: number;
  notes?: string;
  broker?: string;
}

// ─── Vis Type System ──────────────────────────────────────────────────────────

export type VisType =
  | 'pie'
  | 'bar'
  | 'target-bar'
  | 'line'
  | 'treemap'
  | 'histogram'
  | 'table'
  | 'title'
  | 'empty';

export type VisDataSource = 'tlog' | 'milestone' | 'assetmart';

export type VisDimension = 'category' | 'asset' | 'type';

export type VisValue = 'cash' | 'unit' | 'count' | 'dividend';

export type VisCurrency = 'THB' | 'USD';

export interface VisFilter {
  categories?: string[];
  assets?: string[];
  txTypes?: ('BUY' | 'SELL' | 'DIVIDEND')[];
  milestoneIds?: string[];
}

export interface VisDateRange {
  preset: 'all' | '7d' | '30d' | '90d' | '1y' | 'ytd' | 'custom';
  from?: string;
  to?: string;
}

export interface VisConfig {
  visType: VisType;
  dataSource: VisDataSource;
  title: string;
  dimension?: VisDimension;
  value?: VisValue;
  currency?: VisCurrency;
  filter?: VisFilter;
  dateRange?: VisDateRange;
  maxRows?: number;           // สำหรับ table (default: 30)
  assetmartSymbol?: string;   // symbol ที่เลือกจาก Follow List
  assetmartPreset?: '1D' | '1W' | '1M' | '1Y' | 'ALL';
  titleText?: string;         // สำหรับ title block
  titleSubtext?: string;
}

// ─── Dashboard Block ───────────────────────────────────────────────────────────

export type DashboardBlock = {
  id: string;
  x: number; // 0-indexed vertex (0 = leftmost)
  y: number; // 0-indexed vertex (0 = topmost)
  w: number; // Width in grid units
  h: number; // Height in grid units
  type: VisType;
  title: string;
  page: number; // 0, 1, 2
  visConfig?: VisConfig; // Visualization configuration
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
