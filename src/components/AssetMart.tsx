import React, { useState } from 'react';
import './AssetMart.css';

const AssetMart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿', size: 'large', desc: 'สินทรัพย์ดิจิทัลที่มีความผันผวนสูง' },
    { id: 'stocks', name: 'Stock Market', icon: '📈', size: 'medium', desc: 'หุ้นไทย และหุ้นต่างประเทศ' },
    { id: 'gold', name: 'Gold & Metal', icon: '🏆', size: 'small', desc: 'สินทรัพย์ปลอดภัย' },
    { id: 'funds', name: 'Mutual Funds', icon: '🏦', size: 'small', desc: 'กองทุนรวมและการออม' },
    { id: 'realestate', name: 'Real Estate', icon: '🏠', size: 'medium', desc: 'อสังหาริมทรัพย์และ REITs' },
  ];

  const mockInventory = [
    { name: 'Bitcoin', symbol: 'BTC', price: '฿2,450,900', roi: '+12.5%', volume: '1.2B' },
    { name: 'Ethereum', symbol: 'ETH', price: '฿85,200', roi: '+8.2%', volume: '600M' },
    { name: 'Solana', symbol: 'SOL', price: '฿4,500', roi: '+45.1%', volume: '300M' },
    { name: 'SET50 Index', symbol: 'SET50', price: '฿950.2', roi: '-1.4%', volume: '50M' },
    { name: 'Gold Spot', symbol: 'XAU', price: '฿34,500', roi: '+2.1%', volume: '120M' },
  ];

  return (
    <div className="asset-mart-page container-centered">
      <div className="page-header">
        <div className="accent-bar"></div>
        <h1>Asset Mart <span className="sub-header">(External Data Mart)</span></h1>
      </div>

      {!selectedCategory ? (
        <div className="bento-grid">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className={`bento-card glass-panel ${cat.size}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="card-bg-glow"></div>
              <div className="card-content">
                <span className="cat-icon">{cat.icon}</span>
                <div className="cat-info">
                  <h3>{cat.name}</h3>
                  <p>{cat.desc}</p>
                </div>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="inventory-view">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>← กลับไปหมวดหมู่</button>
          
          <div className="inventory-header glass-panel">
            <div className="info">
              <h2>{categories.find(c => c.id === selectedCategory)?.name}</h2>
              <p>แสดงรายการสินทรัพย์แบบ Real-time (Mock Data)</p>
            </div>
            <div className="stats">
              <span className="label">Total Assets:</span>
              <span className="value">124 Items</span>
            </div>
          </div>

          <div className="inventory-list">
            {mockInventory.map((item, i) => (
              <div key={i} className="inventory-item glass-panel">
                <div className="item-name">
                  <div className="token-icon">{item.symbol[0]}</div>
                  <div className="text">
                    <strong>{item.name}</strong>
                    <span>{item.symbol}</span>
                  </div>
                </div>
                <div className="item-price">{item.price}</div>
                <div className={`item-roi ${item.roi.startsWith('+') ? 'emerald-gradient-text' : 'neg'}`}>
                  {item.roi}
                </div>
                <div className="item-chart">
                  {/* Mock Mini Chart */}
                  <div className="mini-chart-svg"></div>
                </div>
                <button className="trade-btn">Detail</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetMart;
