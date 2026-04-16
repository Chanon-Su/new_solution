import React, { useState, useEffect } from 'react';
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

  // Reset logic when clicking Asset Mart in Navigator
  useEffect(() => {
    const handleReset = () => {
      setViewMode('main');
      setSelectedCategory(null);
      setSelectedAsset(null);
    };

    window.addEventListener('planto_reset_asset_mart', handleReset);
    return () => window.removeEventListener('planto_reset_asset_mart', handleReset);
  }, []);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setViewMode('inventory');
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewMode('detail');
  };

  const handleShowAllAssets = () => {
    setSelectedCategory('all');
    setViewMode('inventory');
  };

  const handleBackToMain = () => {
    setViewMode('main');
    setSelectedCategory(null);
  };

  const handleBackToInventory = () => {
    setViewMode('inventory');
    setSelectedAsset(null);
  };

  const isMainView = viewMode === 'main';

  return (
    <div className={`asset-mart-page pt-4 ${isMainView ? 'h-[calc(100vh-var(--header-height))] overflow-hidden' : 'min-h-screen'}`}>
      {/* Main Content Area */}
      <div className={`asset-mart-container ${isMainView ? 'is-main-view' : 'block'}`}>
        
        {/* Step 2: Main Bento Grid with Follow List (60/40) */}
        {viewMode === 'main' && (
          <>
            <div className="mart-zone-1">
              {/* Relocated Search Section */}
              <div className="search-zone-main mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="ค้นหาสินทรัพย์..." 
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 w-full transition-all"
                  />
                </div>
              </div>
              <BentoGrid onSelect={handleCategorySelect} />
            </div>
            <div className="mart-zone-2">
              <FollowList 
                onSelectAsset={handleAssetSelect} 
                onExplore={handleShowAllAssets}
              />
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
