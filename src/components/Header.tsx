import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, ScrollText, Flag, Sparkles, Moon, Sun, User, Settings, Plus, BarChart3 } from 'lucide-react';
import { useQuickFill } from '../hooks/QuickFillManager';
import { useSettings } from '../hooks/SettingsManager';
import { translations } from '../utils/translations';
import './Header.css';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { quickFills, applyQuickFill } = useQuickFill();
  const { language, theme, setTheme } = useSettings();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const t = translations[language] || translations.th;

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'asset-mart', label: t.nav.assetMart, icon: ShoppingBag },
    { id: 't-log', label: t.nav.tlog, icon: ScrollText },
    { id: 'insight-port', label: t.nav.insight, icon: BarChart3 },
    { id: 'goal', label: t.nav.goal, icon: Flag },
    { id: 'plans', label: '', icon: Sparkles, isIconOnly: true },
  ];

  return (
    <header className="global-header glass-panel">
      <div className="header-content container-centered">
        {/* ฝั่งซ้าย: Logo (PLANTO Edition) */}
        <div className="logo-section" onClick={() => setActiveTab('dashboard')}>
          <div className="logo-circle">
            <div className="logo-glow-core"></div>
            <div className="logo-placeholder-icon">P</div>
          </div>
          <div className="logo-text-stack">
            <span className="logo-main emerald-text">PLANTO</span>
          </div>
        </div>

        {/* ฝั่งขวา: Navi-bar + System Icons */}
        <div className="header-actions">
          <nav className="navi-bar-wrapper">
            <ul className="navi-bar">
              {navItems.map((item) => (
                <li 
                  key={item.id} 
                  className={`nav-item ${activeTab === item.id ? 'active' : ''} ${item.id === 't-log' ? 'nav-item-quickfill' : ''}`}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (item.id === 'asset-mart') {
                      window.dispatchEvent(new Event('planto_reset_asset_mart'));
                    }
                    if (item.id === 'goal') {
                      window.dispatchEvent(new Event('planto_reset_milestones'));
                    }
                    if (item.id === 'plans') {
                      window.dispatchEvent(new Event('planto_reset_subscription'));
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

                  {item.id === 't-log' && hoveredItem === 't-log' && (
                    <div className="quickfill-dropdown glass-panel">
                      <div className="quickfill-list">
                        {quickFills.length === 0 ? (
                          <div className="quickfill-empty-state">
                            <div className="qf-empty-icon">
                              <Plus size={24} />
                            </div>
                            <span className="qf-empty-text">ยังไม่มีรายการด่วน</span>
                            <span className="qf-empty-sub">บันทึกรายการประจำเพื่อการกรอกที่รวดเร็วขึ้น</span>
                          </div>
                        ) : (
                          quickFills.map((qf) => (
                            <div 
                              key={qf.id} 
                              className="quickfill-item"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab('t-log');
                                applyQuickFill(qf);
                              }}
                            >
                              <div className="quickfill-item-content">
                                {qf.icon && qf.icon.length > 2 ? (
                                 <div className="qf-logo-circle">
                                   {qf.icon.substring(0, 1).toUpperCase()}
                                 </div>
                                ) : (
                                  <span className="qf-icon">{qf.icon || '📝'}</span>
                                )}
                                <div className="qf-info">
                                  <span className="qf-name">{qf.name}</span>
                                  {qf.asset && <span className="qf-asset-tag">{qf.asset}</span>}
                                </div>
                              </div>
                              <button 
                                className="qf-settings-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.dispatchEvent(new CustomEvent('planto_open_quickfill_setup', { detail: qf }));
                                }}
                              >
                                <Settings size={14} />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      <div 
                        className="quickfill-add-new"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.dispatchEvent(new Event('planto_open_quickfill_setup'));
                        }}
                      >
                        <Plus size={14} />
                        <span>เพิ่มรายการด่วนใหม่</span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-vertical-divider"></div>

          <div className="system-utilities">
            <button 
              className="util-btn theme-btn" 
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button 
              className="util-btn profile-btn" 
              title="Profile"
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
            </button>
            <button 
              className={`util-btn settings-btn ${activeTab === 'settings' ? 'active' : ''}`}
              title="Settings"
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
