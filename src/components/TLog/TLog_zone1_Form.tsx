import React, { useState } from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  ChevronDown,
  Clock,
  CheckCircle2
} from 'lucide-react';
import ZenField from '../UI/ZenField';

const TLog_zone1_Form: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call for performance-friendly feedback
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    }, 800);
  };

  return (
    <section className="tlog-zone1-section flex flex-col gap-5">
      <div className="tlog-form-container bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="tlog-header flex justify-between items-center mb-8">
          <div className="tlog-header-title flex items-center gap-4">
            <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">เพิ่มเข้าบันทึก</h2>
          </div>
          <div className="tlog-header-actions flex gap-4">
            <button className="flex items-center gap-1.5 text-white text-[13px] font-medium hover:text-[#10B981] transition-colors">
              <Upload size={14} className="text-[#10B981]" />
              <span>นำเข้า (Import)</span>
            </button>
            <button className="flex items-center gap-1.5 text-white text-[13px] font-medium hover:text-[#10B981] transition-colors">
              <Download size={14} className="text-[#10B981]" />
              <span>ส่งออก (Export)</span>
            </button>
          </div>
        </div>

        <div className="tlog-form-grid grid grid-cols-3 gap-6 mb-8">
          <ZenField label="วันที่ & เวลา" className="tlog-field-datetime">
            <div className="flex-1 flex items-center pr-2">
              <input type="date" defaultValue="2026-04-08" className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none" />
            </div>
            <div className="w-px h-5 bg-white/10"></div>
            <div className="flex-1 flex items-center pl-2">
              <input type="text" defaultValue="13:00" placeholder="HH:mm" className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none" />
              <Clock size={14} className="mr-4 text-[#9CA3AF] cursor-pointer hover:text-[#10B981] transition-colors" />
            </div>
          </ZenField>

          <ZenField label="ประเภทรายการ" className="tlog-field-type">
            <select defaultValue="BUY" className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none appearance-none cursor-pointer">
              <option value="BUY" className="bg-[#121214]">BUY</option>
              <option value="SELL" className="bg-[#121214]">SELL</option>
              <option value="DIVIDEND" className="bg-[#121214]">DIVIDEND</option>
            </select>
            <ChevronDown size={16} className="mr-4 text-[#9CA3AF] pointer-events-none" />
          </ZenField>

          <ZenField label="สินทรัพย์" className="tlog-field-asset">
            <input type="text" placeholder="เช่น BTC, AAPL" className="flex-1 bg-transparent border-none px-4 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
            <div className="w-px h-5 bg-white/10"></div>
            <select className="tlog-asset-type-select w-1/2 bg-transparent border-none text-[13px] font-medium text-white opacity-80 border-l border-white/5 outline-none cursor-pointer px-2">
              <option value="STOCK" className="bg-[#121214]">หุ้น</option>
              <option value="CRYPTO" className="bg-[#121214]">Crypto</option>
              <option value="GOLD" className="bg-[#121214]">ทองคำ</option>
              <option value="OTHER" className="bg-[#121214]">อื่นๆ</option>
            </select>
          </ZenField>

          <ZenField label="จำนวน" className="tlog-field-amount">
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-4 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>

          <ZenField label="ราคาต่อหน่วย" className="tlog-field-price">
            <select className="tlog-currency-select bg-transparent border-none pl-4 text-[13px] font-medium text-white opacity-80 outline-none cursor-pointer">
              <option value="USD" className="bg-[#121214]">USD</option>
              <option value="THB" className="bg-[#121214]">THB</option>
            </select>
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-3 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>

          <ZenField label="ค่าธรรมเนียม" className="tlog-field-fee">
            <select className="tlog-currency-select bg-transparent border-none pl-4 text-[13px] font-medium text-white opacity-80 outline-none cursor-pointer">
              <option value="USD" className="bg-[#121214]">USD</option>
              <option value="THB" className="bg-[#121214]">THB</option>
            </select>
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-3 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>
        </div>

        <div className="tlog-form-footer flex gap-6 items-end">
          <div className="tlog-memo-wrapper flex flex-col gap-2.5 flex-1">
            <label className="text-xs font-semibold text-[#9CA3AF] tracking-wide">บันทึกช่วยจำ</label>
            <div className="tlog-memo-input-box bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden focus-within:border-[#10B981] focus-within:shadow-[0_0_0_1px_#10B981] transition-all duration-200">
              <textarea placeholder="เหตุผล, แพลตฟอร์ม, ฯลฯ" className="w-full h-[52px] bg-transparent border-none px-4 py-3 text-[#9CA3AF] focus:text-white text-[14px] resize-none outline-none"></textarea>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`tlog-submit-button h-[52px] min-w-[160px] px-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
              isSuccess 
                ? 'bg-[#10B981] text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : 'bg-[#10B981] text-black hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.25)]'
            }`}
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
      </div>
    </section>
  );
};

export default TLog_zone1_Form;
