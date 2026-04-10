import React from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Calendar, 
  ChevronDown 
} from 'lucide-react';

const TLog_zone1_Form: React.FC = () => {
  return (
    <section className="tlog-section">
      <div className="tlog-section-header">
        <div className="tlog-header-top">
          <div className="tlog-title-wrapper">
            <div className="tlog-accent-bar"></div>
            <h2 className="tlog-section-title">เพิ่มเข้าบันทึก</h2>
          </div>
          <div className="tlog-utility-group">
            <button className="utility-btn secondary-hd">
              <Upload size={14} color="#10B981" />
              <span>นำเข้า (Import)</span>
            </button>
            <button className="utility-btn secondary-hd">
              <Download size={14} color="#10B981" />
              <span>ส่งออก (Export)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="tlog-form-card">
        <div className="tlog-form-grid">
          {/* Row 1 */}
          <div className="tlog-field-group">
            <label className="tlog-label">วันที่</label>
            <div className="tlog-input-wrapper">
              <input type="text" defaultValue="04/08/2026" />
              <Calendar size={18} className="tlog-input-icon" />
            </div>
          </div>

          <div className="tlog-field-group">
            <label className="tlog-label">ประเภท</label>
            <div className="tlog-input-wrapper">
              <select defaultValue="BUY">
                <option value="BUY">BUY</option>
                <option value="SELL">SELL</option>
                <option value="DIVIDEND">DIVIDEND</option>
              </select>
              <ChevronDown size={18} className="tlog-input-icon" />
            </div>
          </div>

          <div className="tlog-field-group">
            <label className="tlog-label">สินทรัพย์</label>
            <div className="tlog-input-wrapper">
              <input type="text" placeholder="เช่น BTC, AAPL" />
              <div className="tlog-divider-line"></div>
              <div className="tlog-asset-tag">หุ้น</div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="tlog-field-group">
            <label className="tlog-label">จำนวน</label>
            <div className="tlog-input-wrapper">
              <input type="number" placeholder="0.00" />
            </div>
          </div>

          <div className="tlog-field-group">
            <label className="tlog-label">ราคาต่อหน่วย</label>
            <div className="tlog-input-wrapper">
              <span className="tlog-prefix">USD</span>
              <input type="number" placeholder="0.00" />
            </div>
          </div>

          <div className="tlog-field-group">
            <label className="tlog-label">ค่าธรรมเนียม</label>
            <div className="tlog-input-wrapper">
              <input type="number" placeholder="0.00" />
            </div>
          </div>
        </div>

        <div className="tlog-form-footer">
          <div className="tlog-field-group tlog-memo-field">
            <label className="tlog-label">บันทึกช่วยจำ</label>
            <div className="tlog-textarea-wrapper">
              <textarea placeholder="เหตุผล, แพลตฟอร์ม, ฯลฯ"></textarea>
            </div>
          </div>
          
          <button className="btn-submit-emerald">
            <div className="circle-icon-bg">
              <Plus size={18} />
            </div>
            <span>เพิ่มเข้าบันทึก</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TLog_zone1_Form;
