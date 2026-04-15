import React from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';
import ZenField from '../UI/ZenField';

const TLog_zone1_Form: React.FC = () => {
  return (
    <section className="flex flex-col gap-5">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            <h2 className="text-2xl font-semibold text-white tracking-tight">เพิ่มเข้าบันทึก</h2>
          </div>
          <div className="flex gap-4">
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
      </div>

      <div className="bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <ZenField label="วันที่">
            <input type="text" defaultValue="04/08/2026" className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none" />
            <Calendar size={16} className="mr-4 text-[#9CA3AF]" />
          </ZenField>

          <ZenField label="ประเภท">
            <select defaultValue="BUY" className="flex-1 bg-transparent border-none px-4 text-white text-[14px] outline-none appearance-none cursor-pointer">
              <option value="BUY" className="bg-[#121214]">BUY</option>
              <option value="SELL" className="bg-[#121214]">SELL</option>
              <option value="DIVIDEND" className="bg-[#121214]">DIVIDEND</option>
            </select>
            <ChevronDown size={16} className="mr-4 text-[#9CA3AF] pointer-events-none" />
          </ZenField>

          <ZenField label="สินทรัพย์">
            <input type="text" placeholder="เช่น BTC, AAPL" className="flex-1 bg-transparent border-none px-4 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
            <div className="w-px h-5 bg-white/10"></div>
            <div className="px-4 text-[13px] font-medium text-white opacity-80">หุ้น</div>
          </ZenField>

          <ZenField label="จำนวน">
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-4 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>

          <ZenField label="ราคาต่อหน่วย">
            <span className="pl-4 text-[13px] font-medium text-white opacity-80">USD</span>
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-3 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>

          <ZenField label="ค่าธรรมเนียม">
            <input type="number" placeholder="0.00" className="flex-1 bg-transparent border-none px-4 text-[#9CA3AF] focus:text-white text-[14px] outline-none" />
          </ZenField>
        </div>

        <div className="flex gap-6 items-end">
          <div className="flex flex-col gap-2.5 flex-1">
            <label className="text-xs font-semibold text-[#9CA3AF] tracking-wide">บันทึกช่วยจำ</label>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden focus-within:border-[#10B981] focus-within:shadow-[0_0_0_1px_#10B981] transition-all duration-200">
              <textarea placeholder="เหตุผล, แพลตฟอร์ม, ฯลฯ" className="w-full min-h-[90px] bg-transparent border-none p-4 text-[#9CA3AF] focus:text-white text-[14px] resize-none outline-none"></textarea>
            </div>
          </div>
          
          <button className="h-[52px] min-w-[160px] px-6 bg-[#10B981] text-black rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(16,185,129,0.25)] transition-all duration-300">
            <Plus size={18} strokeWidth={2.5} />
            <span className="text-[14px]">เพิ่มเข้าบันทึก</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TLog_zone1_Form;
