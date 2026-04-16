import React from 'react';
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
  const categories: BentoCategory[] = [
    // Row 1
    { id: 'stocks', name: 'หุ้น', nameSub: 'Stocks', icon: <TrendingUp />, desc: 'หุ้นไทย และตลาดโลก' },
    { id: 'fixedincome', name: 'ตราสารหนี้', nameSub: 'Fixed Income', icon: <Landmark />, desc: 'พันธบัตรและหุ้นกู้' },
    { id: 'funds', name: 'กองทุนรวม', nameSub: 'Mutual Funds', icon: <Funds />, desc: 'การออมผ่านผู้เชี่ยวชาญ' },
    // Row 2
    { id: 'crypto', name: 'Cryptocurrency', nameSub: 'Digital Assets', icon: <Coins />, desc: 'Bitcoin และเหรียญทางเลือก' },
    { id: 'commodities', name: 'สินค้าโภคภัณฑ์', nameSub: 'Commodities', icon: <Waves />, desc: 'ทองคำ, น้ำมัน, แร่ธาตุ' },
    { id: 'realestate', name: 'อสังหาริมทรัพย์', nameSub: 'Real Estate', icon: <Home />, desc: 'ที่ดิน, อาคาร, REITs' },
    // Row 3
    { id: 'others', name: 'อื่นๆ', nameSub: 'Others', icon: <LayoutGrid />, desc: 'ทรัพย์สินทางเลือกและหมวดหมู่เพิ่มเติม', isLarge: true },
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
            {React.cloneElement(cat.icon as React.ReactElement, { size: 28 })}
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
