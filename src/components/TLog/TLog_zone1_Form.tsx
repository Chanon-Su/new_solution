import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  ChevronDown,
  Clock,
  CheckCircle2
} from 'lucide-react';
import ZenField from '../UI/ZenField';
import { useTLog } from '../../hooks/TLogManager';
import { exportToCSV, parseCSV } from '../../utils/csvUtils';
import type { Transaction } from '../../types';

const TLog_zone1_Form: React.FC = () => {
  const { addTransaction, transactions, importTransactions } = useTLog();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    type: 'BUY' as 'BUY' | 'SELL' | 'DIVIDEND',
    asset: '',
    category: 'STOCK',
    amount: '',
    price: '',
    fee: '',
    currency: 'USD' as 'USD' | 'THB',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const timePickerRef = useRef<HTMLDivElement>(null);

  // Click outside to close time picker
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setIsTimePickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (type: 'hour' | 'minute', val: string) => {
    const [h, m] = formData.time.split(':');
    let newTime = '';
    if (type === 'hour') {
      newTime = `${val}:${m || '00'}`;
    } else {
      newTime = `${h || '00'}:${val}`;
    }
    setFormData(prev => ({ ...prev, time: newTime }));
  };

  const generateId = () => {
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
    } catch (e) {
      // Fallback
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.asset || !formData.amount || !formData.price) return;

    setIsSubmitting(true);
    
    const newTransaction: Transaction = {
      id: generateId(),
      date: `${formData.date} ${formData.time}`,
      type: formData.type,
      category: formData.category,
      asset: formData.asset.trim().toUpperCase(),
      amount: parseFloat(formData.amount),
      price: parseFloat(formData.price),
      currency: formData.currency,
      fee: parseFloat(formData.fee) || 0,
      notes: formData.notes
    };

    // Simulate small delay for tactile feedback
    setTimeout(() => {
      addTransaction(newTransaction);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        asset: '',
        amount: '',
        price: '',
        fee: '',
        notes: ''
      }));

      setTimeout(() => setIsSuccess(false), 2000);
    }, 600);
  };

  const handleExport = () => {
    exportToCSV(transactions);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const importedTxs = parseCSV(content);
        if (importedTxs.length > 0) {
          importTransactions(importedTxs);
          alert(`นำเข้าสำเร็จ ${importedTxs.length} รายการ`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const defaultCategories = React.useMemo(() => [
    { id: 'STOCK', label: 'หุ้น' },
    { id: 'BOND', label: 'ตราสารหนี้' },
    { id: 'FUND', label: 'กองทุนรวม' },
    { id: 'CRYPTO', label: 'Cryptocurrency' },
    { id: 'COMMODITY', label: 'สินค้าโภคภัณฑ์' },
    { id: 'REALESTATE', label: 'อสังหาริมทรัพย์' },
    { id: 'OTHER', label: 'อื่น ๆ' },
  ], []);

  const sortedCategories = React.useMemo(() => {
    const counts = transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [...defaultCategories].sort((a, b) => {
      const countA = counts[a.id] || 0;
      const countB = counts[b.id] || 0;
      return countB - countA;
    });
  }, [transactions, defaultCategories]);

  return (
    <section className="tlog-zone1-section flex flex-col gap-5">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileImport} 
        accept=".csv" 
        className="hidden" 
      />
      
      <div className="tlog-form-container bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="tlog-header flex justify-between items-center mb-8">
          <div className="tlog-header-title flex items-center gap-4">
            <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">เพิ่มเข้าบันทึก</h2>
          </div>
          <div className="tlog-header-actions flex gap-4">
            <button 
              type="button"
              onClick={handleImportClick}
              className="flex items-center gap-1.5 text-white text-[13px] font-medium hover:text-[#10B981] transition-colors"
            >
              <Upload size={14} className="text-[#10B981]" />
              <span>นำเข้า (Import)</span>
            </button>
            <button 
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 text-white text-[13px] font-medium hover:text-[#10B981] transition-colors"
            >
              <Download size={14} className="text-[#10B981]" />
              <span>ส่งออก (Export)</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="tlog-form-content">
          <div className="tlog-form-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ZenField label="วันที่ & เวลา" className="tlog-field-datetime">
              <div className="flex-[1.2] flex items-center min-w-[110px]">
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-none px-4 text-white text-[14px] outline-none cursor-pointer" 
                />
              </div>
              <div className="w-px h-5 bg-white/10 shrink-0"></div>
              <div className="flex-1 flex items-center min-w-[90px] relative">
                <input 
                  type="text" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  placeholder="HH:mm" 
                  readOnly
                  onClick={() => setIsTimePickerOpen(true)}
                  className="w-full bg-transparent border-none px-4 text-white text-[14px] outline-none cursor-pointer" 
                />
                <div 
                  onClick={() => setIsTimePickerOpen(!isTimePickerOpen)}
                  className="pr-4 py-3 cursor-pointer group/clock shrink-0"
                >
                  <Clock size={14} className={`${isTimePickerOpen ? 'text-[#10B981]' : 'text-[#9CA3AF]'} group-hover/clock:text-[#10B981] transition-colors`} />
                </div>

                {isTimePickerOpen && (
                  <div 
                    ref={timePickerRef}
                    className="absolute top-full left-0 mt-2 w-48 h-64 bg-[#121214] border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[100] overflow-hidden flex"
                  >
                    {/* Hours Column */}
                    <div className="flex-1 overflow-y-auto [scrollbar-width:none] border-r border-white/5 py-2">
                      <div className="text-[10px] text-center font-bold text-[#9CA3AF] mb-2 opacity-40 uppercase tracking-tighter">Hour</div>
                      {Array.from({ length: 24 }).map((_, i) => {
                        const h = i.toString().padStart(2, '0');
                        const isSelected = formData.time.startsWith(h + ':');
                        return (
                          <div 
                            key={`h-${i}`}
                            onClick={() => handleTimeSelect('hour', h)}
                            className={`py-1.5 text-center text-[13px] font-mono cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#10B981] text-black font-bold' : 'text-white hover:bg-white/5'
                            }`}
                          >
                            {h}
                          </div>
                        );
                      })}
                    </div>
                    {/* Minutes Column */}
                    <div className="flex-1 overflow-y-auto [scrollbar-width:none] py-2">
                      <div className="text-[10px] text-center font-bold text-[#9CA3AF] mb-2 opacity-40 uppercase tracking-tighter">Min</div>
                      {Array.from({ length: 60 }).map((_, i) => {
                        const m = i.toString().padStart(2, '0');
                        const isSelected = formData.time.endsWith(':' + m);
                        return (
                          <div 
                            key={`m-${i}`}
                            onClick={() => handleTimeSelect('minute', m)}
                            className={`py-1.5 text-center text-[13px] font-mono cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#10B981] text-black font-bold' : 'text-white hover:bg-white/5'
                            }`}
                          >
                            {m}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </ZenField>

            <ZenField label="ประเภทรายการ" className="tlog-field-type">
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none appearance-none cursor-pointer"
              >
                <option value="BUY" className="bg-[#121214]">BUY</option>
                <option value="SELL" className="bg-[#121214]">SELL</option>
                <option value="DIVIDEND" className="bg-[#121214]">DIVIDEND</option>
              </select>
              <ChevronDown size={16} className="mr-4 text-[#9CA3AF] pointer-events-none" />
            </ZenField>

            <ZenField label="สินทรัพย์" className="tlog-field-asset">
              <input 
                type="text" 
                name="asset"
                value={formData.asset}
                onChange={handleInputChange}
                required
                autoComplete="off"
                placeholder="เช่น BTC, AAPL" 
                className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none placeholder:text-[#9CA3AF]/50" 
              />
              <div className="w-px h-5 bg-white/10"></div>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="tlog-asset-type-select w-[42%] bg-transparent border-none text-[13px] font-medium text-white opacity-80 outline-none cursor-pointer px-1"
              >
                {sortedCategories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[#121214]">{cat.label}</option>
                ))}
              </select>
            </ZenField>

            <ZenField label="จำนวน" className="tlog-field-amount">
              <input 
                type="number" 
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                step="any"
                placeholder="0.00" 
                className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none placeholder:text-[#9CA3AF]/50" 
              />
            </ZenField>

            <ZenField label="ราคาต่อหน่วย" className="tlog-field-price">
              <select 
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="tlog-currency-select bg-transparent border-none pl-4 text-[13px] font-medium text-white opacity-80 outline-none cursor-pointer"
              >
                <option value="USD" className="bg-[#121214]">USD</option>
                <option value="THB" className="bg-[#121214]">THB</option>
              </select>
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="any"
                placeholder="0.00" 
                className="flex-1 bg-transparent border-none px-3 text-white text-[14px] outline-none placeholder:text-[#9CA3AF]/50" 
              />
            </ZenField>

            <ZenField label="ค่าธรรมเนียม" className="tlog-field-fee">
              <div className="flex items-center pl-4 text-[13px] font-medium text-white opacity-40">
                {formData.currency}
              </div>
              <input 
                type="number" 
                name="fee"
                value={formData.fee}
                onChange={handleInputChange}
                step="any"
                placeholder="0.00" 
                className="flex-1 bg-transparent border-none px-3 text-white text-[14px] outline-none placeholder:text-[#9CA3AF]/50" 
              />
            </ZenField>
          </div>

          <div className="tlog-form-footer flex flex-col md:flex-row gap-6 items-stretch md:items-end">
            <div className="tlog-memo-wrapper flex flex-col gap-2.5 flex-1">
              <label className="text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">บันทึกช่วยจำ</label>
              <div className="tlog-memo-input-box bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden focus-within:border-[#10B981] focus-within:shadow-[0_0_0_1px_#10B981] transition-all duration-200">
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="เหตุผล, แพลตฟอร์ม, ฯลฯ" 
                  className="w-full h-[52px] bg-transparent border-none px-4 py-3 text-white text-[14px] resize-none outline-none placeholder:text-[#9CA3AF]/50"
                ></textarea>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`tlog-submit-button h-[52px] min-w-[180px] px-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                isSuccess 
                  ? 'bg-[#10B981] text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-[#10B981] text-black hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.25)]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={18} strokeWidth={3} />
                  <span className="text-[14px]">บันทึกแล้ว</span>
                </>
              ) : (
                <>
                  <Plus size={18} strokeWidth={2.5} />
                  <span className="text-[14px]">เพิ่มเข้าบันทึก</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default TLog_zone1_Form;
