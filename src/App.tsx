import { useState } from 'react';
import { TLogProvider } from './hooks/TLogManager';
import { QuickFillProvider } from './hooks/QuickFillManager';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AssetMart from './components/AssetMart/AssetMart';
import TLog from './components/TLog/TLog';
import SubscriptionJourney from './components/Subscription/SubscriptionJourney';
import MilestonesPage from './components/Milestones/MilestonesPage';
import QuickFillSetup from './components/TLog/QuickFillSetup';
import type { Transaction } from './types';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  
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
        return <MilestonesPage />;
      case 'plans':
        return (
          <SubscriptionJourney 
            currentPlanId={currentPlanId}
            onSubscriptionSuccess={(planId) => setCurrentPlanId(planId)}
            onComplete={() => setActiveTab('profile')} 
          />
        );
      case 'profile':
        return (
          <div className="page-container profile-page container-centered p-20 text-center">
            <div className="glass-panel p-10 rounded-3xl max-w-2xl mx-auto border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-full overflow-hidden border-4 border-[#0D0D0D]">
                  <img src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" alt="Avatar" />
                </div>
              </div>
              <h2 className="text-white text-3xl font-bold mb-2">User Profile</h2>
              <p className="text-emerald-400 font-medium mb-8">Premium Alpha Member ✨</p>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group relative">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Current Plan</div>
                  <div className="text-sm text-white">{currentPlanId ? currentPlanId.replace('plan-', '').replace('-', ' ').toUpperCase() : 'Free Account'}</div>
                  
                  {currentPlanId && (
                    <button 
                      onClick={() => setCurrentPlanId(null)}
                      className="absolute top-2 right-2 text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      title="Delete Current Plan"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  )}
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Status</div>
                  <div className={`text-sm ${currentPlanId ? 'text-emerald-400' : 'text-gray-400'}`}>
                    {currentPlanId ? 'Active' : 'Unsubscribed'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <TLogProvider>
      <QuickFillProvider>
        <div className="app-shell">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="main-content">
            {renderContent()}
          </main>

          {/* Zen Background Elements */}
          <div className="zen-glow top-left"></div>
          <div className="zen-glow bottom-right"></div>

          {/* Global Modals */}
          <QuickFillSetup />
        </div>
      </QuickFillProvider>
    </TLogProvider>
  );
}

export default App;
