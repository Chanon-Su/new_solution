import React, { useState, useMemo, useRef } from 'react';
import { Transaction } from '../App';
import './TLog.css';

interface TLogProps {
  transactions: Transaction[];
  onAdd: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onImport: (txs: Transaction[]) => void;
}

const TLog: React.FC<TLogProps> = ({ transactions, onAdd, onDelete, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'BUY',
    asset: '',
    category: 'Crypto',
    amount: '',
    price: '',
    currency: 'THB',
    fee: '',
    notes: ''
  });

  // Calculate Asset Summary logic
  const assetSummary = useMemo(() => {
    const summary: Record<string, { asset: string; category: string; amount: number; lastUpdate: number }> = {};
    
    // Process transactions in chronological order (or just track last update)
    [...transactions].reverse().forEach(tx => {
      if (!summary[tx.asset]) {
        summary[tx.asset] = { asset: tx.asset, category: tx.category, amount: 0, lastUpdate: 0 };
      }
      
      const amt = Number(tx.amount);
      if (tx.type === 'BUY' || tx.type === 'DIVIDEND') {
        summary[tx.asset].amount += amt;
      } else if (tx.type === 'SELL') {
        summary[tx.asset].amount -= amt;
      }
      summary[tx.asset].lastUpdate = Math.max(summary[tx.asset].lastUpdate, new Date(tx.date).getTime());
    });

    return Object.values(summary)
      .filter(s => Math.abs(s.amount) > 0.00000001) // Filter out zero balance
      .sort((a, b) => b.lastUpdate - a.lastUpdate); // Sort by recency
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      ...formData,
      amount: Number(formData.amount),
      price: Number(formData.price),
      fee: Number(formData.fee) || 0,
      type: formData.type as 'BUY' | 'SELL' | 'DIVIDEND',
      currency: formData.currency as 'THB' | 'USD'
    };
    onAdd(newTx);
    setFormData({ ...formData, asset: '', amount: '', price: '', fee: '', notes: '' });
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;
    
    const headers = ['id', 'date', 'type', 'asset', 'category', 'amount', 'price', 'currency', 'fee', 'notes'];
    const rows = transactions.map(tx => [
      tx.id, tx.date, tx.type, tx.asset, tx.category, tx.amount, tx.price, tx.currency, tx.fee, `"${tx.notes.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `alpha_tlog_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const newTransactions: Transaction[] = lines.slice(1).filter(line => line.trim()).map(line => {
        // Simple CSV parser for fixed schema
        const values = line.split(',');
        return {
          id: values[0],
          date: values[1],
          type: values[2] as any,
          asset: values[3],
          category: values[4],
          amount: Number(values[5]),
          price: Number(values[6]),
          currency: values[7] as any,
          fee: Number(values[8]),
          notes: values[9].replace(/^"|"$/g, '').replace(/""/g, '"')
        };
      });
      
      if (newTransactions.length > 0) {
        onImport(newTransactions);
        alert(`นำเข้าสำเร็จ ${newTransactions.length} รายการ`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="tlog-page">
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".csv" 
        onChange={handleFileChange}
      />
      
      {/* Zone 1: Add to Log */}
      <section className="zone zone-1 glass-panel">
        <div className="zone-header">
          <div className="accent-bar"></div>
          <h2>เพิ่มประวัติสินทรัพย์ <span className="sub-header">(Add To Log)</span></h2>
          <div className="batch-tools">
            <button className="batch-btn" onClick={handleImportClick}>นำเข้า (Import)</button>
            <button className="batch-btn" onClick={exportToCSV}>ส่งออก (Export)</button>
          </div>
        </div>

        <form className="add-log-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>วันที่ (Date)</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>ประเภท (Type)</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="BUY">ซื้อ (Buy)</option>
                <option value="SELL">ขาย (Sell)</option>
                <option value="DIVIDEND">ปันผล (Dividend)</option>
              </select>
            </div>
            <div className="form-group">
              <label>ชื่อสินทรัพย์ (Asset)</label>
              <input type="text" placeholder="เช่น BTC, SET50" value={formData.asset} onChange={(e) => setFormData({...formData, asset: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>หมวดหมู่ (Category)</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Crypto">Crypto</option>
                <option value="หุ้น">หุ้น</option>
                <option value="ทองคำ">ทองคำ</option>
                <option value="กองทุน">กองทุน</option>
              </select>
            </div>
            <div className="form-group">
              <label>จำนวน (Amount)</label>
              <input type="number" step="any" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>ราคาต่อหน่วย (Price)</label>
              <div className="price-input-group">
                <input type="number" step="any" placeholder="0.00" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                <select value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})}>
                  <option value="THB">THB</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>ค่าธรรมเนียม (Fee)</label>
              <input type="number" step="any" placeholder="0.00" value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})} />
            </div>
          </div>
          <div className="form-group full-width">
            <label>บันทึกเพิ่มเติม (Notes)</label>
            <textarea rows={2} placeholder="เหตุผลการซื้อขาย หรือ แพลตฟอร์ม..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          
          <button type="submit" className="submit-btn">
            <span className="plus-icon">+</span> เพิ่มเข้าบันทึก
          </button>
        </form>
      </section>

      {/* Zone 2: Asset Summary Carousel */}
      <section className="zone zone-2">
        <div className="zone-header">
          <div className="accent-bar"></div>
          <h2>สรุปจำนวนสินทรัพย์ <span className="sub-header">(Asset Summary)</span></h2>
        </div>
        <div className="asset-carousel">
          {assetSummary.length === 0 ? (
            <div className="asset-card glass-panel placeholder">
              <span className="card-label">ยังไม่มีข้อมูลสินทรัพย์</span>
            </div>
          ) : (
            assetSummary.map(item => (
              <div key={item.asset} className="asset-card glass-panel">
                <div className="asset-card-header">
                  <span className="asset-symbol">{item.asset}</span>
                  <span className="asset-cat">{item.category}</span>
                </div>
                <div className="asset-card-body">
                  <span className="asset-amount">{item.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                  <span className="asset-unit">Units</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Zone 3: History Table */}
      <section className="zone zone-3 glass-panel">
        <div className="zone-header">
          <div className="accent-bar"></div>
          <h2>ประวัติธุรกรรม <span className="sub-header">(History)</span></h2>
        </div>
        
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>ประเภท</th>
                <th>สินทรัพย์</th>
                <th>จำนวน</th>
                <th>ราคา</th>
                <th>มูลค่ารวม</th>
                <th>โน้ต</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-row">ไม่พบบันทึกธุรกรรม</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>
                      <span className={`type-badge ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>
                      <div className="asset-info">
                        <strong>{tx.asset}</strong>
                        <span className="category-label">{tx.category}</span>
                      </div>
                    </td>
                    <td>{tx.amount.toLocaleString()}</td>
                    <td>{tx.price.toLocaleString()} {tx.currency}</td>
                    <td>{(tx.amount * tx.price).toLocaleString()} {tx.currency}</td>
                    <td>
                      {tx.notes && (
                        <div className="note-tooltip-trigger">
                          📝
                          <div className="note-tooltip">{tx.notes}</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn" title="แก้ไข" onClick={() => alert('ฟีเจอร์แก้ไขจะตามมาในเร็วๆ นี้')}>✏️</button>
                        <button className="icon-btn" title="ลบ" onClick={() => onDelete(tx.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TLog;
