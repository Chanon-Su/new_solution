import React from 'react';
import TLog_zone1_Form from './TLog_zone1_Form';
import TLog_zone2_Summary from './TLog_zone2_Summary';
import TLog_zone3_History from './TLog_zone3_History';
import './TLog.css';

const TLog: React.FC = () => {
  return (
    <div className="tlog-main-container">
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
