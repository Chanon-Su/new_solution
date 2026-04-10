import React from 'react';
import TLog_zone1_Form from './TLog_zone1_Form';
import TLog_zone2_Summary from './TLog_zone2_Summary';
import TLog_zone3_History from './TLog_zone3_History';

const TLog: React.FC = () => {
  return (
    <div className="max-w-[var(--content-max-width)] mx-auto px-10 py-10 flex flex-col gap-16 animate-[tlogFadeIn_0.8s_ease-in-out]">
      {/* Zone 1: Add Transaction Form */}
      <TLog_zone1_Form />

      {/* Zone 2: Asset Summary Carousel */}
      <TLog_zone2_Summary />

      {/* Zone 3: Transaction History Table */}
      <TLog_zone3_History />
    </div>
  );
};

export default TLog;
