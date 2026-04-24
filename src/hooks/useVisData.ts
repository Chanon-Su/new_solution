import { useMemo } from 'react';
import type { VisConfig, VisCurrency, Transaction, Milestone } from '../types';
import { generateMockPriceHistory, type PricePoint } from '../utils/mockPriceHistory';

// ─── Output Types ─────────────────────────────────────────────────────────────

export interface VisDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface VisTimePoint {
  date: string;
  value: number;
}

export interface VisMilestonePoint {
  name: string;
  target: number;
  current: number;
  unit: string;
  percent: number;
}

export interface VisTableRow {
  id: string;
  date: string;
  type: string;
  asset: string;
  category: string;
  amount: number;
  price: number;
  currency: string;
  notes: string;
}

export type VisData =
  | { kind: 'series'; points: VisDataPoint[] }
  | { kind: 'timeseries'; points: VisTimePoint[] }
  | { kind: 'priceHistory'; points: PricePoint[]; symbol: string; currentPrice: number }
  | { kind: 'milestone'; points: VisMilestonePoint[] }
  | { kind: 'table'; rows: VisTableRow[] }
  | { kind: 'empty' };

// ─── Colour Palette ───────────────────────────────────────────────────────────

const PALETTE = [
  '#10b981', '#3b82f6', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16',
  '#f97316', '#14b8a6',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUsdThbRate(): number {
  try {
    const followed = JSON.parse(localStorage.getItem('planto_followed_assets') ?? '[]');
    const usdAsset = followed.find((a: any) =>
      a.symbol === 'USD/THB' || a.symbol === 'USD'
    );
    if (usdAsset) {
      return typeof usdAsset.price === 'number'
        ? usdAsset.price
        : parseFloat(String(usdAsset.price).replace(/[^\d.]/g, '')) || 35;
    }
  } catch { /* ignore */ }
  return 35; // fallback
}

function toCurrency(thbAmount: number, txCurrency: VisCurrency, targetCurrency: VisCurrency, rate: number): number {
  if (txCurrency === targetCurrency) return thbAmount;
  if (txCurrency === 'USD' && targetCurrency === 'THB') return thbAmount * rate;
  if (txCurrency === 'THB' && targetCurrency === 'USD') return thbAmount / rate;
  return thbAmount;
}

function filterByDate(txDate: string, dateRange?: VisConfig['dateRange']): boolean {
  if (!dateRange || dateRange.preset === 'all') return true;
  const now = new Date();
  const d = new Date(txDate);
  if (isNaN(d.getTime())) return false;

  if (dateRange.preset === 'custom') {
    if (dateRange.from && d < new Date(dateRange.from)) return false;
    if (dateRange.to && d > new Date(dateRange.to)) return false;
    return true;
  }

  const presetMap: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  if (dateRange.preset === 'ytd') {
    return d.getFullYear() === now.getFullYear();
  }
  const days = presetMap[dateRange.preset] ?? 9999;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

interface UseVisDataInput {
  config: VisConfig | undefined;
  transactions: Transaction[];
  milestones: Milestone[];
  calculateProgress: (
    linkedAssets: string[],
    trackingDimension?: 'Cash' | 'Unit' | 'Dividend',
    dividendPeriod?: '1m' | '3m' | '6m' | '1y',
    unit?: string
  ) => number;
}

export function useVisData({ config, transactions, milestones, calculateProgress }: UseVisDataInput): {
  data: VisData;
  isEmpty: boolean;
} {
  const data = useMemo<VisData>(() => {
    if (!config || config.visType === 'empty' || config.visType === 'title') {
      return { kind: 'empty' };
    }

    const { dataSource, visType, dimension = 'category', value = 'cash', currency = 'THB', filter, dateRange } = config;
    const rate = getUsdThbRate();

    // ─── AssetMart Source ────────────────────────────────────────────────────
    if (dataSource === 'assetmart') {
      const symbol = config.assetmartSymbol;
      const preset = config.assetmartPreset ?? '1M';
      if (!symbol) return { kind: 'empty' };

      try {
        const followed = JSON.parse(localStorage.getItem('planto_followed_assets') ?? '[]');
        const asset = followed.find((a: any) => a.symbol?.toUpperCase() === symbol.toUpperCase());
        if (!asset) return { kind: 'empty' };

        const currentPrice = typeof asset.price === 'number'
          ? asset.price
          : parseFloat(String(asset.price).replace(/[^\d.]/g, '')) || 0;
        const roi = asset.roi ?? asset.change ?? '0%';

        const points = generateMockPriceHistory(symbol, currentPrice, roi, preset);
        return { kind: 'priceHistory', points, symbol, currentPrice };
      } catch {
        return { kind: 'empty' };
      }
    }

    // ─── Milestone Source ────────────────────────────────────────────────────
    if (dataSource === 'milestone') {
      const filtered = filter?.milestoneIds?.length
        ? milestones.filter(m => filter.milestoneIds!.includes(m.id))
        : milestones;

      if (!filtered.length) return { kind: 'empty' };

      const points: VisMilestonePoint[] = filtered.map(m => {
        const current = calculateProgress(
          m.linkedAssets,
          m.trackingDimension,
          m.dividendPeriod,
          m.unit
        );
        const percent = m.targetValue > 0 ? Math.min((current / m.targetValue) * 100, 100) : 0;
        return {
          name: m.title,
          target: m.targetValue,
          current: Math.round(current * 100) / 100,
          unit: m.unit ?? '',
          percent: Math.round(percent * 10) / 10,
        };
      });

      return { kind: 'milestone', points };
    }

    // ─── T-Log Source ────────────────────────────────────────────────────────
    // Apply filters
    let txs = transactions;

    if (filter?.categories?.length) {
      txs = txs.filter(t => filter.categories!.includes(t.category));
    }
    if (filter?.assets?.length) {
      txs = txs.filter(t => filter.assets!.map(a => a.toUpperCase()).includes(t.asset.toUpperCase()));
    }
    if (filter?.txTypes?.length) {
      txs = txs.filter(t => filter.txTypes!.includes(t.type));
    }
    txs = txs.filter(t => filterByDate(t.date, dateRange));

    if (!txs.length) return { kind: 'empty' };

    // Line chart → time series
    if (visType === 'line') {
      // จัดกลุ่มตาม date (day level) แล้ว sum cash value
      const dateMap: Record<string, number> = {};
      txs.forEach(t => {
        const day = t.date.slice(0, 10);
        const raw = value === 'unit'
          ? t.amount
          : value === 'count'
          ? 1
          : t.amount * t.price; // cash
        const converted = toCurrency(raw, t.currency as VisCurrency, currency, rate);
        dateMap[day] = (dateMap[day] ?? 0) + converted;
      });

      const sorted = Object.entries(dateMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date, value: Math.round(v * 100) / 100 }));

      return { kind: 'timeseries', points: sorted };
    }

    // Histogram → bin by price or cash
    if (visType === 'histogram') {
      const vals = txs.map(t => {
        const raw = value === 'cash' ? t.amount * t.price : t.price;
        return toCurrency(raw, t.currency as VisCurrency, currency, rate);
      });
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const bins = 10;
      const step = (max - min) / bins || 1;

      const buckets: Record<string, number> = {};
      for (let i = 0; i < bins; i++) {
        const lo = min + i * step;
        const hi = lo + step;
        const label = `${lo.toFixed(0)}–${hi.toFixed(0)}`;
        buckets[label] = 0;
      }
      vals.forEach(v => {
        const idx = Math.min(Math.floor((v - min) / step), bins - 1);
        const lo = min + idx * step;
        const hi = lo + step;
        const label = `${lo.toFixed(0)}–${hi.toFixed(0)}`;
        buckets[label] = (buckets[label] ?? 0) + 1;
      });

      const points: VisDataPoint[] = Object.entries(buckets).map(([name, val], i) => ({
        name,
        value: val,
        color: PALETTE[i % PALETTE.length],
      }));

      return { kind: 'series', points };
    }

    // Table
    if (visType === 'table') {
      const maxRows = config.maxRows ?? 30;
      const rows: VisTableRow[] = txs.slice(0, maxRows).map(t => ({
        id: t.id,
        date: t.date,
        type: t.type,
        asset: t.asset,
        category: t.category,
        amount: t.amount,
        price: t.price,
        currency: t.currency,
        notes: t.notes ?? '',
      }));
      return { kind: 'table', rows };
    }

    // Pie / Bar / Treemap → aggregate by dimension
    const groupMap: Record<string, number> = {};
    txs.forEach(t => {
      const key = dimension === 'asset' ? t.asset
        : dimension === 'type' ? t.type
        : t.category;

      const raw = value === 'unit'
        ? t.amount
        : value === 'count'
        ? 1
        : value === 'dividend' && t.type === 'DIVIDEND'
        ? t.amount * t.price
        : t.amount * t.price;

      const converted = toCurrency(raw, t.currency as VisCurrency, currency, rate);
      groupMap[key] = (groupMap[key] ?? 0) + converted;
    });

    const points: VisDataPoint[] = Object.entries(groupMap)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([name, val], i) => ({
        name,
        value: Math.round(val * 100) / 100,
        color: PALETTE[i % PALETTE.length],
      }));

    return { kind: 'series', points };
  }, [config, transactions, milestones, calculateProgress]);

  const isEmpty = data.kind === 'empty';

  return { data, isEmpty };
}
