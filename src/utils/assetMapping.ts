import { 
  Bitcoin, 
  Apple, 
  Cpu, 
  Circle,
  Coins,
  TrendingUp,
  CircleDollarSign,
  Globe,
  Briefcase
} from 'lucide-react';

// Common asset mapping
const ASSET_ICON_MAP: Record<string, { icon: any; color: string }> = {
  'BTC': { icon: Bitcoin, color: '#f59e0b' },
  'BITCOIN': { icon: Bitcoin, color: '#f59e0b' },
  'ETH': { icon: Cpu, color: '#6366f1' },
  'ETHEREUM': { icon: Cpu, color: '#6366f1' },
  'AAPL': { icon: Apple, color: '#FFFFFF' },
  'APPLE': { icon: Apple, color: '#FFFFFF' },
  'MSFT': { icon: Globe, color: '#00a4ef' },
  'GOOGL': { icon: Globe, color: '#4285f4' },
  'NVDA': { icon: Cpu, color: '#76b900' },
  'GOLD': { icon: Coins, color: '#ffd700' },
  'XAU': { icon: Coins, color: '#ffd700' },
  'TSLA': { icon: TrendingUp, color: '#e31937' },
};

export const getAssetMetadata = (symbol: string, assetName: string = '') => {
  const normalizedSymbol = symbol.toUpperCase().trim();
  const normalizedName = assetName.toUpperCase().trim();

  // Try mapping by symbol
  if (ASSET_ICON_MAP[normalizedSymbol]) {
    return ASSET_ICON_MAP[normalizedSymbol];
  }

  // Try mapping by partial name match
  if (normalizedName.includes('BITCOIN')) return ASSET_ICON_MAP['BTC'];
  if (normalizedName.includes('ETHEREUM')) return ASSET_ICON_MAP['ETH'];

  // Default Fallback: Grey Circle
  return {
    icon: Circle,
    color: '#9CA3AF'
  };
};

export const getCategoryIcon = (category: string) => {
  const normalized = category.toUpperCase().trim();
  if (normalized === 'CRYPTO') return Coins;
  if (normalized === 'STOCK' || normalized === 'STOCKS') return Briefcase;
  return CircleDollarSign;
};
