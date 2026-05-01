import React from 'react';
import { useTLog } from '../../hooks/TLogManager';
import { useSettings } from '../../hooks/SettingsManager';
import { Plus } from 'lucide-react';

const TLog_zone2_Summary: React.FC = () => {
  const { assetSummaries, isLoading } = useTLog();
  const { privacyHideNumbers, privacyHideText } = useSettings();

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return '-';
    const now = new Date();
    const past = new Date(dateStr);
    if (isNaN(past.getTime())) return '-';
    
    const diffInMs = now.getTime() - past.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    if (diffInHours < 24) return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return past.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-6 bg-[#10B981] rounded-sm animate-pulse"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight opacity-50 font-inter">กำลังโหลด...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 px-1">
        <div className="w-1 h-5 bg-[#10B981] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
        <h2 className="text-xl font-bold text-white tracking-tight font-inter">สรุปสินทรัพย์</h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {assetSummaries.length > 0 ? (
          assetSummaries.map((asset) => (
            <div 
              key={asset.symbol} 
              className="min-w-[220px] bg-[#121214] border border-white/[0.04] rounded-2xl p-5 transition-all duration-300 hover:border-[#10B981]/30 hover:bg-[#161618] group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-bold text-[15px] text-white group-hover:text-[#10B981] transition-colors">
                  {privacyHideText ? '********' : asset.symbol}
                </span>
                <span className="text-[10px] text-[#9CA3AF] opacity-40 font-medium">{formatRelativeTime(asset.lastUpdate)}</span>
              </div>

              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-2xl font-bold text-white tracking-tighter">
                  {privacyHideNumbers 
                    ? '********'
                    : (asset.amount > 0 
                        ? asset.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 4 })
                        : (asset.latestDividendPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })
                      )
                  }
                </span>
                <span className="text-[11px] text-[#9CA3AF] font-bold opacity-30 uppercase tracking-widest">
                  {asset.amount > 0 ? 'units' : 'div/sh'}
                </span>
              </div>

              {asset.hasDividends && asset.amount > 0 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.03]">
                  <span className="text-[9px] text-[#9CA3AF] font-bold uppercase opacity-30 tracking-tighter">Avg Div:</span>
                  <span className="text-[10px] text-[#10B981] font-mono font-bold">
                    {privacyHideNumbers ? '********' : asset.avgDividend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="min-w-[220px] h-[100px] border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-[#10B981]/20 transition-all duration-500">
            <Plus size={16} className="text-[#9CA3AF] opacity-20 group-hover:text-[#10B981] group-hover:opacity-100 transition-all duration-500" />
            <span className="text-[11px] text-[#9CA3AF] font-medium opacity-20">ยังไม่มีข้อมูล</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TLog_zone2_Summary;
