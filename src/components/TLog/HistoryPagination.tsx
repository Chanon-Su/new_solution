import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryPaginationProps {
  rowsPerPage: number;
  setRowsPerPage: (num: number) => void;
  currentPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}

const HistoryPagination: React.FC<HistoryPaginationProps> = ({
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  totalRows,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const start = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, totalRows);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-[var(--glass-border)]">
      <div className="flex items-center gap-4 text-[15px] text-[var(--text-secondary)]">
        <span className="text-[13px] font-medium opacity-60 uppercase tracking-wider">Rows per page:</span>
        <div className="flex items-center bg-[var(--obsidian-void)] border border-[var(--glass-border)] rounded-lg overflow-hidden">
          {[10, 25, 50].map((num) => (
            <div 
              key={num} 
              className={`px-3.5 py-1.5 cursor-pointer font-bold text-[13px] transition-all duration-300 ${rowsPerPage === num ? 'bg-[var(--neon-emerald)] text-black px-5' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5'}`}
              onClick={() => setRowsPerPage(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 text-[15px] text-[var(--text-secondary)]">
        <span className="text-[14px] font-medium">
          <span className="text-[var(--text-primary)]">{start}-{end}</span> <span className="opacity-40">of</span> <span className="text-[var(--text-primary)] font-bold">{totalRows}</span>
        </span>
        <div className="flex gap-2">
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[var(--glass-border)] rounded-lg transition-all duration-300 disabled:opacity-5 disabled:cursor-not-allowed hover:not-disabled:bg-[var(--neon-emerald)]/10 hover:not-disabled:border-[var(--neon-emerald)]/40" 
            disabled={currentPage === 1}
            onClick={handlePrev}
          >
            <ChevronLeft size={20} className={currentPage === 1 ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'} />
          </button>
          <button 
            className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg transition-all duration-300 disabled:opacity-5 disabled:cursor-not-allowed hover:not-disabled:bg-[#10B981]/10 hover:not-disabled:border-[#10B981]/40" 
            disabled={currentPage >= totalPages}
            onClick={handleNext}
          >
            <ChevronRight size={20} className={currentPage >= totalPages ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPagination;
