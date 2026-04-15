import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HistoryPaginationProps {
  rowsPerPage: number;
  setRowsPerPage: (num: number) => void;
  currentPage: number;
  totalRows: number;
}

const HistoryPagination: React.FC<HistoryPaginationProps> = ({
  rowsPerPage,
  setRowsPerPage,
  currentPage,
  totalRows
}) => {
  // Mock range for display
  const start = (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(start + rowsPerPage - 1, totalRows);

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
      <div className="flex items-center gap-4 text-[15px] text-[#9CA3AF]">
        <span>Rows per page:</span>
        <div className="flex items-center bg-black/30 border border-[rgba(255,255,255,0.08)] rounded-lg overflow-hidden">
          {[10, 25, 50].map((num) => (
            <div 
              key={num} 
              className={`px-3.5 py-1.5 cursor-pointer font-medium transition-all duration-200 ${rowsPerPage === num ? 'bg-[#10B981] text-black' : 'text-[#9CA3AF]'}`}
              onClick={() => setRowsPerPage(num)}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 text-[15px] text-[#9CA3AF]">
        <span>Showing {start}-{Math.min(end, totalRows)} of {totalRows}</span>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 hover:not-disabled:border-white/20" disabled={currentPage === 1}>
            <ChevronLeft size={20} className="text-[#9CA3AF]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-[rgba(255,255,255,0.08)] rounded-lg transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed hover:not-disabled:bg-white/10 hover:not-disabled:border-white/20">
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryPagination;
