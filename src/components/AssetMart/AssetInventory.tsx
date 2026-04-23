import React from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface AssetListItem {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  roi: string;
  isUp: boolean;
  category: string;
}

interface AssetInventoryProps {
  category: string;
  onBack: () => void;
  onSelectAsset: (asset: AssetListItem) => void;
}

const categoryMap: Record<string, { name: string; label: string }> = {
  all: { name: 'สำรวจสินทรัพย์ทั้งหมด', label: 'Global Asset Directory' },
  stocks: { name: 'หุ้น', label: 'Stocks' },
  fixedincome: { name: 'ตราสารหนี้', label: 'Fixed Income' },
  funds: { name: 'กองทุนรวม', label: 'Mutual Funds' },
  crypto: { name: 'Cryptocurrency', label: 'Digital Assets' },
  commodities: { name: 'สินค้าโภคภัณฑ์', label: 'Commodities' },
  realestate: { name: 'อสังหาริมทรัพย์', label: 'Real Estate' },
  others: { name: 'อื่นๆ', label: 'Others' },
};

const mockData: Record<string, AssetListItem[]> = {
  // ... (keep existing categories)
  stocks: [
    { id: 's1', name: 'Apple Inc.', symbol: 'AAPL', price: '$172.62', change: '+$1.45', roi: '+0.85%', isUp: true, category: 'STOCK' },
    { id: 's2', name: 'Nvidia Corp.', symbol: 'NVDA', price: '$894.52', change: '+$12.30', roi: '+1.40%', isUp: true, category: 'STOCK' },
    { id: 's3', name: 'Tesla, Inc.', symbol: 'TSLA', price: '$171.05', change: '-$4.15', roi: '-2.37%', isUp: false, category: 'STOCK' },
    { id: 's4', name: 'Microsoft', symbol: 'MSFT', price: '$425.22', change: '+$2.10', roi: '+0.50%', isUp: true, category: 'STOCK' },
    { id: 's5', name: 'Alphabet Inc.', symbol: 'GOOGL', price: '$154.85', change: '+$0.95', roi: '+0.62%', isUp: true, category: 'STOCK' },
  ],
  fixedincome: [
    { id: 'f1', name: 'US 10Y Treasury', symbol: 'US10Y', price: '4.52%', change: '+0.02', roi: '+0.44%', isUp: true, category: 'BOND' },
    { id: 'f2', name: 'Thai Govt Bond 5Y', symbol: 'THGB5Y', price: '2.45%', change: '-0.01', roi: '-0.40%', isUp: false, category: 'BOND' },
    { id: 'f3', name: 'Corp Bond Grade A', symbol: 'CB-A', price: '3.85%', change: '+0.05', roi: '+1.30%', isUp: true, category: 'BOND' },
  ],
  funds: [
    { id: 'm1', name: 'K-SET50-A', symbol: 'K-SET50', price: '14.52', change: '+$0.12', roi: '+0.83%', isUp: true, category: 'FUND' },
    { id: 'm2', name: 'SCB Global Equity', symbol: 'SCBGEQ', price: '18.75', change: '+$0.05', roi: '+0.27%', isUp: true, category: 'FUND' },
    { id: 'm3', name: 'TMB Gold Fund', symbol: 'TMBGOLD', price: '12.45', change: '-$0.02', roi: '-0.16%', isUp: false, category: 'FUND' },
  ],
  crypto: [
    { id: 'c1', name: 'Bitcoin', symbol: 'BTC', price: '$64,250.00', change: '+$1,240', roi: '+2.4%', isUp: true, category: 'CRYPTO' },
    { id: 'c2', name: 'Ethereum', symbol: 'ETH', price: '$3,450.12', change: '+$85', roi: '+1.8%', isUp: true, category: 'CRYPTO' },
    { id: 'c3', name: 'Solana', symbol: 'SOL', price: '$145.50', change: '-$4.2', roi: '-2.1%', isUp: false, category: 'CRYPTO' },
    { id: 'c4', name: 'Cardano', symbol: 'ADA', price: '$0.58', change: '+$0.01', roi: '+0.5%', isUp: true, category: 'CRYPTO' },
    { id: 'c5', name: 'Polkadot', symbol: 'DOT', price: '$9.20', change: '-$0.15', roi: '-1.4%', isUp: false, category: 'CRYPTO' },
  ],
  commodities: [
    { id: 'co1', name: 'Gold Spot', symbol: 'GOLD', price: '$2,385.40', change: '+$12.50', roi: '+0.53%', isUp: true, category: 'COMMODITY' },
    { id: 'co2', name: 'WTI Crude Oil', symbol: 'OIL', price: '$85.20', change: '-$1.15', roi: '-1.33%', isUp: false, category: 'COMMODITY' },
    { id: 'co3', name: 'Silver Spot', symbol: 'SILVER', price: '$28.45', change: '+$0.35', roi: '+1.25%', isUp: true, category: 'COMMODITY' },
  ],
  realestate: [
    { id: 'r1', name: 'CPN Retail Growth', symbol: 'CPNREIT', price: '10.80', change: '+$0.10', roi: '+0.93%', isUp: true, category: 'REALESTATE' },
    { id: 'r2', name: 'WHA Premium Growth', symbol: 'WHART', price: '9.45', change: '-$0.05', roi: '-0.53%', isUp: false, category: 'REALESTATE' },
    { id: 'r3', name: 'Digital Telecommunication', symbol: 'DIF', price: '8.15', change: '+$0.05', roi: '+0.62%', isUp: true, category: 'REALESTATE' },
  ],
  others: [
    { id: 'fx1', name: 'US Dollar / Thai Baht', symbol: 'USD/THB', price: '36.45', change: '+0.12', roi: '+0.33%', isUp: true, category: 'FOREX' },
    { id: 'o1', name: 'Fine Wine Index', symbol: 'WINE', price: '$425.00', change: '+$5.00', roi: '+1.19%', isUp: true, category: 'OTHER' },
    { id: 'o2', name: 'Rare Watches Fund', symbol: 'WATCH', price: '$12,450', change: '+$150', roi: '+1.22%', isUp: true, category: 'OTHER' },
    { id: 'o3', name: 'Carbon Credits', symbol: 'CARBON', price: '$72.15', change: '-$2.45', roi: '-3.28%', isUp: false, category: 'OTHER' },
  ],
};

