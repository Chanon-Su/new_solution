import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  PieChart as PieChartIcon, 
  Activity, 
  Info,
  Calendar,
  Globe,
  UserCheck
} from 'lucide-react';
import { useInsightData } from '../../hooks/useInsightData';
import type { InsightTimeDimension, InsightAssetFocus } from '../../hooks/useInsightData';
import './InsightPort.css';

const InsightPort: React.FC = () => {
  const [timeDimension, setTimeDimension] = useState<InsightTimeDimension>('all');
  const [assetFocus, setAssetFocus] = useState<InsightAssetFocus>('all');
  
  const { metrics, allocationData, radarData } = useInsightData(timeDimension, assetFocus);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="insight-port-container">
      {/* Financial Status HUD */}
      <div className="insight-header-hud">
        <div className="hud-summary-card">
          <span className="hud-label">Portfolio Net Worth</span>
          <div className="hud-value-large">{formatCurrency(metrics.totalNetWorth)}</div>
          <div className="hud-pnl">
            <span className={`pnl-chip ${metrics.totalPnL >= 0 ? 'pnl-positive' : 'pnl-negative'}`}>
              {metrics.totalPnL >= 0 ? '+' : ''}{formatCurrency(metrics.totalPnL)}
            </span>
            <span className={`text-xs font-bold ${metrics.totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ({metrics.pnlPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="hud-summary-card" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="hud-label">Portfolio Tier</span>
            <div className="text-2xl font-bold text-white uppercase tracking-widest">Premium Alpha</div>
            <p className="text-xs text-gray-500 mt-1">Based on global asset distribution</p>
          </div>
          <div className="flex gap-4">
             <div className="text-center">
                <div className="text-emerald-500 font-bold text-xl">{metrics.assetCount}</div>
                <div className="text-[10px] text-gray-500 uppercase">Assets</div>
             </div>
             <div className="text-center">
                <div className="text-blue-500 font-bold text-xl">{metrics.annualizedYield}%</div>
                <div className="text-[10px] text-gray-500 uppercase">Avg Yield</div>
             </div>
          </div>
        </div>
      </div>

      {/* Controller Area */}
      <div className="insight-controls">
        <div className="control-group">
          <button 
            className={`control-btn ${timeDimension === 'all' ? 'active' : ''}`}
            onClick={() => setTimeDimension('all')}
          >
            <Calendar size={14} className="inline mr-2" /> All Time
          </button>
          <button 
            className={`control-btn ${timeDimension === 'year' ? 'active' : ''}`}
            onClick={() => setTimeDimension('year')}
          >
            Yearly
          </button>
          <button 
            className={`control-btn ${timeDimension === 'month' ? 'active' : ''}`}
            onClick={() => setTimeDimension('month')}
          >
            Monthly
          </button>
        </div>

        <div className="control-group">
          <button 
            className={`control-btn ${assetFocus === 'all' ? 'active' : ''}`}
            onClick={() => setAssetFocus('all')}
          >
            All Assets
          </button>
          <button 
            className={`control-btn ${assetFocus === 'global' ? 'active' : ''}`}
            onClick={() => setAssetFocus('global')}
          >
            <Globe size={14} className="inline mr-2" /> Global Only
          </button>
          <button 
            className={`control-btn ${assetFocus === 'custom' ? 'active' : ''}`}
            onClick={() => setAssetFocus('custom')}
          >
            <UserCheck size={14} className="inline mr-2" /> Custom Only
          </button>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="insight-grid">
        {/* Radar Analysis */}
        <div className="insight-block">
          <div className="block-title">
            <Activity size={16} className="text-emerald-500" />
            Portfolio Health Radar
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" />
                <Radar
                  name="Portfolio"
                  dataKey="A"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation Pie */}
        <div className="insight-block">
          <div className="block-title">
            <PieChartIcon size={16} className="text-emerald-500" />
            Category Allocation
          </div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Health Metrics List */}
        <div className="insight-block">
          <div className="block-title">
            <ShieldCheck size={16} className="text-emerald-500" />
            Risk & Stability Report
          </div>
          <div className="metric-list">
            <div className="metric-row">
              <span className="metric-label">Liquidity Rating</span>
              <span className="metric-value highlight">{metrics.liquidityScore}/100</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Volatility Resistance</span>
              <span className="metric-value">{metrics.stabilityScore}/100</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Growth Potential</span>
              <span className="metric-value">{metrics.growthScore.toFixed(0)}/100</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Dividend Yield on Cost</span>
              <span className="metric-value">{metrics.dividendYield.toFixed(2)}%</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Asset Concentration</span>
              <span className="metric-value">Low (Balanced)</span>
            </div>
          </div>
        </div>

        {/* Intelligence Report (Large Block) */}
        <div className="insight-block report-section">
          <div className="block-title">
            <TrendingUp size={16} className="text-emerald-500" />
            Intelligence Analysis Report
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Portfolio Strengths</h4>
              <ul className="space-y-2">
                <li className="text-xs text-emerald-400 flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                  High liquidity ratio allows for rapid capital reallocation.
                </li>
                <li className="text-xs text-emerald-400 flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                  Global asset exposure provides strong diversification benefits.
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Optimization Opportunities</h4>
              <ul className="space-y-2">
                <li className="text-xs text-blue-400 flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  Increase dividend-focused assets to improve mana... (cash flow) consistency.
                </li>
                <li className="text-xs text-blue-400 flex items-start gap-2">
                  <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div>
                  Consider hedging custom assets with stable global benchmarks.
                </li>
              </ul>
            </div>
          </div>

          <div className="insight-info-tip">
            <Info size={14} className="tip-icon" />
            <span className="font-bold">Pro Tip:</span> This report is generated based on your transaction history and followed assets. 
            All-time metrics provide the best overview of your financial journey.
          </div>
        </div>

        {/* Small Inflow/Outflow Summary */}
        <div className="insight-block">
          <div className="block-title">
             <Calendar size={16} className="text-emerald-500" />
             Monthly Velocity
          </div>
          <div className="metric-list">
             <div className="metric-row">
               <span className="metric-label">Avg. Monthly Inflow</span>
               <span className="metric-value text-emerald-400">+{formatCurrency(metrics.monthlyInflow)}</span>
             </div>
             <div className="metric-row">
               <span className="metric-label">Avg. Monthly Outflow</span>
               <span className="metric-value text-red-400">-{formatCurrency(metrics.monthlyOutflow)}</span>
             </div>
             <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-[10px] text-gray-500 uppercase mb-1">Inflow/Outflow Ratio</div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                   <div 
                    className="bg-emerald-500 h-full" 
                    style={{ width: `${Math.min(100, (metrics.monthlyInflow / (metrics.monthlyInflow + metrics.monthlyOutflow || 1)) * 100)}%` }}
                   ></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPort;
