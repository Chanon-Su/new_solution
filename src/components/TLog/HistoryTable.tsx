import React, { useState } from 'react';
import { 
  MessageSquare, 
  Pencil, 
  Trash2, 
  Check, 
  X,
  Shield
} from 'lucide-react';
import { useSettings } from '../../hooks/SettingsManager';
import type { Transaction } from '../../types';
import { getAssetMetadata } from '../../utils/assetMapping';

interface HistoryTableProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
  onUpdate?: (tx: Transaction) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ transactions, onDelete, onUpdate }) => {
  const { privacyHideNumbers, privacyHideText, timezoneOffset } = useSettings();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const formatWithTimezone = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    // Adjust for timezone offset
    // Calculate UTC time first
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const adjustedDate = new Date(utc + (3600000 * timezoneOffset));

    return adjustedDate.toLocaleString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(',', '');
  };
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Transaction | null>(null);

  const handleDeleteClick = (id: string) => {
    if (confirmDeleteId === id) {
      onDelete?.(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const startEditing = (tx: Transaction) => {
    setEditingId(tx.id);
    setEditValues({ ...tx });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues(null);
  };

  const saveEditing = () => {
    if (editValues && onUpdate) {
      onUpdate(editValues);
      setEditingId(null);
      setEditValues(null);
    }
  };

  const handleEditChange = (field: keyof Transaction, value: any) => {
    if (editValues) {
      setEditValues({ ...editValues, [field]: value });
    }
  };

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
    <div className="w-full overflow-x-auto [scrollbar-width:thin] scrollbar-color-[#10B981_transparent]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">วันที่</th>
            <th className="text-left px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ประเภท</th>
            <th className="text-left px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">สินทรัพย์</th>
            <th className="text-left px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ประเภทสินทรัพย์</th>
            <th className="text-right px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">จำนวน</th>
            <th className="text-right px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ราคาหน่วย</th>
            <th className="text-right px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">ค่าธรรมเนียม</th>
            <th className="text-right px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">รวม</th>
            <th className="text-left px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">สกุลเงิน</th>
            <th className="text-center px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">โน้ต</th>
            <th className="text-right px-3 py-4 text-xs font-bold text-[#9CA3AF] uppercase tracking-widest opacity-60">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {transactions.map((tx) => {
            const isEditing = editingId === tx.id;
            const displayTx = isEditing && editValues ? editValues : tx;
            
            const metadata = getAssetMetadata(displayTx.asset);
            const amount = Number(displayTx.amount) || 0;
            const price = Number(displayTx.price) || 0;
            const fee = Number(displayTx.fee) || 0;
            const total = (amount * price) + fee;
            const isConfirming = confirmDeleteId === tx.id;
            
            return (
              <tr key={tx.id || Math.random()} className={`group hover:bg-white/[0.02] transition-colors duration-150 ${isEditing ? 'bg-[#10B981]/5' : ''}`}>
                {/* Date Cell */}
                <td className="px-3 py-5 text-[14px] text-white font-medium whitespace-nowrap">
                  {isEditing ? (
                    <input 
                      type="text"
                      className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs w-28 outline-none focus:border-[#10B981]"
                      value={displayTx.date}
                      onChange={(e) => handleEditChange('date', e.target.value)}
                    />
                  ) : (
                    privacyHideText ? '********' : formatWithTimezone(tx.date)
                  )}
                </td>

                {/* Type Cell */}
                <td className="px-3 py-5">
                  {isEditing ? (
                    <div className="flex flex-col gap-1">
                      <select 
                        className="bg-black/40 border border-white/10 rounded px-1 py-1 text-[10px] outline-none text-white"
                        value={displayTx.type}
                        onChange={(e) => handleEditChange('type', e.target.value)}
                      >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                        <option value="DIVIDEND">DIVIDEND</option>
                      </select>
                      {displayTx.type === 'DIVIDEND' && (
                        <select 
                          className="bg-black/40 border border-white/10 rounded px-1 py-1 text-[9px] outline-none text-emerald-400"
                          value={displayTx.frequency || ''}
                          onChange={(e) => handleEditChange('frequency', e.target.value)}
                        >
                          <option value="">None</option>
                          <option value="1m">1M</option>
                          <option value="3m">3M</option>
                          <option value="6m">6M</option>
                          <option value="1y">1Y</option>
                          <option value="OTHER">OTHER</option>
                        </select>
                      )}
                    </div>
                  ) : (
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-black tracking-tighter border shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all ${
                      tx.type === 'BUY' 
                        ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                        : tx.type === 'SELL' 
                          ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                          : 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                    }`}>
                      {privacyHideText ? '********' : (tx.type === 'DIVIDEND' && tx.frequency 
                        ? `DIVIDEND_${tx.frequency.toUpperCase()}` 
                        : (tx.type || 'UNKNOWN'))}
                    </span>
                  )}
                </td>

                {/* Asset Cell */}
                <td className="px-3 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#10B981]/30 transition-all">
                      {privacyHideText ? <Shield size={12} className="text-gray-600" /> : <metadata.icon size={14} color={metadata.color} strokeWidth={2.5} />}
                    </div>
                    {isEditing ? (
                      <input 
                        type="text"
                        className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs w-16 outline-none uppercase"
                        value={displayTx.asset}
                        onChange={(e) => handleEditChange('asset', e.target.value)}
                      />
                    ) : (
                      <span className="font-bold text-white tracking-tight">{privacyHideText ? '********' : (tx.asset || 'N/A')}</span>
                    )}
                  </div>
                </td>

                {/* Category Cell */}
                <td className="px-3 py-5 text-left">
                  {isEditing ? (
                    <select 
                      className="bg-black/40 border border-white/10 rounded px-1 py-1 text-xs outline-none"
                      value={displayTx.category}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                    >
                      {Object.entries(categoryLabels).map(([id, label]) => (
                        <option key={id} value={id}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-[13px] text-[#9CA3AF] font-medium">
                      {privacyHideText ? '********' : (categoryLabels[tx.category] || tx.category || '-')}
                    </span>
                  )}
                </td>

                {/* Amount Cell */}
                <td className="px-3 py-5 text-right font-mono text-[14px] text-white">
                  {isEditing ? (
                    <input 
                      type="number"
                      className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs w-20 text-right outline-none"
                      value={displayTx.amount}
                      onChange={(e) => handleEditChange('amount', e.target.value)}
                    />
                  ) : (
                    privacyHideNumbers ? '********' : amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })
                  )}
                </td>

                {/* Price Cell */}
                <td className="px-3 py-5 text-right font-mono text-[14px] text-white/80">
                  {isEditing ? (
                    <input 
                      type="number"
                      className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs w-20 text-right outline-none"
                      value={displayTx.price}
                      onChange={(e) => handleEditChange('price', e.target.value)}
                    />
                  ) : (
                    privacyHideNumbers ? '********' : price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  )}
                </td>

                {/* Fee Cell */}
                <td className="px-3 py-5 text-right font-mono text-[13px] text-[#9CA3AF]">
                  {isEditing ? (
                    <div className="flex flex-col gap-1 items-end min-w-[80px]">
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] opacity-40">VAT</span>
                        <input 
                          type="number"
                          className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[10px] w-14 text-right outline-none"
                          value={displayTx.fee_vat || ''}
                          placeholder="VAT"
                          onChange={(e) => handleEditChange('fee_vat', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[8px] opacity-40">DSC</span>
                        <input 
                          type="number"
                          className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[10px] w-14 text-right outline-none"
                          value={displayTx.fee_discount || ''}
                          placeholder="Disc"
                          onChange={(e) => handleEditChange('fee_discount', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-1 border-t border-white/5 pt-1 mt-0.5">
                        <span className="text-[8px] font-bold text-[#10B981]">TTL</span>
                        <input 
                          type="number"
                          className="bg-black/40 border border-[#10B981]/30 rounded px-1 py-0.5 text-[11px] w-16 text-right outline-none font-bold text-[#10B981]"
                          value={displayTx.fee}
                          onChange={(e) => handleEditChange('fee', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-white/80 font-bold">
                        {privacyHideNumbers ? '********' : (fee > 0 ? fee.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-')}
                      </span>
                      {(displayTx.fee_vat || displayTx.fee_discount) && !privacyHideNumbers ? (
                        <div className="flex gap-2 text-[9px] opacity-40 font-sans tracking-tight">
                          {displayTx.fee_vat ? <span>VAT: {Number(displayTx.fee_vat).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> : null}
                          {displayTx.fee_discount ? <span>Disc: {Number(displayTx.fee_discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                </td>

                {/* Total Cell */}
                <td className="px-3 py-5 text-right font-mono text-[15px] font-bold text-[#10B981]">
                  {privacyHideNumbers ? '********' : total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>

                {/* Currency Cell */}
                <td className="px-3 py-5 text-left">
                  {isEditing ? (
                    <select 
                      className="bg-black/40 border border-white/10 rounded px-1 py-1 text-[10px] outline-none"
                      value={displayTx.currency}
                      onChange={(e) => handleEditChange('currency', e.target.value)}
                    >
                      <option value="USD">USD</option>
                      <option value="THB">THB</option>
                    </select>
                  ) : (
                    <span className={`text-[11px] font-black px-1.5 py-0.5 rounded ${
                      privacyHideText 
                        ? 'text-gray-500 bg-gray-500/10' 
                        : (tx.currency === 'USD' ? 'text-[#3B82F6] bg-[#3B82F6]/10' : 'text-[#F59E0B] bg-[#F59E0B]/10')
                    }`}>
                      {privacyHideText ? '********' : tx.currency}
                    </span>
                  )}
                </td>

                {/* Notes Cell */}
                <td className="px-3 py-5 text-center">
                  {isEditing ? (
                    <input 
                      type="text"
                      className="bg-black/40 border border-white/10 rounded px-1.5 py-0.5 text-xs w-24 outline-none"
                      value={displayTx.notes}
                      onChange={(e) => handleEditChange('notes', e.target.value)}
                    />
                  ) : (
                    tx.notes ? (
                      <div className="relative group/note inline-block">
                        <MessageSquare size={16} className="text-[#9CA3AF] opacity-40 group-hover/note:opacity-100 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1C1C1E] border border-white/10 rounded-lg text-xs text-white opacity-0 group-hover/note:opacity-100 pointer-events-none transition-all shadow-2xl z-50">
                          {privacyHideText ? '********' : tx.notes}
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/5">-</span>
                    )
                  )}
                </td>

                {/* Actions Cell */}
                <td className="px-3 py-5 text-right">
                  <div className="flex justify-end gap-3 text-[#9CA3AF]">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <Check 
                          size={18} 
                          className="text-[#10B981] cursor-pointer hover:scale-110 transition-transform" 
                          onClick={saveEditing}
                        />
                        <X 
                          size={18} 
                          className="text-white/40 cursor-pointer hover:text-white transition-colors" 
                          onClick={cancelEditing}
                        />
                      </div>
                    ) : !isConfirming ? (
                      <>
                        <Pencil 
                          size={16} 
                          className="opacity-20 cursor-pointer hover:opacity-100 hover:text-white transition-all transform hover:scale-110" 
                          onClick={() => startEditing(tx)}
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
