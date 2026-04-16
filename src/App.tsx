import { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AssetMart from './components/AssetMart/AssetMart';
import TLog from './components/TLog/TLog';
import type { Transaction } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock Data สำหรับงาน UI
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'asset-mart':
        return <AssetMart />;
      case 't-log':
        return <TLog />;
      case 'goal':
        return (
          <div className="page-container goal-page container-centered p-20 text-center">
            <h2 className="emerald-gradient-text text-4xl font-bold mb-4">Project Milestones</h2>
            <p className="text-gray-400">ระบบติดตามความคืบหน้าของโปรเจกต์ (Coming Soon)</p>
          </div>
        );
      case 'plans':
        return (
          <div className="page-container plans-page container-centered p-20 text-center">
            <div className="glass-panel p-10 rounded-3xl max-w-2xl mx-auto">
              <h2 className="text-emerald-400 text-3xl font-bold mb-6">Subscription Plans ✨</h2>
              <p className="text-gray-400 mb-8">เข้าถึงฟีเจอร์ Cloud Sync และระบบจัดการระดับสูงสำหรับผู้ใช้งานระดับโปร</p>
              <button className="submit-btn-emerald py-3 px-10 rounded-full">Explore Premium</button>
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
        {renderContent()}
      </main>

      {/* Zen Background Elements */}
      <div className="zen-glow top-left"></div>
      <div className="zen-glow bottom-right"></div>
    </div>
  );
}

export default App;
