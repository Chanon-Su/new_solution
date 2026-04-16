import React from 'react';
import { useTLog } from '../../hooks/TLogManager';
import { Plus } from 'lucide-react';

const TLog_zone2_Summary: React.FC = () => {
  const { assetSummaries, isLoading } = useTLog();

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
    <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="mb-0">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
          <h2 className="text-2xl font-semibold text-white tracking-tight font-inter">สรุปสินทรัพย์</h2>
        </div>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {assetSummaries.length > 0 ? (
          assetSummaries.map((asset) => (
            <div key={asset.symbol} className="min-w-[260px] bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 transition-all duration-300 hover:border-[#10B981] hover:bg-[rgba(18,18,20,0.95)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group">
              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-lg text-white group-hover:text-[#10B981] transition-all duration-300 tracking-tight">{asset.symbol}</span>
                <span className="text-[10px] text-[#9CA3AF] opacity-40 font-medium whitespace-nowrap">
                  LATEST: {asset.lastUpdate ? new Date(asset.lastUpdate).toLocaleDateString('en-GB') : '-'}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1 text-white flex items-baseline gap-2 tracking-tighter">
                {(asset.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })} 
                <span className="text-[12px] text-[#9CA3AF] font-bold uppercase italic tracking-widest opacity-40">units</span>
              </div>
            </div>
          ))
        ) : (
          /* Placeholder Card when empty */
          <div className="min-w-[260px] h-[132px] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-[#10B981]/20 transition-all duration-500">
            <div className="w-10 h-10 rounded-full bg-white/[0.02] flex items-center justify-center group-hover:bg-[#10B981]/5 transition-all duration-500">
              <Plus size={18} className="text-[#9CA3AF] opacity-20 group-hover:text-[#10B981] group-hover:opacity-100 transition-all duration-500" />
            </div>
            <span className="text-[13px] text-[#9CA3AF] font-medium opacity-20 group-hover:opacity-60 transition-all duration-500">ยังไม่มีข้อมูลสินทรัพย์</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TLog_zone2_Summary;
