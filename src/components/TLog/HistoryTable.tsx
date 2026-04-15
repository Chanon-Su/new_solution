import React from 'react';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';

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

interface HistoryTableProps {
  transactions: Transaction[];
}

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions }) => {
  return (
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
          {transactions.map((tx) => (
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
  );
};

export default HistoryTable;
