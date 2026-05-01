import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import ZenField from '../UI/ZenField';
import ZenDropdown, { type ZenDropdownOption } from '../UI/ZenDropdown';
import { useQuickFill } from '../../hooks/QuickFillManager';
import type { QuickFillItem } from '../../types';

const QuickFillSetup: React.FC = () => {
  const { addQuickFill, removeQuickFill, updateQuickFill } = useQuickFill();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QuickFillItem | null>(null);

  const [formData, setFormData] = useState<Partial<QuickFillItem>>({
    name: '',
    icon: '📝',
    type: 'BUY',
    currency: 'USD',
    category: 'STOCK',
    notes: ''
  });
  
  const [followedAssets, setFollowedAssets] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['📝', '💰', '📉', '📈', '🚀', '💎', '🏠', '🏦', '🛍️', '🍎', '🚗', '☕', '🍱', '🎮', '💡', '🔥'];

  useEffect(() => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    if (followedStr) {
      setFollowedAssets(JSON.parse(followedStr));
    }
  }, []);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const item = (event as CustomEvent).detail as QuickFillItem | null;
      if (item) {
        setEditingItem(item);
        setFormData(item);
      } else {
        setEditingItem(null);
        setFormData({
          name: '',
          icon: '📝',
          type: 'BUY',
          currency: 'USD',
          category: 'STOCK',
          notes: ''
        });
      }
      setIsOpen(true);
    };

    window.addEventListener('planto_open_quickfill_setup', handleOpen);
    return () => window.removeEventListener('planto_open_quickfill_setup', handleOpen);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'asset') {
      setShowSuggestions(value.length > 0);
    }
  };

  const handleSuggestionSelect = (asset: any) => {
    setFormData(prev => ({ 
      ...prev, 
      asset: asset.symbol,
      category: asset.category || prev.category,
      icon: asset.symbol // Use symbol as logo identifier
    }));
    setShowSuggestions(false);
  };

  const handleTypeChange = (type: string, subValue?: string) => {
    setFormData(prev => ({ 
      ...prev, 
      type: type as 'BUY' | 'SELL' | 'DIVIDEND',
      frequency: subValue as any
    }));
  };

  const handleSave = () => {
    if (!formData.name) return;

    const item: QuickFillItem = {
      id: editingItem?.id || Math.random().toString(36).substring(2, 11),
      name: formData.name || '',
      icon: formData.icon || '📝',
      type: formData.type,
      frequency: formData.frequency,
      asset: formData.asset,
      category: formData.category,
      amount: formData.amount ? parseFloat(formData.amount as any) : undefined,
      price: formData.price ? parseFloat(formData.price as any) : undefined,
      currency: formData.currency,
      notes: formData.notes
    };

    if (editingItem) {
      updateQuickFill(item);
    } else {
      addQuickFill(item);
    }
    setIsOpen(false);
  };

  const handleDelete = () => {
    if (editingItem) {
      removeQuickFill(editingItem.id);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const typeOptions: ZenDropdownOption[] = [
    { value: 'BUY', label: 'BUY' },
    { value: 'SELL', label: 'SELL' },
    { 
      value: 'DIVIDEND', 
      label: 'DIVIDEND', 
      children: [
        { value: '1m', label: 'Monthly' },
        { value: '3m', label: 'Quarterly (3m)' },
        { value: '6m', label: 'Semi-Annual (6m)' },
        { value: '1y', label: 'Annual (1y)' },
        { value: 'OTHER', label: 'Other' }
      ] 
    }
  ];

  const categories = [
    { id: 'STOCK', label: 'หุ้น' },
    { id: 'BOND', label: 'ตราสารหนี้' },
    { id: 'FUND', label: 'กองทุนรวม' },
    { id: 'CRYPTO', label: 'Cryptocurrency' },
    { id: 'COMMODITY', label: 'สินค้าโภคภัณฑ์' },
    { id: 'REALESTATE', label: 'อสังหาริมทรัพย์' },
    { id: 'OTHER', label: 'อื่น ๆ' },
  ];

  return (
    <div className="qf-setup-overlay fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="qf-setup-modal w-full max-w-lg bg-[var(--obsidian-void)] border border-[var(--glass-border)] rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <Save size={20} />
            </div>
            <div>
              <h3 className="text-[var(--text-primary)] font-bold text-lg">{editingItem ? 'แก้ไขรายการด่วน' : 'เพิ่มรายการด่วนใหม่'}</h3>
              <p className="text-[#9CA3AF] text-xs">ตั้งค่ารายการที่คุณใช้งานเป็นประจำ</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--glass-bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-4 gap-4">
            <ZenField label="Emoji/Logo" className="col-span-1 relative">
              <div 
                className="w-full h-[46px] bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {formData.icon && formData.icon.length > 2 ? (
                   <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                     {formData.icon.substring(0, 2).toUpperCase()}
                   </div>
                ) : (
                  <span className="text-xl">{formData.icon || '📝'}</span>
                )}
              </div>
              
              {showEmojiPicker && (
                <div className="absolute top-full left-0 mt-2 z-[2100] w-[180px] bg-[var(--dark-slate)] border border-[var(--glass-border)] rounded-xl p-3 shadow-2xl grid grid-cols-4 gap-2 animate-in fade-in zoom-in-95 duration-200">
                  {emojis.map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, icon: emoji }));
                        setShowEmojiPicker(false);
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </ZenField>
            <ZenField label="ชื่อเรียกรายการ" className="col-span-3">
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="เช่น เติมพอร์ตประจำเดือน"
                className="w-full bg-transparent border-none px-4 text-[var(--text-primary)] text-[14px] outline-none placeholder:text-[var(--text-secondary)]/40" 
              />
            </ZenField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ZenField label="สินทรัพย์" className="relative">
              <input 
                type="text" 
                name="asset"
                value={formData.asset || ''}
                onChange={handleInputChange}
                onFocus={() => formData.asset && setShowSuggestions(true)}
                placeholder="เช่น BTC, AAPL"
                autoComplete="off"
                className="w-full bg-transparent border-none px-4 text-[var(--text-primary)] text-[14px] outline-none" 
              />
              {showSuggestions && followedAssets.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-1 bg-[#1a1a1c] border border-white/10 rounded-xl overflow-hidden z-[2100] shadow-2xl">
                  {followedAssets
                    .filter(a => 
                      a.symbol.toLowerCase().includes(formData.asset?.toLowerCase() || '') ||
                      a.name.toLowerCase().includes(formData.asset?.toLowerCase() || '')
                    )
                    .slice(0, 5)
                    .map(asset => (
                      <div 
                        key={asset.id} 
                        className="p-3 hover:bg-emerald-500/10 cursor-pointer flex items-center justify-between group transition-colors"
                        onClick={() => handleSuggestionSelect(asset)}
                      >
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[var(--text-primary)] group-hover:text-emerald-400">{asset.symbol}</span>
                          <span className="text-[10px] text-[var(--text-secondary)]">{asset.name}</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-bold text-[var(--text-primary)]">
                          {asset.symbol[0]}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </ZenField>
            <ZenField label="หมวดหมู่">
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-transparent border-none text-[13px] font-medium text-white outline-none cursor-pointer px-4"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id} className="bg-[var(--obsidian-void)] text-[var(--text-primary)]">{cat.label}</option>
                ))}
              </select>
            </ZenField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ZenField label="ประเภทรายการ">
              <ZenDropdown 
                options={typeOptions}
                value={formData.type || 'BUY'}
                subValue={formData.frequency}
                onChange={handleTypeChange}
                className="flex-1"
              />
            </ZenField>
            <ZenField label="สกุลเงิน">
              <select 
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-transparent border-none text-[13px] font-medium text-white outline-none cursor-pointer px-4"
              >
                <option value="USD" className="bg-[var(--obsidian-void)] text-[var(--text-primary)]">USD</option>
                <option value="THB" className="bg-[var(--obsidian-void)] text-[var(--text-primary)]">THB</option>
              </select>
            </ZenField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ZenField label="จำนวน (ถ้ามี)">
              <input 
                type="number" 
                name="amount"
                value={formData.amount || ''}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="เว้นว่างได้"
                className="w-full bg-transparent border-none px-4 text-[var(--text-primary)] text-[14px] outline-none" 
              />
            </ZenField>
            <ZenField label="ราคา (ถ้ามี)">
              <input 
                type="number" 
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                autoComplete="off"
                placeholder="เว้นว่างได้"
                className="w-full bg-transparent border-none px-4 text-[var(--text-primary)] text-[14px] outline-none" 
              />
            </ZenField>
          </div>

          <ZenField label="บันทึกช่วยจำ" multiline>
            <textarea 
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="ข้อความที่จะถูกกรอกในบันทึก..."
              className="w-full h-20 bg-transparent border-none px-4 py-3 text-[var(--text-primary)] text-[13px] resize-none outline-none"
            ></textarea>
          </ZenField>

        </div>

        {/* Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <div>
            {editingItem && (
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-red-500 hover:text-red-400 text-xs font-bold transition-colors"
              >
                <Trash2 size={14} />
                <span>ลบรายการนี้</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl text-[var(--text-secondary)] text-sm font-bold hover:bg-[var(--glass-bg-subtle)] transition-colors"
            >
              ยกเลิก
            </button>
            <button 
              onClick={handleSave}
              disabled={!formData.name}
              className="px-6 py-2.5 bg-emerald-500 text-[var(--obsidian-void)] rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingItem ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกรายการด่วน'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickFillSetup;
