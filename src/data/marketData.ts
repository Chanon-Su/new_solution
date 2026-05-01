export interface MarketAsset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: string;
  roi: string;
  isUp: boolean;
  category: string;
}

export const MARKET_DATA: MarketAsset[] = [
  // STOCKS
  { id: 's1', name: 'Apple Inc.', symbol: 'AAPL', price: 172.62, change: '+$1.45', roi: '+0.85%', isUp: true, category: 'STOCK' },
  { id: 's2', name: 'Nvidia Corp.', symbol: 'NVDA', price: 894.52, change: '+$12.30', roi: '+1.40%', isUp: true, category: 'STOCK' },
  { id: 's3', name: 'Tesla, Inc.', symbol: 'TSLA', price: 171.05, change: '-$4.15', roi: '-2.37%', isUp: false, category: 'STOCK' },
  { id: 's4', name: 'Microsoft', symbol: 'MSFT', price: 425.22, change: '+$2.10', roi: '+0.50%', isUp: true, category: 'STOCK' },
  { id: 's5', name: 'Alphabet Inc.', symbol: 'GOOGL', price: 154.85, change: '+$0.95', roi: '+0.62%', isUp: true, category: 'STOCK' },
  
  // CRYPTO
  { id: 'c1', name: 'Bitcoin', symbol: 'BTC', price: 64250.00, change: '+$1,240', roi: '+2.4%', isUp: true, category: 'CRYPTO' },
  { id: 'c2', name: 'Ethereum', symbol: 'ETH', price: 3450.12, change: '+$85', roi: '+1.8%', isUp: true, category: 'CRYPTO' },
  { id: 'c3', name: 'Solana', symbol: 'SOL', price: 145.50, change: '-$4.2', roi: '-2.1%', isUp: false, category: 'CRYPTO' },
  { id: 'c4', name: 'Cardano', symbol: 'ADA', price: 0.58, change: '+$0.01', roi: '+0.5%', isUp: true, category: 'CRYPTO' },
  
  // COMMODITIES
  { id: 'co1', name: 'Gold Spot', symbol: 'GOLD', price: 2385.40, change: '+$12.50', roi: '+0.53%', isUp: true, category: 'COMMODITY' },
  { id: 'co2', name: 'WTI Crude Oil', symbol: 'OIL', price: 85.20, change: '-$1.15', roi: '-1.33%', isUp: false, category: 'COMMODITY' },
  
  // REAL ESTATE
  { id: 'r1', name: 'CPN Retail Growth', symbol: 'CPNREIT', price: 10.80, change: '+$0.10', roi: '+0.93%', isUp: true, category: 'REALESTATE' },
  { id: 'r2', name: 'WHA Premium Growth', symbol: 'WHART', price: 9.45, change: '-$0.05', roi: '-0.53%', isUp: false, category: 'REALESTATE' },
  { id: 'r3', name: 'Digital Telecommunication', symbol: 'DIF', price: 8.15, change: '+$0.05', roi: '+0.62%', isUp: true, category: 'REALESTATE' },
  
  // FOREX
  { id: 'fx1', name: 'US Dollar / Thai Baht', symbol: 'USD/THB', price: 36.45, change: '+0.12', roi: '+0.33%', isUp: true, category: 'FOREX' },
];

export const getMarketPrice = (symbol: string): number | null => {
  const asset = MARKET_DATA.find(a => a.symbol.toUpperCase() === symbol.toUpperCase());
  return asset ? asset.price : null;
};
