import React, { useState } from 'react';
import BentoGrid from './BentoGrid';
import FollowList from './FollowList';
import AssetInventory from './AssetInventory';
import AssetDetail from './AssetDetail';
import { Search } from 'lucide-react';
import './AssetMart.css';

type ViewMode = 'main' | 'inventory' | 'detail';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  roi: string;
  isUp: boolean;
}

const AssetMart: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setViewMode('inventory');
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('detail');
  };

  const handleBackToMain = () => {
    setViewMode('main');
    setSelectedCategory(null);
  };

  const handleBackToInventory = () => {
    setViewMode('inventory');
    setSelectedAsset(null);
  };

  return (
    <div className="asset-mart-page min-h-screen">
      {/* Header Space - Only show in Main and Inventory */}
      {viewMode !== 'detail' && (
        <div className="container-centered pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Asset Mart</h1>
                <p className="text-sm text-gray-500">
                  {viewMode === 'main' ? 'ศูนย์กลางข้อมูลสินทรัพย์และการลงทุนระดับพรีเมียม' : `หมวดหมู่: ${selectedCategory}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="ค้นหาสินทรัพย์..." 
                  className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 w-64 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`asset-mart-container ${viewMode !== 'main' ? 'block' : ''}`}>
        
        {/* Step 2: Main Bento Grid with Follow List (60/40) */}
        {viewMode === 'main' && (
          <>
            <div className="mart-zone-1">
              <BentoGrid onSelect={handleCategorySelect} />
            </div>
            <div className="mart-zone-2">
              <FollowList />
            </div>
          </>
        )}

        {/* Step 3: Asset Inventory (Full Width) */}
        {viewMode === 'inventory' && selectedCategory && (
          <div className="w-full">
            <AssetInventory 
              category={selectedCategory} 
              onBack={handleBackToMain} 
              onSelectAsset={handleAssetSelect}
            />
          </div>
        )}

        {/* Step 4: Asset Detail (Full Width) */}
        {viewMode === 'detail' && selectedAsset && (
          <div className="w-full pt-10">
            <AssetDetail 
              asset={selectedAsset} 
              onBack={handleBackToInventory} 
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default AssetMart;
