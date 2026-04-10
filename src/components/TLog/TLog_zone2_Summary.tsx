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
    <section className="flex flex-col gap-5">
      <div className="mb-0">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">สรุปสินทรัพย์</h2>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mockAssetSummary.map((asset) => (
          <div key={asset.id} className="min-w-[240px] bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all duration-200 hover:border-[#10B981] hover:bg-[rgba(18,18,20,0.95)]">
            <div className="flex justify-between items-center mb-5">
              <span className="font-bold text-lg text-white">{asset.symbol}</span>
              <span className="text-xs text-[#9CA3AF]">{asset.lastUpdate}</span>
            </div>
            <div className="text-3xl font-semibold mb-1 text-white">
              {asset.amount} <span className="text-[13px] text-[#9CA3AF] font-normal">units</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TLog_zone2_Summary;
