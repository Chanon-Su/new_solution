import React, { useState } from 'react';
import './AssetMart.css';

const AssetMart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'stocks', label: 'หุ้น (Stocks)', count: 120, size: 'large', color: '#3b82f6' },
    { id: 'crypto', label: 'Crypto', count: 450, size: 'medium', color: '#10b981' },
    { id: 'gold', label: 'ทองคำ (Gold)', count: 2, size: 'small', color: '#fbbf24' },
    { id: 'funds', label: 'กองทุน (Funds)', count: 85, size: 'small', color: '#a855f7' },
    { id: 'real-estate', label: 'อสังหาฯ', count: 5, size: 'medium', color: '#f97316' },
    { id: 'others', label: 'อื่นๆ', count: 12, size: 'small', color: '#9ca3af' },
  ];

  if (selectedCategory) {
    return (
      <div className="asset-mart-page">
        <button className="back-btn" onClick={() => setSelectedCategory(null)}>← กลับไปหน้าหมวดหมู่</button>
        <div className="category-detail">
          <h1>{categories.find(c => c.id === selectedCategory)?.label}</h1>
          <div className="asset-list glass-panel">
            <p className="placeholder-text">กำลังโหลดข้อมูลสินทรัพย์จาก API...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-mart-page">
      <div className="page-header">
        <div className="accent-bar"></div>
        <h2>หมวดหมู่สินทรัพย์ <span className="sub-header">(Asset Categories)</span></h2>
      </div>

      <div className="bento-grid">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className={`bento-item ${cat.size}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ '--accent-color': cat.color } as React.CSSProperties}
          >
            <div className="bento-content">
              <span className="cat-count">{cat.count} รายการ</span>
              <h3>{cat.label}</h3>
              <div className="bento-bg-icon">💎</div>
            </div>
            <div className="bento-footer">
              <span>สำรวจเลย →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetMart;