const AssetInventory: React.FC<AssetInventoryProps> = ({ category, onBack, onSelectAsset }) => {
  const assets = category === 'all' 
    ? Object.values(mockData).flat() 
    : (mockData[category] || mockData.others);
    
  const categoryInfo = categoryMap[category] || { name: category, label: 'Asset Category' };

  return (
    <div className="inventory-container glass-panel p-8 rounded-[24px]">
      <div className="inventory-header">
        <div>
          <button onClick={onBack} className="text-emerald-500 text-sm font-medium mb-4 hover:underline flex items-center gap-2">
            <span>←</span> ย้อนกลับ
          </button>
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest block mb-1">Asset Directory</span>
          <h2 className="text-5xl font-bold text-white tracking-tight">
            {categoryInfo.name} <span className="text-xl text-gray-500 font-normal">({categoryInfo.label})</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">สถานะตลาด: เปิดทำการ</p>
          <p className="text-xs text-emerald-400 font-medium italic">Synced with Real-time Feeds</p>
        </div>
      </div>

      <div className="inventory-table-header mt-8">
        <span>ชื่อสินทรัพย์ / สัญลักษณ์</span>
        <span>ราคาปัจจุบัน</span>
        <span>เปลี่ยนแปลง (24H)</span>
        <span>ผลตอบแทน (ROI)</span>
        <span className="text-right">จัดการ</span>
      </div>

      <div className="inventory-list mt-2 flex flex-col gap-1">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="inventory-row group"
            onClick={() => onSelectAsset(asset)}
          >
            <div className="asset-identity">
              <div className="asset-logo-placeholder group-hover:border-emerald-500/50 transition-colors">{asset.symbol[0]}</div>
              <div className="flex flex-col">
                <span className="text-white font-bold group-hover:text-emerald-400 transition-colors">{asset.name}</span>
                <span className="text-gray-500 text-xs">{asset.symbol}</span>
              </div>
            </div>
            
            <div className="text-white font-medium">{asset.price}</div>
            
            <div className={`flex items-center gap-1 ${asset.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
              {asset.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm">{asset.change}</span>
            </div>
            
            <div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${asset.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {asset.roi}
              </span>
            </div>
            
            <div className="flex justify-end">
              <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetInventory;
