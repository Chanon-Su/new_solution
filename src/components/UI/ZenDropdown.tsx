import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export interface ZenDropdownOption {
  value: string;
  label: string;
  children?: ZenDropdownOption[];
}

interface ZenDropdownProps {
  options: ZenDropdownOption[];
  value: string;
  subValue?: string;
  onChange: (value: string, subValue?: string) => void;
  placeholder?: string;
  className?: string;
}

const ZenDropdown: React.FC<ZenDropdownProps> = ({ 
  options, 
  value, 
  subValue,
  onChange, 
  placeholder = "Select an option",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainClick = (option: ZenDropdownOption) => {
    if (option.children) {
      setActiveSubMenu(activeSubMenu === option.value ? null : option.value);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setActiveSubMenu(null);
    }
  };

  const handleSubClick = (mainOption: ZenDropdownOption, subOption: ZenDropdownOption) => {
    onChange(mainOption.value, subOption.value);
    setIsOpen(false);
    setActiveSubMenu(null);
  };

  const selectedOption = options.find(opt => opt.value === value);
  const selectedSubOption = selectedOption?.children?.find(opt => opt.value === subValue);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent border-none px-4 text-white text-[14px] outline-none cursor-pointer h-full"
      >
        <span className={!value ? "text-[#9CA3AF]/50" : ""}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.label}
              {selectedSubOption && (
                <>
                  <span className="text-[#9CA3AF]/40 text-xs">/</span>
                  <span className="text-emerald-400 font-bold text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    {selectedSubOption.label}
                  </span>
                </>
              )}
            </span>
          ) : placeholder}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-[#9CA3AF]'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#121214] border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[100] overflow-visible backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="py-1">
            {options.map((option) => (
              <div 
                key={option.value} 
                className="relative group"
                onMouseEnter={() => option.children && setActiveSubMenu(option.value)}
              >
                <button
                  type="button"
                  onClick={() => handleMainClick(option)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] transition-all ${
                    value === option.value 
                      ? 'text-emerald-400 bg-white/[0.03]' 
                      : 'text-[#E5E7EB] hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.children && <ChevronRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />}
                </button>

                {/* Sub Menu */}
                {option.children && activeSubMenu === option.value && (
                  <div className="absolute top-0 left-full ml-1 w-[160px] bg-[#121214] border border-white/10 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] z-[110] py-1 animate-[slideIn_0.2s_ease-out]">
                    {option.children.map((sub) => (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => handleSubClick(option, sub)}
                        className={`w-full text-left px-4 py-2 text-[12px] transition-all ${
                          subValue === sub.value 
                            ? 'text-emerald-400 bg-white/[0.03] font-bold' 
                            : 'text-[#9CA3AF] hover:text-white hover:bg-white/[0.03]'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </div>
  );
};

export default ZenDropdown;
