import React, { useState } from 'react';
import { 
  MessageSquare, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Bitcoin,
  Apple,
  Cpu
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND';
  category: string;
  asset: string;
  symbol: string;
  amount: string;
  price: string;
  total: string;
  icon: any;
  iconColor: string;
}

const TLog_zone3_History: React.FC = () => {
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const mockTransactions: Transaction[] = [
    { 
      id: '1', 
      date: '08-Apr-2026', 
      type: 'BUY', 
      category: 'Crypto', 
      asset: 'Bitcoin', 
      symbol: 'BTC', 
      amount: '0.0520', 
      price: '$64,250.00', 
      total: '$3,341.00',
      icon: Bitcoin,
      iconColor: '#f59e0b'
    },
    { 
      id: '2', 
      date: '07-Apr-2026', 
      type: 'BUY', 
      category: 'Stock', 
      asset: 'Apple Inc.', 
      symbol: 'AAPL', 
      amount: '15.00', 
      price: '$168.45', 
      total: '$2,526.75',
      icon: Apple,
      iconColor: '#FFFFFF'
    },
    { 
      id: '3', 
      date: '06-Apr-2026', 
      type: 'BUY', 
      category: 'Crypto', 
      asset: 'Ethereum', 
      symbol: 'ETH', 
      amount: '1.2500', 
      price: '$3,450.10', 
      total: '$4,312.62',
      icon: Cpu,
      iconColor: '#6366f1'
    },
  ];

  return (
    <section className="tlog-section">
      <div className="table-frame">
        <div className="tlog-section-header">
          <div className="tlog-title-wrapper-stacked">
            <div className="tlog-title-wrapper">
              <div className="tlog-accent-bar"></div>
              <h2 className="tlog-section-title">ประวัติสินทรัพย์ (Asset History)</h2>
            </div>
            <p className="tlog-section-subtitle">ทุกรายการคือเมล็ดพันธุ์ ทุกบันทึกคือรากฐาน</p>
          </div>
        </div>

        <div className="tlog-table-container">
          <table className="zen-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ประเภท</th>
                <th>ประเภท (CATEGORY)</th>
                <th>สินทรัพย์</th>
                <th>จำนวน</th>
                <th>ราคา (USD)</th>
                <th>มูลค่ารวม</th>
                <th>โน้ต</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="date-text">{tx.date}</td>
                  <td>
                    <span className="type-badge">{tx.type}</span>
                  </td>
                  <td style={{ color: 'var(--muted-grey)' }}>{tx.category}</td>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon-circle">
                        <tx.icon size={16} color={tx.iconColor} />
                      </div>
                      <span className="asset-name-bold">{tx.asset}</span>
                      <span className="asset-symbol-muted">({tx.symbol})</span>
                    </div>
                  </td>
                  <td>{tx.amount}</td>
                  <td>{tx.price}</td>
                  <td className="total-value-bold">{tx.total}</td>
                  <td>
                    <MessageSquare size={18} className="action-icon-btn" />
                  </td>
                  <td>
                    <div className="action-btns-cell">
                      <Pencil size={18} className="action-icon-btn" />
                      <Trash2 size={18} className="action-icon-btn delete" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-footer">
          <div className="rows-info">
            <span>Rows per page:</span>
            <div className="rows-selector">
              {[10, 25, 50].map((num) => (
                <div 
                  key={num} 
                  className={`rows-btn ${rowsPerPage === num ? 'active' : ''}`}
                  onClick={() => setRowsPerPage(num)}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div className="pagination-controls">
            <span>Showing 1-3 of 25</span>
            <div className="arrow-nav">
              <button className="nav-btn" disabled>
                <ChevronLeft size={20} color="var(--muted-grey)" />
              </button>
              <button className="nav-btn">
                <ChevronRight size={20} color="var(--snow-white)" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TLog_zone3_History;
