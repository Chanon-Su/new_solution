import React, { useState } from 'react';
import { MessageSquare, Pencil, Trash2, Check, X } from 'lucide-react';
import type { Transaction } from '../../types';
import { getAssetMetadata } from '../../utils/assetMapping';

interface HistoryTableProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onEdit?: (tx: Transaction) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, onDelete, onEdit }) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete?.(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  return (
    <div className="w-full overflow-x-auto [scrollbar-width:thin] scrollbar-color-[#10B981_transparent]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">วันที่</th>
            <th className="text-left px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ประเภท</th>
            <th className="text-left px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">สินทรัพย์</th>
            <th className="text-left px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ประเภทสินทรัพย์</th>
            <th className="text-right px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">จำนวน</th>
            <th className="text-right px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ราคาหน่วย</th>
            <th className="text-right px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ค่าธรรมเนียม</th>
            <th className="text-right px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">รวม</th>
            <th className="text-left px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">สกุลเงิน</th>
            <th className="text-center px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">โน้ต</th>
            <th className="text-right px-5 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {transactions.map((tx) => {
            const metadata = getAssetMetadata(tx.asset);
            const amount = tx.amount || 0;
            const price = tx.price || 0;
            const fee = tx.fee || 0;
            const total = (amount * price) + fee;
            const isConfirming = confirmDeleteId === tx.id;
            
            const categoryLabels: Record<string, string> = {
              STOCK: 'หุ้น',
              BOND: 'ตราสารหนี้',
              FUND: 'กองทุนรวม',
              CRYPTO: 'Cryptocurrency',
              COMMODITY: 'สินค้าโภคภัณฑ์',
              REALESTATE: 'อสังหาริมทรัพย์',
              OTHER: 'อื่น ๆ'
            };

            return (
              <tr key={tx.id || Math.random()} className="group hover:bg-white/[0.02] transition-colors duration-150">
                <td className="px-5 py-5 text-[14px] text-white font-medium whitespace-nowrap">
                  {tx.date ? new Date(tx.date).toLocaleString('en-GB', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }).replace(',', '') : '-'}
                </td>
                <td className="px-5 py-5">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-tighter ${
                    tx.type === 'BUY' 
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                      : tx.type === 'SELL' 
                        ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20'
                        : 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20'
                  }`}>
                    {tx.type || 'UNKNOWN'}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#10B981]/30 transition-all">
                      <metadata.icon size={14} color={metadata.color} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-white tracking-tight">{tx.asset || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-5 py-5 text-left">
                  <span className="text-[13px] text-[#9CA3AF] font-medium">
                    {categoryLabels[tx.category] || tx.category || '-'}
                  </span>
                </td>
                <td className="px-5 py-5 text-right font-mono text-[14px] text-white">
                  {amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}
                </td>
                <td className="px-5 py-5 text-right font-mono text-[14px] text-white/80">
                  {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-5 text-right font-mono text-[13px] text-[#9CA3AF]">
                  {fee > 0 ? fee.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                </td>
                <td className="px-5 py-5 text-right font-mono text-[15px] font-bold text-[#10B981]">
                  {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-5 text-left">
                  <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ${
                    tx.currency === 'USD' ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-[#F59E0B] bg-[#F59E0B]/10'
                  }`}>
                    {tx.currency}
                  </span>
                </td>

                <td className="px-5 py-5 text-center">
                  {tx.notes ? (
                    <div className="relative group/note inline-block">
                      <MessageSquare size={16} className="text-[#9CA3AF] opacity-40 group-hover/note:opacity-100 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1C1C1E] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover/note:opacity-100 pointer-events-none transition-all shadow-2xl z-50">
                        {tx.notes}
                      </div>
                    </div>
                  ) : (
                    <span className="text-white/5">-</span>
                  )}
                </td>
                <td className="px-5 py-5 text-right">
                  <div className="flex justify-end gap-3 text-[#9CA3AF]">
                    {!isConfirming ? (
                      <>
                        <Pencil 
                          size={16} 
                          className="opacity-20 cursor-pointer hover:opacity-100 hover:text-white transition-all transform hover:scale-110" 
                          onClick={() => onEdit?.(tx)}
                        />
                        <Trash2 
                          size={16} 
                          className="opacity-20 cursor-pointer hover:opacity-100 hover:text-red-500 transition-all transform hover:scale-110" 
                          onClick={() => handleDeleteClick(tx.id)}
                        />
                      </>
                    ) : (
                      <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter mr-1">Confirm?</span>
                        <Check 
                          size={18} 
                          className="text-red-500 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => handleDeleteClick(tx.id)}
                        />
                        <X 
                          size={18} 
                          className="text-white/40 cursor-pointer hover:text-white transition-colors" 
                          onClick={() => setConfirmDeleteId(null)}
                        />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {transactions.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center opacity-20">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-white mb-4"></div>
          <p className="text-sm font-medium">ยังไม่มีรายการบันทึก</p>
        </div>
      )}
    </div>
  );
};

export default HistoryTable;
