import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AssetMart from './components/AssetMart';
import TLog from './components/TLog';
import './App.css';

export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  asset: string;
  category: string;
  amount: number;
  price: number;
  currency: 'THB' | 'USD';
  fee: number;
  notes: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('t-log');
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('alpha_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('alpha_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const importTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} />;
      case 'asset-mart':
        return <AssetMart />;
      case 't-log':
        return (
          <TLog 
            transactions={transactions} 
            onAdd={addTransaction} 
            onDelete={deleteTransaction}
            onImport={importTransactions}
          />
        );
      case 'goal':
        return (
          <div className="page-container goal-page">
            <div className="page-header">
              <div className="accent-bar"></div>
              <h2>เป้าหมาย <span className="sub-header">(Project Milestones)</span></h2>
            </div>
            
            <div className="milestone-grid">
              <div className="glass-panel milestone-card">
                <h3>🟢 Phase 1: Alpha (Current)</h3>
                <ul className="milestone-list">
                  <li className="done">Transaction Log (Add/History)</li>
                  <li className="done">Local Persistence (LocalStorage)</li>
                  <li className="done">CSV Export/Import</li>
                  <li className="done">Basic Interactive Dashboard</li>
                  <li>Responsive Scaling Polish</li>
                </ul>
              </div>

              <div className="glass-panel milestone-card muted">
                <h3>🟡 Phase 2: Demo</h3>
                <ul className="milestone-list">
                  <li>Asset Mart Data (Crypto/Stocks/Gold)</li>
                  <li>Real-time Price Integration (CoinGecko/Yahoo)</li>
                  <li>Multi-Dashboard (Drift System)</li>
                  <li>Bento Grid Categories</li>
                </ul>
              </div>

              <div className="glass-panel milestone-card muted">
                <h3>🔴 Phase 3: Beta</h3>
                <ul className="milestone-list">
                  <li>Full Asset Mart Inventory</li>
                  <li>Portfolio Intelligence (ROI/Cost Analysis)</li>
                  <li>Advanced Dashboard Interactions</li>
                  <li>Cloud Sync (Subscription Plan)</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div className="page-container">
          {renderContent()}
        </div>
      </main>

      {/* Floating Help Circle */}
      <button className="help-circle" title="Help">
        <span className="icon">?</span>
      </button>

      {/* Background decoration for Zen feel */}
      <div className="zen-glow top-left"></div>
      <div className="zen-glow bottom-right"></div>
    </div>
  );
}

export default App;
