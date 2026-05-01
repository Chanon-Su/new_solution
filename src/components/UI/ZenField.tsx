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
      <label className="zen-field-label text-xs font-semibold text-[var(--text-secondary)] tracking-wide">{label}</label>
      <div className={`zen-field-input-wrapper relative flex ${multiline ? 'items-start' : 'items-center h-[46px]'} bg-[var(--obsidian-void)] border border-[var(--glass-border)] rounded-xl transition-all duration-200 focus-within:border-[var(--neon-emerald)] focus-within:shadow-[0_0_0_1px_var(--neon-emerald)]`}>
        {children}
      </div>
    </div>
  );
};

export default ZenField;
