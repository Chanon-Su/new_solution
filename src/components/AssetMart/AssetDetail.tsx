import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import { ArrowLeft, ExternalLink, Calendar, Info, TrendingUp, DollarSign, Activity, FileText, Heart } from 'lucide-react';

interface AssetDetailProps {
  asset: {
    id: string; // Add ID to asset for tracking
    name: string;
    symbol: string;
    price: string;
    roi: string;
    isUp: boolean;
    change?: string;
    category: string;
  };
  onBack: () => void;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ asset, onBack }) => {
  const { language } = useSettings();
  const t = translations[language].assetMart.detail;
  const [isFollowed, setIsFollowed] = useState(false);

  // Check if followed on mount
  useEffect(() => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    if (followedStr) {
      const followed = JSON.parse(followedStr);
      setIsFollowed(followed.some((a: any) => a.id === asset.id));
    }
  }, [asset.id]);

  const toggleFollow = () => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    let followed = followedStr ? JSON.parse(followedStr) : [];
    
    if (isFollowed) {
      followed = followed.filter((a: any) => a.id !== asset.id);
      setIsFollowed(false);
    } else {
      // Normalize data for calculation and display
      followed.push({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        price: parseFloat(asset.price.replace(/[^\d.]/g, '')), // Raw number for calculation
        displayPrice: asset.price, // Formatted string for UI
        change: asset.roi,
        isUp: asset.isUp,
        category: asset.category
      });
      setIsFollowed(true);
    }
    
    localStorage.setItem('planto_followed_assets', JSON.stringify(followed));
    // Dispatch custom event to notify FollowList
    window.dispatchEvent(new Event('followStateChanged'));
  };

  return (
    <div className="asset-detail-container">
      {/* Navigation & Header */}
      <div className="mb-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        
        <div className="detail-identity-section">
          <div className="detail-logo-large">
            {asset.symbol[0]}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-extrabold text-white tracking-tighter">{asset.name}</h1>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 font-mono">
                {asset.symbol}
              </span>
            </div>
            <p className="text-gray-500 mt-2 font-medium">{t.tags}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
              <ExternalLink className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleFollow}
              className={`submit-btn-emerald px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 ${
                isFollowed 
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-emerald-500/50 hover:text-emerald-400'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFollowed ? 'fill-current' : ''}`} />
              {isFollowed ? t.following : t.follow}
            </button>
          </div>
        </div>
      </div>

      {/* Core Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <span className="label">{t.metrics.price}</span>
            {asset.category === 'FOREX' ? <Activity className="w-4 h-4 text-emerald-500" /> : <DollarSign className="w-4 h-4 text-emerald-500" />}
          </div>
          <p className="value">{asset.price}</p>
          <p className={`text-xs mt-2 font-bold ${asset.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {asset.category === 'FOREX' 
              ? `${asset.isUp ? '+' : ''}${asset.change || '0.00'} (${asset.roi})`
              : asset.isUp ? '+$420.50 (2.4%)' : '-$120.30 (1.1%)'}
          </p>
        </div>
        
        <div className="metric-card">
          <div className="flex justify-between items-start">
            <span className="label">{asset.category === 'FOREX' ? t.metrics.high24h : t.metrics.marketCap}</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="value">{asset.category === 'FOREX' ? '36.52' : '$1.24T'}</p>
          <p className="text-xs text-gray-500 mt-2">{asset.category === 'FOREX' ? t.metrics.peak : t.metrics.rank}</p>
        </div>

        <div className="metric-card">
          <div className="flex justify-between items-start">
            <span className="label">{asset.category === 'FOREX' ? t.metrics.low24h : t.metrics.costBasis}</span>
            <Info className="w-4 h-4 text-blue-500" />
          </div>
          <p className="value">{asset.category === 'FOREX' ? '36.38' : '$58,400.00'}</p>
          <p className="text-xs text-emerald-400 mt-2">{asset.category === 'FOREX' ? t.metrics.floor : t.metrics.divAdj}</p>
        </div>

        <div className="metric-card overflow-hidden relative">
          <div className="flex justify-between items-start relative z-10">
            <span className="label">{t.metrics.totalRoi}</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="value relative z-10">{asset.roi}</p>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <p className="text-xs text-gray-500 mt-2 relative z-10">{t.metrics.historical}</p>
        </div>
      </div>

      {/* Visualizer (Historical Chart) */}
      <div className="visualizer-card">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-bold">{t.visualizer.title}</h3>
          </div>
          <div className="time-range-selector">
            <button className="range-btn">1D</button>
            <button className="range-btn">1W</button>
            <button className="range-btn active">1M</button>
            <button className="range-btn">1Y</button>
            <button className="range-btn">ALL</button>
          </div>
        </div>

        <div className="chart-placeholder">
          <div className="chart-path"></div>
          {/* Mock Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-white"></div>)}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h4 className="font-bold">{t.visualizer.analysis}</h4>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {asset.category === 'FOREX' 
                ? t.visualizer.forexDesc
                : t.visualizer.defaultDesc}
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <h4 className="font-bold mb-4">{t.visualizer.sentiment}</h4>
            <div className="flex items-center gap-12 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase">{t.visualizer.fearGreed}</p>
                <p className="text-2xl font-bold text-emerald-400">74 (Greed)</p>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <p className="text-xs text-gray-500 mb-1 uppercase">{t.visualizer.volatility}</p>
                <p className="text-2xl font-bold text-blue-400">{t.visualizer.volMedium}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
