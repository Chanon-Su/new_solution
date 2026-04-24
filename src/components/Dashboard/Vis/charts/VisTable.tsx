import React from 'react';
import type { VisTableRow } from '../../../../hooks/useVisData';

const TYPE_COLORS: Record<string, string> = {
  BUY: '#10b981',
  SELL: '#ef4444',
  DIVIDEND: '#3b82f6',
};

interface VisTableProps {
  rows: VisTableRow[];
}

const VisTable: React.FC<VisTableProps> = ({ rows }) => (
  <div className="vis-table-wrapper">
    <div className="vis-table-scroll">
      <table className="vis-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Asset</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id}>
              <td className="vis-table__date">{row.date.slice(0, 10)}</td>
              <td>
                <span
                  className="vis-table__badge"
                  style={{ background: `${TYPE_COLORS[row.type]}20`, color: TYPE_COLORS[row.type] }}
                >
                  {row.type}
                </span>
              </td>
              <td className="vis-table__asset">{row.asset}</td>
              <td className="vis-table__number">{row.amount.toLocaleString()}</td>
              <td className="vis-table__number">
                {row.currency} {row.price.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="vis-table__empty">ไม่มีข้อมูล</div>
      )}
    </div>
  </div>
);

export default VisTable;
