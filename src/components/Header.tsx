import React from 'react';
import { LayoutDashboard, ShoppingBag, ScrollText, Flag, Sparkles, Moon, User, Settings } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'asset-mart', label: 'Asset-Mart', icon: ShoppingBag },
    { id: 't-log', label: 'Transaction-Log', icon: ScrollText },
    { id: 'goal', label: 'เป้าหมาย', icon: Flag },
    { id: 'plans', label: '', icon: Sparkles, isIconOnly: true },
  ];

  return (
    <header className="global-header glass-panel">
      <div className="header-content container-centered">
        {/* ฝั่งซ้าย: Logo (Golden Version) */}
        <div className="logo-section" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-circle">
            <div className="logo-glow-core"></div>
            <span className="logo-char">A</span>
          </div>
          <div className="logo-text-stack">
            <span className="logo-top emerald-text">ALPHA</span>
            <span className="logo-bottom">SOLUTION</span>
          </div>
        </div>

        {/* ฝั่งขวา: Navi-bar + System Icons */}
        <div className="header-actions">
          <nav className="navi-bar-wrapper">
            <ul className="navi-bar">
              {navItems.map((item) => (
                <li 
                  key={item.id} 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'asset-mart') {
                      window.dispatchEvent(new Event('alpha_reset_asset_mart'));
                    }
                  }}
                >
                  <div className="nav-item-content">
                    {item.isIconOnly ? (
                      <item.icon size={20} className="plan-sparkle-icon" />
                    ) : (
                      <span className="nav-label">{item.label}</span>
                    )}
                  </div>
                  {activeTab === item.id && !item.isIconOnly && <div className="nav-underline"></div>}
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-vertical-divider"></div>

          <div className="system-utilities">
            <button className="util-btn theme-btn" title="Toggle Theme">
              <Moon size={18} />
            </button>
            <button className="util-btn profile-btn" title="Profile">
              <User size={18} />
            </button>
            <button className="util-btn settings-btn" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
