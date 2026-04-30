import React from 'react';

interface ZenFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  multiline?: boolean;
}

const ZenField: React.FC<ZenFieldProps> = ({ label, children, className = "", multiline = false }) => {
  return (
    <div className={`zen-field-container flex flex-col gap-2.5 ${className}`}>
      <label className="zen-field-label text-xs font-semibold text-[#9CA3AF] tracking-wide">{label}</label>
      <div className={`zen-field-input-wrapper relative flex ${multiline ? 'items-start' : 'items-center h-[46px]'} bg-[#0a0a0a] border border-white/[0.05] rounded-xl transition-all duration-200 focus-within:border-[#10B981] focus-within:shadow-[0_0_0_1px_#10B981]`}>
        {children}
      </div>
    </div>
  );
};

export default ZenField;
