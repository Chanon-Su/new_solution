import React from 'react';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import { TrendingUp, Landmark, Landmark as Funds, Coins, Waves, Home, LayoutGrid } from 'lucide-react';

interface BentoCategory {
  id: string;
  name: string;
  nameSub: string;
  icon: React.ReactNode;
  desc: string;
  isLarge?: boolean;
}

const BentoGrid: React.FC<{ onSelect: (id: string) => void }> = ({ onSelect }) => {
  const { language } = useSettings();
  const t = translations[language].assetMart.categories;

  const categories: BentoCategory[] = [
    // Row 1
    { id: 'stocks', name: t.stocks.name, nameSub: 'Stocks', icon: <TrendingUp />, desc: t.stocks.desc },
    { id: 'fixedincome', name: t.fixedincome.name, nameSub: 'Fixed Income', icon: <Landmark />, desc: t.fixedincome.desc },
    { id: 'funds', name: t.funds.name, nameSub: 'Mutual Funds', icon: <Funds />, desc: t.funds.desc },
    // Row 2
    { id: 'crypto', name: t.crypto.name, nameSub: 'Digital Assets', icon: <Coins />, desc: t.crypto.desc },
    { id: 'commodities', name: t.commodities.name, nameSub: 'Commodities', icon: <Waves />, desc: t.commodities.desc },
    { id: 'realestate', name: t.realestate.name, nameSub: 'Real Estate', icon: <Home />, desc: t.realestate.desc },
    // Row 3
    { id: 'others', name: t.others.name, nameSub: 'Others', icon: <LayoutGrid />, desc: t.others.desc, isLarge: true },
  ];

  return (
    <div className="bento-grid-container">
      {categories.map((cat) => (
        <div 
          key={cat.id} 
          className={`bento-card ${cat.isLarge ? 'others-card' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          <div className="bento-icon-wrapper">
            {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 28 })}
          </div>
          <div className="bento-info">
            <h3>{cat.name} <span className="text-xs text-gray-500 font-normal uppercase tracking-wider ml-1">[{cat.nameSub}]</span></h3>
            <p>{cat.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;
