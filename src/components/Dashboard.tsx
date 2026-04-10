import React, { useState, useMemo, useEffect } from 'react';
import { Transaction } from '../App';
import './Dashboard.css';

interface Block {
  id: string;
  type: 'total-value' | 'allocation' | 'history' | 'placeholder';
  x: number;
  y: number;
  w: number;
  h: number;
  screen: number;
}

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 3;

  const [blocks, setBlocks] = useState<Block[]>(() => {
    const saved = localStorage.getItem('alpha_dashboard_blocks');
    if (saved) return JSON.parse(saved);
    
    // Default blocks
    return [
      { id: '1', type: 'allocation', x: 2, y: 2, w: 8, h: 6, screen: 0 },
      { id: '2', type: 'total-value', x: 11, y: 2, w: 8, h: 4, screen: 0 },
      { id: '3', type: 'history', x: 11, y: 7, w: 8, h: 8, screen: 0 },
    ];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('alpha_dashboard_blocks', JSON.stringify(blocks));
  }, [blocks]);

  // Data Calculations
  const portfolioStats = useMemo(() => {
    const summary: Record<string, number> = {};
    let totalTHB = 0;
    
    transactions.forEach(tx => {
      // Mock price logic for now (current price = last price paid)
      // In real app, this would come from Asset Mart API
      const amt = Number(tx.amount);
      const isBuy = tx.type === 'BUY' || tx.type === 'DIVIDEND';
      const weight = isBuy ? 1 : -1;
      
      if (!summary[tx.asset]) summary[tx.asset] = 0;
      summary[tx.asset] += amt * weight;
      
      // We'll just sum all absolute values for a mock total
      // In reality, we need current prices.
      if (tx.currency === 'THB') {
        totalTHB += amt * weight * tx.price;
      } else {
        totalTHB += amt * weight * tx.price * 35; // Mock USD/THB
      }
    });

    return {
      totalValue: totalTHB,
      allocation: Object.entries(summary)
        .filter(([_, amt]) => amt > 0)
        .map(([asset, amt]) => ({ name: asset, value: amt }))
    };
  }, [transactions]);

  const handleNext = () => {
    if (currentScreen < totalScreens - 1) setCurrentScreen(currentScreen + 1);
  };

  const handlePrev = () => {
    if (currentScreen > 0) setCurrentScreen(currentScreen - 1);
  };

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      x: 1, y: 1, w: 4, h: 4,
      screen: currentScreen
    };
    setBlocks([...blocks, newBlock]);
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const renderBlockContent = (block: Block) => {
    switch (block.type) {
      case 'total-value':
        return (
          <div className="vis-content">
            <div className="vis-header">Portfolio Value (THB)</div>
            <div className="vis-body value-display">
              <div className="total-value">฿{portfolioStats.totalValue.toLocaleString()}</div>
              <div className="value-change positive">ยอดรวมประเมินจากราคาทุน</div>
            </div>
          </div>
        );
      case 'allocation':
        return (
          <div className="vis-content">
            <div className="vis-header">Asset Allocation</div>
            <div className="vis-body pie-placeholder">
              <div className="chart-circle" style={{
                background: `conic-gradient(var(--neon-emerald) 0% 60%, #3b82f6 60% 85%, #fbbf24 85% 100%)`
              }}></div>
              <div className="chart-legend">
                {portfolioStats.allocation.slice(0, 3).map((item, i) => (
                  <div key={item.name} className="legend-item">
                    <span className={`dot ${i===0?'crypto':i===1?'stocks':'gold'}`}></span> {item.name}
                  </div>
                ))}
                {portfolioStats.allocation.length === 0 && <div className="muted-text">เพิ่มธุรกรรมเพื่อสรุปผล</div>}
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="vis-content">
            <div className="vis-header">Recent Activity</div>
            <div className="vis-body simple-list">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="list-item">
                  <span>{tx.type} {tx.asset}</span>
                  <span className={tx.type==='SELL'?'negative':'positive'}>
                    {tx.type==='SELL'?'-':'+'} {tx.amount}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && <div className="muted-text">ไม่มีประวัติ</div>}
            </div>
          </div>
        );
      default:
        return <div className="vis-content"><div className="vis-header">Placeholder</div></div>;
    }
  };

  return (
    <div className={`dashboard-page ${isEditMode ? 'edit-mode' : ''}`}>
      {/* Dashboard Controls */}
      <div className="dashboard-controls">
        <button 
          className={`edit-toggle-btn ${isEditMode ? 'active' : ''}`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? '✅ บันทึก Layout' : '✏️ แก้ไข Layout'}
        </button>
        {isEditMode && (
          <div className="edit-actions">
            <button className="edit-action-btn" onClick={() => addBlock('allocation')}>➕ เพิ่ม Block</button>
            <button className="edit-action-btn" onClick={() => alert('Grid config coming soon')}>📐 ปรับ Grid</button>
          </div>
        )}
      </div>

      {/* Drift Viewport */}
      <div className="drift-viewport">
        <div 
          className="drift-container" 
          style={{ transform: `translateX(-${currentScreen * 100}%)` }}
        >
          {[0, 1, 2].map((screenIndex) => (
            <div key={screenIndex} className="dashboard-grid-view">
              <div className="grid-background">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="grid-line line-v"></div>
                ))}
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="grid-line line-h" style={{ top: `${(i/16)*100}%` }}></div>
                ))}
              </div>

              {blocks
                .filter(b => b.screen === screenIndex)
                .map(block => (
                  <div 
                    key={block.id} 
                    className="vis-block" 
                    style={{ 
                      gridArea: `${block.y} / ${block.x} / ${block.y + block.h} / ${block.x + block.w}` 
                    }}
                  >
                    {renderBlockContent(block)}
                    {isEditMode && (
                      <button 
                        className="delete-block-btn" 
                        onClick={() => deleteBlock(block.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

              {blocks.filter(b => b.screen === screenIndex).length === 0 && !isEditMode && (
                <div className="empty-grid-msg">
                  <span className="plus-icon-large">+</span>
                  <p>หน้านี้ยังว่างอยู่ กด "แก้ไข Layout" เพื่อเริ่มต้น</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ghost Arrows */}
        <button 
          className={`ghost-arrow left ${currentScreen === 0 ? 'hidden' : ''}`}
          onClick={handlePrev}
        >
          ‹
        </button>
        <button 
          className={`ghost-arrow right ${currentScreen === totalScreens - 1 ? 'hidden' : ''}`}
          onClick={handleNext}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
