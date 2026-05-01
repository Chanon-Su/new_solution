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
  PieChart as PieIcon
} from 'lucide-react';
import { useInsightData } from '../../hooks/useInsightData';
import type { InsightTimeDimension, InsightAssetFocus } from '../../hooks/useInsightData';
import ZenDropdown from '../UI/ZenDropdown';
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
}

const ZenMultiSelect: React.FC<MultiSelectProps> = ({ label, options, selected, onChange, placeholder = "Select assets" }) => {
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

  return (
    <div className="report-dropdown-wrapper" ref={containerRef}>
      <label className="dropdown-label">{label}</label>
      <div className={`report-zen-dropdown relative ${isOpen ? 'ring-1 ring-emerald-500/50' : ''}`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full flex items-center justify-between px-4 text-xs text-white/80"
        >
          <span className="truncate pr-4">
            {selected.length === 0 ? placeholder : `${selected.length} Selected`}
          </span>
          <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-[#121214] border border-white/10 rounded-xl shadow-2xl z-[100] py-2 max-h-[300px] overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] hover:bg-white/5 transition-colors text-left"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selected.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                  {selected.includes(opt) && <Check size={10} className="text-black font-bold" />}
                </div>
                <span className={selected.includes(opt) ? 'text-emerald-400 font-bold' : 'text-gray-400'}>{opt}</span>
              </button>
            ))}
            {options.length === 0 && <div className="px-4 py-2 text-[11px] text-gray-500 italic">No assets found</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InsightPort: React.FC = () => {
  const [timeDimension, setTimeDimension] = useState<InsightTimeDimension>('all');
  const [assetFocus, setAssetFocus] = useState<InsightAssetFocus>('all');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [activeVisIndex, setActiveVisIndex] = useState(0);
  
  const { metrics, allocationData, assetStats, trendData, activityData, dropdownLists } = useInsightData(
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
    { value: 'yearly_avg', label: 'Average Yearly (All Years)' },
    ...dropdownLists.availableYears.map(y => ({ value: y.toString(), label: y.toString() }))
  ], [dropdownLists.availableYears]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyOptions = useMemo(() => {
    if (selectedYear) {
      const baseOptions = [{ value: 'year_avg', label: `Average Monthly of ${selectedYear}` }];
      const months = Array.from(dropdownLists.availableMonths[selectedYear] || []).sort((a, b) => a - b);
      return [
        ...baseOptions,
        ...months.map(m => ({ value: m.toString(), label: monthNames[m] }))
      ];
    }
    return [
      { value: 'monthly_avg', label: 'Average Monthly (All Months)' }
    ];
  }, [selectedYear, dropdownLists.availableMonths]);

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

  const nextVis = () => setActiveVisIndex((prev) => (prev + 1) % 3);
  const prevVis = () => setActiveVisIndex((prev) => (prev - 1 + 3) % 3);

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
                  <PieIcon size={14} className="text-emerald-500" />
                  <h4 className="sidebar-section-title !mb-0">Asset Allocation</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
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
                        contentStyle={{ background: '#0D0D0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">Assets Count</span>
                    <span className="value">{metrics.assetCount}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">Portfolio Yield</span>
                    <span className="value text-emerald-400">{metrics.dividendYield.toFixed(2)}%</span>
                 </div>
              </div>
            </div>
          )}

          {activeVisIndex === 1 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                 <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <h4 className="sidebar-section-title !mb-0">Growth Performance</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0D0D0D', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">Initial Value</span>
                    <span className="value">{formatCurrency(trendData[0]?.value || 0)}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">Return Rate</span>
                    <span className="value text-emerald-400">{metrics.returnPercentage.toFixed(1)}%</span>
                 </div>
              </div>
            </div>
          )}

          {activeVisIndex === 2 && (
            <div className="sidebar-widget animate-[fadeIn_0.4s]">
              <div className="sidebar-group">
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={14} className="text-emerald-500" />
                  <h4 className="sidebar-section-title !mb-0">Flow Analysis</h4>
                </div>
                <div style={{ width: '100%', height: 240, minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <Bar dataKey="buy" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sell" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dividend" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                      <XAxis dataKey="month" hide />
                      <RechartsTooltip 
                        contentStyle={{ background: '#0D0D0D', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="sidebar-stats-row">
                 <div className="stat-box">
                    <span className="label">Avg Div / Mo</span>
                    <span className="value text-amber-400">{formatCurrency(metrics.totalDividends / 12)}</span>
                 </div>
                 <div className="stat-box">
                    <span className="label">Total Div</span>
                    <span className="value text-amber-500">{formatCurrency(metrics.totalDividends)}</span>
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
              {[0,1,2].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all ${i === activeVisIndex ? 'w-6 bg-emerald-500' : 'w-1 bg-white/10'}`}></div>
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
                title="Total of all time"
              >
                All Time
              </button>
              <div className="flex gap-4 flex-1">
                 <div className="report-dropdown-wrapper flex-1">
                    <label className="dropdown-label">Yearly Filter</label>
                    <ZenDropdown 
                      options={yearlyOptions} 
                      value={timeDimension === 'yearly_avg' ? 'yearly_avg' : selectedYear?.toString() || ''} 
                      onChange={handleYearChange} 
                      placeholder={timeDimension === 'monthly_avg' ? "" : "Select Yearly"}
                      className="report-zen-dropdown"
                    />
                 </div>
                 <div className="report-dropdown-wrapper flex-1">
                    <label className="dropdown-label">Monthly Filter</label>
                    <ZenDropdown 
                      options={monthlyOptions} 
                      value={timeDimension === 'monthly_avg' ? 'monthly_avg' : selectedMonth?.toString() || (selectedYear ? 'year_avg' : '')} 
                      onChange={handleMonthChange} 
                      placeholder={timeDimension === 'yearly_avg' ? "" : (selectedYear ? "Average of Year" : "Select Monthly")}
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
                All Assets
              </button>
              <div className="flex gap-4 flex-1">
                 <ZenMultiSelect 
                   label="Global List"
                   options={dropdownLists.globalAssets}
                   selected={selectedAssets.filter(a => isGlobalAsset(a))}
                   onChange={(vals) => {
                     setAssetFocus('global');
                     const customs = selectedAssets.filter(a => !isGlobalAsset(a));
                     setSelectedAssets([...customs, ...vals]);
                   }}
                 />
                 <ZenMultiSelect 
                   label="Custom List"
                   options={dropdownLists.customAssets}
                   selected={selectedAssets.filter(a => !isGlobalAsset(a))}
                   onChange={(vals) => {
                     setAssetFocus('custom');
                     const globals = selectedAssets.filter(a => isGlobalAsset(a));
                     setSelectedAssets([...globals, ...vals]);
                   }}
                 />
              </div>
           </div>
        </div>

        {/* Report Zone */}
        <section className="report-group">
          <h2 className="report-group-title">Portfolio Performance Facts</h2>
          <div className="report-group-divider"></div>
          <FactRow label="Portfolio Market Value" value={formatCurrency(metrics.totalNetWorth)} highlight="highlight-emerald" />
          <FactRow label="Realized Capital Gain" value={formatCurrency(metrics.totalPnL)} />
          <FactRow label="Total Dividends Earned" value={formatCurrency(metrics.totalDividends)} highlight="highlight-amber" />
          <FactRow label="Combined Total Return" value={formatCurrency(metrics.totalReturn)} highlight="highlight-emerald" />
          <FactRow label="Return Rate (ROI)" value={`${metrics.returnPercentage.toFixed(2)}%`} highlight="highlight-emerald" />
          <FactRow label="Dividend Yield Rate" value={`${metrics.dividendYield.toFixed(2)}%`} highlight="highlight-amber" />
          <FactRow label="Asset Diversity Count" value={metrics.assetCount} highlight="highlight-blue" />
        </section>

        <section className="report-group">
          <h2 className="report-group-title">Flow & Activity Summary</h2>
          <div className="report-group-divider"></div>
          <FactRow label="Purchase Transactions" value={metrics.buyCount.toFixed(1)} />
          <FactRow label="Sale Transactions" value={metrics.sellCount.toFixed(1)} />
          <FactRow label="Dividend Events" value={metrics.dividendCount.toFixed(1)} />
          <FactRow label="Avg Dividend / Period" value={formatCurrency(metrics.totalDividends / (timeDimension === 'all' ? 12 : 1))} />
          <FactRow label="Total Capital Outlay" value={formatCurrency(metrics.buyVolume)} />
          <FactRow label="Total Capital Realized" value={formatCurrency(metrics.sellVolume)} />
          <FactRow label="Total Operational Fees" value={formatCurrency(metrics.totalFees)} highlight="highlight-rose" />
        </section>

        <section className="report-group">
          <h2 className="report-group-title">Asset Inventory Details</h2>
          <div className="report-group-divider"></div>
          {assetStats.length === 0 ? (
            <p className="text-xs text-gray-500 italic">No asset data for the selected filter.</p>
          ) : (
            assetStats.map(stat => (
              <div key={stat.symbol} className="mb-6">
                <FactRow label={`${stat.symbol} (Value)`} value={formatCurrency(stat.totalValue)} highlight="highlight-blue" />
                <div className="pl-8 opacity-70">
                   <FactRow label="Quantity Held" value={stat.amount.toFixed(4)} />
                   <FactRow label="Avg Purchase Price" value={formatCurrency(stat.avgPrice)} />
                   
                   {/* Market Data for Global Assets Only */}
                   {stat.marketPrice !== null && (
                     <>
                       <FactRow label="Live Market Price" value={formatCurrency(stat.marketPrice)} highlight="highlight-blue" />
                       <FactRow 
                         label="Unrealized Gain/Loss" 
                         value={formatCurrency(stat.unrealizedPnL || 0)} 
                         highlight={(stat.unrealizedPnL || 0) >= 0 ? 'highlight-emerald' : 'highlight-rose'} 
                       />
                     </>
                   )}

                   <FactRow label="Accumulated Dividends" value={formatCurrency(stat.dividends)} highlight="highlight-amber" />
                   <FactRow label="Total Asset Return" value={formatCurrency(stat.totalReturn)} highlight={stat.totalReturn >= 0 ? 'highlight-emerald' : 'highlight-rose'} />
                </div>
              </div>
            ))
          )}
        </section>

        <div className="mt-12 opacity-30 text-[10px] uppercase tracking-widest text-center">
           Generated Intelligence Report — Data Integrity Verified
        </div>
      </main>
    </div>
  );
};

export default InsightPort;
