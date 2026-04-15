import React, { useState } from 'react';
import HistoryTable from './HistoryTable';
import HistoryPagination from './HistoryPagination';
import { mockTransactions } from './mockData';

const TLog_zone3_History: React.FC = () => {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-[#121214] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden p-8">
        <div className="mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="w-1 h-6 bg-[#10B981] rounded-sm shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
              <h2 className="text-2xl font-semibold text-white tracking-tight">ประวัติสินทรัพย์ (Asset History)</h2>
            </div>
            <p className="text-[#9CA3AF] text-[15px] opacity-60 ml-5 pt-1">ทุกรายการคือเมล็ดพันธุ์ ทุกบันทึกคือรากฐาน</p>
          </div>
        </div>

        <HistoryTable transactions={mockTransactions} />

        <HistoryPagination 
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          currentPage={currentPage}
          totalRows={25}
        />
      </div>
    </section>
  );
};

export default TLog_zone3_History;
