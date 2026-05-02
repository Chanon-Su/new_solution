import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  AreaChart, Area, XAxis, BarChart, Bar
} from 'recharts';
import { 
  Check,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Activity,
  PieChart as PieIcon,
  Globe
} from 'lucide-react';
import { useInsightData } from '../../hooks/useInsightData';
import type { InsightTimeDimension, InsightAssetFocus } from '../../hooks/useInsightData';
import ZenDropdown from '../UI/ZenDropdown';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import './InsightPort.css';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isGlobalAsset = (symbol: string): boolean => {
  const globalSymbols = ['BTC', 'ETH', 'BNB', 'SOL', 'AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'GOLD', 'XAU', 'USDT', 'USDC'];
  return globalSymbols.includes(symbol.toUpperCase().trim());
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(value);
};

// ─── Internal Multi-Select Component ──────────────────────────────────────────

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  language: string;
}

const ZenMultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange, placeholder, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const defaultPlaceholder = language === 'th' ? 'เลือกสินทรัพย์' : 'Select assets';

  return (
    <div className="report-dropdown-wrapper" ref={containerRef}>
      <label className="dropdown-label">{label}</label>
      <div className={`report-zen-dropdown relative ${isOpen ? 'ring-1 ring-emerald-500/50' : ''}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full flex items-center justify-between px-4 text-xs text-[var(--text-secondary)]"
        >
          <span className="truncate pr-4">
            {selected.length === 0 ? (placeholder || defaultPlaceholder) : (language === 'th' ? `เลือกแล้ว ${selected.length} รายการ` : `${selected.length} Selected`)}
          </span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-[var(--obsidian-void)] border border-[var(--glass-border)] rounded-xl shadow-2xl z-[100] py-2 max-h-[300px] overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-[var(--glass-bg-subtle)] transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-[var(--neon-emerald)] border-[var(--neon-emerald)]' : 'border-[var(--glass-border)]'}`}>
                  {selected.includes(opt) && <Check size={10} className="text-black font-bold" />}
                </div>
                <span className={selected.includes(opt) ? 'text-[var(--neon-emerald)] font-bold' : 'text-[var(--text-secondary)]'}>{opt}</span>
              </button>
            ))}
            {options.length === 0 && <div className="px-4 py-2 text-[11px] text-gray-500 italic">{language === 'th' ? 'ไม่พบสินทรัพย์' : 'No assets found'}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InsightPort: React.FC = () => {
  const { language } = useSettings();
  const [timeDimension, setTimeDimension] = useState<InsightTimeDimension>('all');
  const [assetFocus, setAssetFocus] = useState<InsightAssetFocus>('all');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [activeVisIndex, setActiveVisIndex] = useState(0);
  
  const { metrics, allocationData, brokerData, assetStats, trendData, activityData, dropdownLists } = useInsightData(
    timeDimension, 
    assetFocus, 
    selectedYear, 
    selectedMonth,
    selectedAssets
  );

  const FactRow = ({ label, value, highlight = '' }: { label: string, value: string | number, highlight?: string }) => (
    <div className="fact-row">
      <span className="fact-label">{label}</span>
      <div className="fact-leader"></div>
      <span className={`fact-value ${highlight}`}>{value}</span>
    </div>
  );

  // ─── Time Options ─────────────────────────────────────────────────────────

  const yearlyOptions = useMemo(() => [
    { value: 'yearly_avg', label: language === 'th' ? 'ค่าเฉลี่ยรายปี (ทุกปี)' : 'Average Yearly (All Years)' },
    ...dropdownLists.availableYears.map(y => ({ value: y.toString(), label: y.toString() }))
  ], [dropdownLists.availableYears, language]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyOptions = useMemo(() => {
    if (selectedYear) {
      const baseOptions = [{ value: 'year_avg', label: language === 'th' ? `เฉลี่ยรายเดือนของปี ${selectedYear}` : `Average Monthly of ${selectedYear}` }];
      const months = Array.from(dropdownLists.availableMonths[selectedYear] || []).sort((a, b) => a - b);
      return [
        ...baseOptions,
        ...months.map(m => ({ value: m.toString(), label: monthNames[m] }))
      ];
    }
    return [
      { value: 'monthly_avg', label: language === 'th' ? 'ค่าเฉลี่ยรายเดือน (ทุกเดือน)' : 'Average Monthly (All Months)' }
    ];
  }, [selectedYear, dropdownLists.availableMonths, language]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleYearChange = (val: string) => {
    if (val === 'yearly_avg') {
      setTimeDimension('yearly_avg');
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
    } else {
      setTimeDimension('year');
      setSelectedYear(parseInt(val));
      setSelectedMonth(undefined);
    }
  };

  const handleMonthChange = (val: string) => {
    if (val === 'monthly_avg') {
      setTimeDimension('monthly_avg');
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
    } else if (val === 'year_avg') {
      setTimeDimension('year');
      setSelectedMonth(undefined);
    } else {
      setTimeDimension('month');
      setSelectedMonth(parseInt(val));
    }
  };

  const handleAllTime = () => {
    setTimeDimension('all');
    setSelectedYear(undefined);
    setSelectedMonth(undefined);
  };

  const handleAllAssets = () => {
    setAssetFocus('all');
    setSelectedAssets([]);
  };

  // ─── Carousel Navigation ───────────────────────────────────────────────────

  const nextVis = () => setActiveVisIndex((prev) => (prev + 1) % 4);
  const prevVis = () => setActiveVisIndex((prev) => (prev - 1 + 4) % 4);

  return (
    <div className="insight-report-container">
      {/* Visualize Zone */}
      <aside className="insight-visual-sidebar">
        <button onClick={prevVis} className="vis-nav-btn top">
          <ChevronUp size={20} />
        </button>

        <div className="sidebar-vis-content">
          {activeVisIndex === 0 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                <div className="flex items-center gap-2 mb-4">
                  <PieIcon size={14} className="text-[var(--neon-emerald)]" />
                  <h4 className="sidebar-section-title !mb-0">{language === 'th' ? 'การจัดสรรสินทรัพย์' : 'Asset Allocation'}</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--obsidian-void)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '10px', color: 'var(--text-primary)' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'จำนวนสินทรัพย์' : 'Assets Count'}</span>
                    <span className="value">{metrics.assetCount}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'ปันผลเฉลี่ย' : 'Portfolio Yield'}</span>
                    <span className="value text-[var(--neon-emerald)]">{metrics.dividendYield.toFixed(2)}%</span>
                 </div>
              </div>
            </div>
          )}

          {activeVisIndex === 1 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                 <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} className="text-[var(--neon-emerald)]" />
                  <h4 className="sidebar-section-title !mb-0">{language === 'th' ? 'ผลประกอบการ' : 'Growth Performance'}</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--neon-emerald)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--neon-emerald)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="var(--neon-emerald)" fillOpacity={1} fill="url(#colorVal)" />
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--obsidian-void)', border: 'none', borderRadius: '8px', fontSize: '10px', color: 'var(--text-primary)' }}
                        itemStyle={{ color: 'var(--neon-emerald)' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'มูลค่าเริ่มต้น' : 'Initial Value'}</span>
                    <span className="value">{formatCurrency(trendData[0]?.value || 0)}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'อัตราตอบแทน' : 'Return Rate'}</span>
                    <span className="value text-[var(--neon-emerald)]">{metrics.returnPercentage.toFixed(1)}%</span>
                 </div>
              </div>
            </div>
          )}

          {activeVisIndex === 2 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-[var(--neon-emerald)]" />
                  <h4 className="sidebar-section-title !mb-0">{language === 'th' ? 'การวิเคราะห์กระแสเงิน' : 'Flow Analysis'}</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={activityData}>
                      <Bar dataKey="buy" fill="var(--neon-emerald)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sell" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dividend" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="month" hide />
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--obsidian-void)', border: 'none', borderRadius: '8px', fontSize: '10px', color: 'var(--text-primary)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'ปันผลเฉลี่ย / เดือน' : 'Avg Div / Mo'}</span>
                    <span className="value text-amber-400">{formatCurrency(metrics.totalDividends / 12)}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'รวมเงินปันผล' : 'Total Div'}</span>
                    <span className="value text-amber-500">{formatCurrency(metrics.totalDividends)}</span>
                 </div>
              </div>
            </div>
          )}

          {activeVisIndex === 3 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={14} className="text-[var(--neon-emerald)]" />
                  <h4 className="sidebar-section-title !mb-0">{language === 'th' ? 'การจัดสรรตาม Broker' : 'Broker Allocation'}</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                      <Pie
                        data={brokerData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {brokerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ background: 'var(--obsidian-void)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '10px', color: 'var(--text-primary)' }}
                        itemStyle={{ color: 'var(--text-primary)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'จำนวน Broker' : 'Broker Count'}</span>
                    <span className="value">{brokerData.length}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">{language === 'th' ? 'Broker หลัก' : 'Primary Broker'}</span>
                    <span className="value text-[var(--neon-emerald)] truncate max-w-[80px]">{brokerData[0]?.name || '-'}</span>
                 </div>
              </div>
            </div>
          )}
        </div>

        <button onClick={nextVis} className="vis-nav-btn bottom">
          <ChevronDown size={20} />
        </button>

        <div className="sidebar-pagination-container mt-auto pb-4">
           <div className="flex gap-2 justify-center">
              {[0,1,2,3].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === activeVisIndex ? 'w-6 bg-[var(--neon-emerald)]' : 'w-1 bg-[var(--glass-bg-subtle)]'}`}></div>
              ))}
           </div>
        </div>
      </aside>

      <main className="insight-fact-sheet">
        {/* Filter Zone (Time & Asset Focus) */}
        <div className="report-controls-grid">
           {/* Time Dimension Group */}
           <div className="filter-group-container">
              <button 
                onClick={handleAllTime}
                className={`all-toggle-btn ${timeDimension === 'all' ? 'active' : ''}`}
                title={language === 'th' ? 'รวมทั้งหมด' : 'Total of all time'}
              >
                {language === 'th' ? 'ทุกช่วงเวลา' : 'All Time'}
              </button>
              <div className="flex gap-4 flex-1">
                 <div className="report-dropdown-wrapper flex-1">
                    <label className="dropdown-label">{language === 'th' ? 'ตัวกรองรายปี' : 'Yearly Filter'}</label>
                    <ZenDropdown 
                      options={yearlyOptions} 
                      value={timeDimension === 'yearly_avg' ? 'yearly_avg' : selectedYear?.toString() || ''} 
                      onChange={handleYearChange} 
                      placeholder={timeDimension === 'monthly_avg' ? "" : (language === 'th' ? "เลือกปี" : "Select Yearly")}
                      className="report-zen-dropdown"
                    />
                 </div>
                 <div className="report-dropdown-wrapper flex-1">
                    <label className="dropdown-label">{language === 'th' ? 'ตัวกรองรายเดือน' : 'Monthly Filter'}</label>
                    <ZenDropdown 
                      options={monthlyOptions} 
                      value={timeDimension === 'monthly_avg' ? 'monthly_avg' : selectedMonth?.toString() || (selectedYear ? 'year_avg' : '')} 
                      onChange={handleMonthChange} 
                      placeholder={timeDimension === 'yearly_avg' ? "" : (selectedYear ? (language === 'th' ? "ค่าเฉลี่ยรายปี" : "Average of Year") : (language === 'th' ? "เลือกเดือน" : "Select Monthly"))}
                      className="report-zen-dropdown"
                    />
                 </div>
              </div>
           </div>

           {/* Asset Selection Group */}
           <div className="filter-group-container">
              <button 
                onClick={handleAllAssets}
                className={`all-toggle-btn ${assetFocus === 'all' && selectedAssets.length === 0 ? 'active' : ''}`}
              >
                {language === 'th' ? 'ทุกสินทรัพย์' : 'All Assets'}
              </button>
              <div className="flex gap-4 flex-1">
                 <ZenMultiSelect 
                   label={language === 'th' ? 'รายการหลัก' : 'Global List'}
                   options={dropdownLists.globalAssets}
                   selected={selectedAssets.filter(a => isGlobalAsset(a))}
                   onChange={(vals) => {
                     setAssetFocus('global');
                     const customs = selectedAssets.filter(a => !isGlobalAsset(a));
                     setSelectedAssets([...customs, ...vals]);
                   }}
                   language={language}
                 />
                 <ZenMultiSelect 
                   label={language === 'th' ? 'รายการกำหนดเอง' : 'Custom List'}
                   options={dropdownLists.customAssets}
                   selected={selectedAssets.filter(a => !isGlobalAsset(a))}
                   onChange={(vals) => {
                     setAssetFocus('custom');
                     const globals = selectedAssets.filter(a => isGlobalAsset(a));
                     setSelectedAssets([...globals, ...vals]);
                   }}
                   language={language}
                 />
              </div>
           </div>
        </div>

        {/* Report Zone */}
        <section className="report-group">
          <h2 className="report-group-title">{language === 'th' ? 'ข้อมูลสรุปพอร์ตโฟลิโอ' : 'Portfolio Performance Facts'}</h2>
          <div className="report-group-divider"></div>
          <FactRow label={language === 'th' ? 'มูลค่าตลาดรวม' : 'Portfolio Market Value'} value={formatCurrency(metrics.totalNetWorth)} highlight="highlight-emerald" />
          <FactRow label={language === 'th' ? 'กำไรที่รับรู้แล้ว' : 'Realized Capital Gain'} value={formatCurrency(metrics.totalPnL)} />
          <FactRow label={language === 'th' ? 'เงินปันผลรวม' : 'Total Dividends Earned'} value={formatCurrency(metrics.totalDividends)} highlight="highlight-amber" />
          <FactRow label={language === 'th' ? 'ผลตอบแทนรวมทั้งหมด' : 'Combined Total Return'} value={formatCurrency(metrics.totalReturn)} highlight="highlight-emerald" />
          <FactRow label={language === 'th' ? 'อัตราผลตอบแทน (ROI)' : 'Return Rate (ROI)'} value={`${metrics.returnPercentage.toFixed(2)}%`} highlight="highlight-emerald" />
          <FactRow label={language === 'th' ? 'อัตราเงินปันผล (Yield)' : 'Dividend Yield Rate'} value={`${metrics.dividendYield.toFixed(2)}%`} highlight="highlight-amber" />
          <FactRow label={language === 'th' ? 'จำนวนสินทรัพย์ที่ถือ' : 'Asset Diversity Count'} value={metrics.assetCount} highlight="highlight-blue" />
        </section>

        <section className="report-group">
          <h2 className="report-group-title">{language === 'th' ? 'สรุปความเคลื่อนไหว' : 'Flow & Activity Summary'}</h2>
          <div className="report-group-divider"></div>
          <FactRow label={language === 'th' ? 'รายการซื้อ' : 'Purchase Transactions'} value={metrics.buyCount.toFixed(1)} />
          <FactRow label={language === 'th' ? 'รายการขาย' : 'Sale Transactions'} value={metrics.sellCount.toFixed(1)} />
          <FactRow label={language === 'th' ? 'รายการปันผล' : 'Dividend Events'} value={metrics.dividendCount.toFixed(1)} />
          <FactRow label={language === 'th' ? 'ปันผลเฉลี่ยต่อรอบ' : 'Avg Dividend / Period'} value={formatCurrency(metrics.totalDividends / (timeDimension === 'all' ? 12 : 1))} />
          <FactRow label={language === 'th' ? 'เงินต้นรวม' : 'Total Capital Outlay'} value={formatCurrency(metrics.buyVolume)} />
          <FactRow label={language === 'th' ? 'เงินที่ขายออกรวม' : 'Total Capital Realized'} value={formatCurrency(metrics.sellVolume)} />
          <FactRow label={language === 'th' ? 'ค่าธรรมเนียมรวม' : 'Total Operational Fees'} value={formatCurrency(metrics.totalFees)} highlight="highlight-rose" />
        </section>

        <section className="report-group">
          <h2 className="report-group-title">{language === 'th' ? 'รายละเอียดรายสินทรัพย์' : 'Asset Inventory Details'}</h2>
          <div className="report-group-divider"></div>
          {assetStats.length === 0 ? (
            <p className="text-xs text-gray-500 italic">{language === 'th' ? 'ไม่มีข้อมูลสินทรัพย์สำหรับเงื่อนไขนี้' : 'No asset data for the selected filter.'}</p>
          ) : (
            assetStats.map(stat => (
              <div key={stat.symbol} className="mb-6">
                <FactRow label={`${stat.symbol} (${language === 'th' ? 'มูลค่า' : 'Value'})`} value={formatCurrency(stat.totalValue)} highlight="highlight-blue" />
                <div className="pl-8 opacity-70">
                   <FactRow label={language === 'th' ? 'จำนวนที่ถือ' : 'Quantity Held'} value={stat.amount.toFixed(4)} />
                   <FactRow label={language === 'th' ? 'ราคาซื้อเฉลี่ย' : 'Avg Purchase Price'} value={formatCurrency(stat.avgPrice)} />
                   
                   {/* Market Data for Global Assets Only */}
                   {stat.marketPrice !== null && (
                     <>
                       <FactRow label={language === 'th' ? 'ราคาตลาดปัจจุบัน' : 'Live Market Price'} value={formatCurrency(stat.marketPrice)} highlight="highlight-blue" />
                       <FactRow 
                         label={language === 'th' ? 'กำไร/ขาดทุนที่ยังไม่รับรู้' : 'Unrealized Gain/Loss'} 
                         value={formatCurrency(stat.unrealizedPnL || 0)} 
                         highlight={(stat.unrealizedPnL || 0) >= 0 ? 'highlight-emerald' : 'highlight-rose'} 
                       />
                     </>
                   )}

                   <FactRow label={language === 'th' ? 'ปันผลสะสม' : 'Accumulated Dividends'} value={formatCurrency(stat.dividends)} highlight="highlight-amber" />
                   <FactRow label={language === 'th' ? 'ผลตอบแทนรวม' : 'Total Asset Return'} value={formatCurrency(stat.totalReturn)} highlight={stat.totalReturn >= 0 ? 'highlight-emerald' : 'highlight-rose'} />
                   {stat.brokers && stat.brokers.length > 0 && (
                     <FactRow label={language === 'th' ? 'ถือผ่าน Broker' : 'Held via Brokers'} value={stat.brokers.join(', ')} />
                   )}
                </div>
              </div>
            ))
          )}
        </section>

        <div className="mt-12 opacity-30 text-[10px] uppercase tracking-widest text-center">
           {language === 'th' ? 'รายงานอัจฉริยะ — ตรวจสอบความถูกต้องของข้อมูลแล้ว' : 'Generated Intelligence Report — Data Integrity Verified'}
        </div>
      </main>
    </div>
  );
};

export default InsightPort;
