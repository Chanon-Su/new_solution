import React from 'react';

interface AssetSummary {
  id: string;
  symbol: string;
  amount: string;
  lastUpdate: string;
}

const TLog_zone2_Summary: React.FC = () => {
  const mockAssetSummary: AssetSummary[] = [
    { id: '1', symbol: 'BTC', amount: '0.0520', lastUpdate: '1 hr ago' },
    { id: '2', symbol: 'AAPL', amount: '15.00', lastUpdate: '2 hrs ago' },
    { id: '3', symbol: 'ETH', amount: '1.2500', lastUpdate: '5 mins ago' },
    { id: '4', symbol: 'GOLD', amount: '10.5g', lastUpdate: 'Yesterday' },
    { id: '5', symbol: 'MSFT', amount: '2.00', lastUpdate: '2 days ago' },
    { id: '6', symbol: 'NVDA', amount: '10.00', lastUpdate: '3 hrs ago' },
  ];

  return (
    <section className="tlog-section">
      <div className="tlog-section-header">
        <div className="tlog-title-wrapper">
          <div className="tlog-accent-bar"></div>
          <h2 className="tlog-section-title">สรุปสินทรัพย์</h2>
        </div>
      </div>

      <div className="tlog-summary-carousel">
        {mockAssetSummary.map((asset) => (
          <div key={asset.id} className="summary-card">
            <div className="summary-card-header">
              <span className="asset-symbol">{asset.symbol}</span>
              <span className="update-label">{asset.lastUpdate}</span>
            </div>
            <div className="asset-value">
              {asset.amount} <span className="units-label">units</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TLog_zone2_Summary;
