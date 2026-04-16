import React, { useState, useMemo, useEffect } from 'react';
import HistoryTable from './HistoryTable';
import HistoryPagination from './HistoryPagination';
import { useTLog } from '../../hooks/TLogManager';

const TLog_zone3_History: React.FC = () => {
  const { transactions, removeTransaction, isLoading } = useTLog();
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return transactions.slice(startIndex, startIndex + rowsPerPage);
  }, [transactions, currentPage, rowsPerPage]);

  // Handle case where items are deleted and current page becomes empty
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(transactions.length / rowsPerPage));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [transactions.length, rowsPerPage, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <section className="flex flex-col gap-5">
        <div className="bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl p-20 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-[#10B981]/30 border-t-[#10B981] rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <div className="mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">ประวัติสินทรัพย์ (Asset History)</h2>
            </div>
            <p className="text-[#9CA3AF] text-[15px] opacity-40 ml-5 pt-1">ทุกรายการคือเมล็ดพันธุ์ ทุกบันทึกคือรากฐาน</p>
          </div>
        </div>

        <HistoryTable 
          transactions={paginatedTransactions} 
          onDelete={removeTransaction}
        />

        {transactions.length > 0 && (
          <HistoryPagination 
            rowsPerPage={rowsPerPage}
            setRowsPerPage={(val) => {
              setRowsPerPage(val);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            totalRows={transactions.length}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
};

export default TLog_zone3_History;
