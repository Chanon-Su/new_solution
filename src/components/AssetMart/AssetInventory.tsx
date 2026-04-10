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
}

interface AssetInventoryProps {
  category: string;
  onBack: () => void;
  onSelectAsset: (asset: AssetListItem) => void;
}

const AssetInventory: React.FC<AssetInventoryProps> = ({ category, onBack, onSelectAsset }) => {
  const assets: AssetListItem[] = [
    { id: '1', name: 'Bitcoin', symbol: 'BTC', price: '$64,250.00', change: '+$1,240', roi: '+2.4%', isUp: true },
    { id: '2', name: 'Ethereum', symbol: 'ETH', price: '$3,450.12', change: '+$85', roi: '+1.8%', isUp: true },
    { id: '3', name: 'Solana', symbol: 'SOL', price: '$145.50', change: '-$4.2', roi: '-2.1%', isUp: false },
    { id: '4', name: 'Cardano', symbol: 'ADA', price: '$0.58', change: '+$0.01', roi: '+0.5%', isUp: true },
    { id: '5', name: 'Polkadot', symbol: 'DOT', price: '$9.20', change: '-$0.15', roi: '-1.4%', isUp: false },
  ];

  return (
    <div className="inventory-container glass-panel p-8 rounded-[24px]">
      <div className="inventory-header">
        <div>
          <button onClick={onBack} className="text-emerald-500 text-sm font-medium mb-4 hover:underline">← ย้อนกลับ</button>
          <span className="text-emerald-500 text-xs font-bold uppercase tracking-widest block mb-1">Asset Directory</span>
          <h2 className="text-5xl font-bold text-white tracking-tight">{category}</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Market is Open</p>
          <p className="text-xs text-emerald-400 font-medium">Synced with Global Data</p>
        </div>
      </div>

      <div className="inventory-table-header">
        <span>Asset Name</span>
        <span>Current Price</span>
        <span>24H Change</span>
        <span>Performance (ROI)</span>
        <span>Action</span>
      </div>

      <div className="inventory-list mt-4 flex flex-col gap-1">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="inventory-row"
            onClick={() => onSelectAsset(asset)}
          >
            <div className="asset-identity">
              <div className="asset-logo-placeholder">{asset.symbol[0]}</div>
              <div className="flex flex-col">
                <span className="text-white font-bold">{asset.name}</span>
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
              <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
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
