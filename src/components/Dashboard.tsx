import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState(0);
  const totalScreens = 3;

  const screens = [
    { id: 0, title: 'ภาพรวมพอร์ตหลัก (Main Portfolio)' },
    { id: 1, title: 'วิเคราะห์รายสินทรัพย์ (Asset Deep Dive)' },
    { id: 2, title: 'แนวโน้มและบันทึก (Trends & Logs)' },
  ];

  const handleNext = () => setActiveScreen((prev) => Math.min(prev + 1, totalScreens - 1));
  const handlePrev = () => setActiveScreen((prev) => Math.max(prev - 1, 0));

  return (
    <div className="dashboard-page">
      {/* Ghost Arrows: จะปรากฏเมื่อนำเมาส์ไปวางใกล้ขอบจอ */}
      <div className={`ghost-nav left ${activeScreen === 0 ? 'disabled' : ''}`} onClick={handlePrev}>
        <div className="arrow-icon">‹</div>
      </div>
      <div className={`ghost-nav right ${activeScreen === totalScreens - 1 ? 'disabled' : ''}`} onClick={handleNext}>
        <div className="arrow-icon">›</div>
      </div>

      <div 
        className="drift-viewport" 
        style={{ transform: `translateX(-${activeScreen * 100}vw)` }}
      >
        {screens.map((screen) => (
          <div key={screen.id} className="drift-screen">
            <div className="screen-content container-centered">
              <div className="screen-header">
                <div className="accent-bar"></div>
                <h2>{screen.title}</h2>
              </div>

              {/* Grid System (20x16 Mock) */}
              <div className="dashboard-grid-layout">
                {screen.id === 0 && (
                  <>
                    <div className="vis-block pot size-large" style={{ gridArea: '2 / 2 / span 6 / span 8' }}>
                      <div className="vis-tree allocation-chart">
                        <div className="vis-label">Asset Allocation</div>
                        <div className="chart-placeholder">
                          <div className="inner-glow"></div>
                        </div>
                      </div>
                    </div>

                    <div className="vis-block pot size-medium" style={{ gridArea: '2 / 11 / span 4 / span 8' }}>
                      <div className="vis-tree total-value">
                        <div className="vis-label">Total Portfolio Value</div>
                        <div className="big-number">฿2,450,900<span className="unit">.00</span></div>
                        <div className="trend positive">+4.2% (24h)</div>
                      </div>
                    </div>

                    <div className="vis-block pot size-tall" style={{ gridArea: '7 / 11 / span 8 / span 8' }}>
                      <div className="vis-tree activity-list">
                        <div className="vis-label">Recent Activity</div>
                        <div className="mock-list">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="mock-item">
                              <span className="dot"></span>
                              <span className="desc">Bought BTC-THB</span>
                              <span className="val">+0.005</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {screen.id !== 0 && (
                  <div className="empty-state-zen">
                    <p>Grid Screen {screen.id + 1} - Obsidian Void</p>
                    <span className="hint">เริ่มจัดสวนของคุณได้ในโหมดแก้ไขเร็วๆ นี้</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
