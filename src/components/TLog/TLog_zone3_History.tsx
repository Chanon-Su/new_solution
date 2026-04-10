import React, { useState } from 'react';
import { 
  MessageSquare, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Bitcoin,
  Apple,
  Cpu
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  category: string;
  asset: string;
  symbol: string;
  amount: string;
  price: string;
  total: string;
  icon: any;
  iconColor: string;
}

const TLog_zone3_History: React.FC = () => {
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const mockTransactions: Transaction[] = [
    { 
      id: '1', 
      date: '08-Apr-2026', 
      type: 'BUY', 
      category: 'Crypto', 
      asset: 'Bitcoin', 
      symbol: 'BTC', 
      amount: '0.0520', 
      price: '$64,250.00', 
      total: '$3,341.00',
      icon: Bitcoin,
      iconColor: '#f59e0b'
    },
    { 
      id: '2', 
      date: '07-Apr-2026', 
      type: 'BUY', 
      category: 'Stock', 
      asset: 'Apple Inc.', 
      symbol: 'AAPL', 
      amount: '15.00', 
      price: '$168.45', 
      total: '$2,526.75',
      icon: Apple,
      iconColor: '#FFFFFF'
    },
    { 
      id: '3', 
      date: '06-Apr-2026', 
      type: 'BUY', 
      category: 'Crypto', 
      asset: 'Ethereum', 
      symbol: 'ETH', 
      amount: '1.2500', 
      price: '$3,450.10', 
      total: '$4,312.62',
      icon: Cpu,
      iconColor: '#6366f1'
    },
  ];

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden p-8">
        <div className="mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">ประวัติสินทรัพย์ (Asset History)</h2>
            </div>
            <p className="text-[#9CA3AF] text-[15px] opacity-60 ml-5 pt-1">ทุกรายการคือเมล็ดพันธุ์ ทุกบันทึกคือรากฐาน</p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">วันที่</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">ประเภท</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">ประเภท (CATEGORY)</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">สินทรัพย์</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">จำนวน</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">ราคา (USD)</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">มูลค่ารวม</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">โน้ต</th>
                <th className="text-left px-5 py-4 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-white/5">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="group">
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] text-white font-normal group-last:border-none">{tx.date}</td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] group-last:border-none">
                    <span className="inline-flex items-center justify-center px-3 py-1 bg-[rgba(16,185,129,0.1)] text-[#10B981] rounded-md text-xs font-bold">{tx.type}</span>
                  </td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] text-[#9CA3AF] group-last:border-none">{tx.category}</td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] group-last:border-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <tx.icon size={16} color={tx.iconColor} />
                      </div>
                      <span className="font-semibold text-white">{tx.asset}</span>
                      <span className="text-[#9CA3AF] ml-1">({tx.symbol})</span>
                    </div>
                  </td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] text-white group-last:border-none">{tx.amount}</td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] text-white group-last:border-none">{tx.price}</td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] font-bold text-white group-last:border-none">{tx.total}</td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] text-white group-last:border-none">
                    <MessageSquare size={18} className="opacity-40 cursor-pointer hover:opacity-100 hover:text-white transition-all duration-200" />
                  </td>
                  <td className="px-5 py-6 border-b border-white/5 text-[15px] group-last:border-none">
                    <div className="flex gap-4 text-[#9CA3AF]">
                      <Pencil size={18} className="opacity-40 cursor-pointer hover:opacity-100 hover:text-white transition-all duration-200" />
                      <Trash2 size={18} className="opacity-40 cursor-pointer hover:opacity-100 hover:text-red-500 transition-all duration-200" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4 text-[15px] text-[#9CA3AF]">
            <span>Rows per page:</span>
            <div className="flex items-center bg-black/30 border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
              {[10, 25, 50].map((num) => (
                <div 
                  key={num} 
                  className={`px-3.5 py-1.5 cursor-pointer font-medium transition-all duration-200 ${rowsPerPage === num ? 'bg-[#10B981] text-black' : 'text-[#9CA3AF]'}`}
                  onClick={() => setRowsPerPage(num)}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4 text-[15px] text-[#9CA3AF]">
            <span>Showing 1-3 of 25</span>
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 hover:not-disabled:border-white/20" disabled>
                <ChevronLeft size={20} className="text-[#9CA3AF]" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 hover:not-disabled:border-white/20">
                <ChevronRight size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TLog_zone3_History;
