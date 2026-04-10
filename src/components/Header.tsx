import React from 'react';
import './Header.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', th: 'แผงควบคุม' },
    { id: 'asset-mart', label: 'Asset Mart', th: 'ตลาดสินทรัพย์' },
    { id: 't-log', label: 'Transaction-Log', th: 'ประวัติสินทรัพย์' },
    { id: 'goal', label: 'เป้าหมาย', th: 'เป้าหมาย' },
  ];

  return (
    <header className="global-header glass-panel">
      <div className="header-content">
        <div className="logo-section" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-icon">A</div>
          <span className="logo-text">The Alpha <span className="emerald-text">Solution</span></span>
        </div>

        <nav className="navi-bar-container">
          <ul className="navi-bar">
            {navItems.map((item) => (
              <li 
                key={item.id} 
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-label-en">{item.label}</span>
                <span className="nav-label-th">{item.th}</span>
              </li>
            ))}
          </ul>

          <div className="nav-divider"></div>

          <div className="system-utilities">
            <button className="util-btn plan-btn" title="Subscription Plans">
              <span className="icon">✨</span>
            </button>
            <button className="util-btn theme-btn" title="Toggle Theme">
              <span className="icon">🌙</span>
            </button>
            <button className="util-btn profile-btn" title="Profile">
              <span className="icon">👤</span>
            </button>
            <button className="util-btn settings-btn" title="Settings">
              <span className="icon">⚙️</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
