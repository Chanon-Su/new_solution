import React from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import MilestoneChart from './MilestoneChart';
import type { ChartData, Frequency } from '../../hooks/useMilestoneAnalytics';

interface MilestoneAnalyticsDrawerProps {
  isDrawerOpen: boolean;
  isComputing: boolean;
  frequency: Frequency;
  isZoomedToGoal: boolean;
  chartData: ChartData[];
  targetValue: number;
  onToggleDrawer: () => void;
  onFrequencyChange: (freq: Frequency) => void;
  onToggleZoom: () => void;
}

const MilestoneAnalyticsDrawer: React.FC<MilestoneAnalyticsDrawerProps> = ({
  isDrawerOpen,
  isComputing,
  frequency,
  isZoomedToGoal,
  chartData,
  targetValue,
  onToggleDrawer,
  onFrequencyChange,
  onToggleZoom
}) => {
  return (
    <div className={`detail-content-bottom ${isDrawerOpen ? 'open' : 'closed'}`}>
      <button 
        className="drawer-toggle-btn"
        onClick={onToggleDrawer}
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className={isDrawerOpen ? 'text-emerald-500' : 'text-gray-500'} />
          <span className="text-[10px] font-bold tracking-widest uppercase">
            {isDrawerOpen ? 'Hide Analytics' : 'Show Analytics'}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={`transition-transform duration-300 ${isDrawerOpen ? '' : 'rotate-180'}`} 
        />
      </button>

      <div className={`drawer-inner-content ${isDrawerOpen ? 'visible' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Timeline & Effort Analytics</h4>
              <button 
                onClick={onToggleZoom}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all text-[9px] font-bold uppercase tracking-tighter ${
                  isZoomedToGoal 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-gray-300'
                }`}
              >
                <TrendingUp size={10} />
                {isZoomedToGoal ? 'Zoom: Goal' : 'Zoom: Steps'}
              </button>
            </div>
            <div className="flex gap-4 text-[10px]">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500"></div><span className="text-gray-400">PROGRESS (LINE)</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500/30"></div><span className="text-gray-400">EFFORT (HISTOGRAM)</span></div>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
            {(['hour', 'day', 'week', 'month', 'quarter', 'year'] as Frequency[]).map((freq) => (
              <button
                key={freq}
                onClick={() => onFrequencyChange(freq)}
                className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                  frequency === freq 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {freq === 'hour' ? 'H' : freq === 'day' ? 'D' : freq === 'week' ? 'W' : freq === 'month' ? 'M' : freq === 'quarter' ? 'Q' : 'Y'}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[250px] relative">
          {isComputing || chartData[0]?.date === 'Loading...' ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-emerald-500/40 animate-pulse bg-white/[0.01] rounded-2xl border border-white/5">
               <div className="w-8 h-8 border-2 border-emerald-500/10 border-t-emerald-500/60 rounded-full animate-spin"></div>
               <span className="text-[9px] font-bold uppercase tracking-[0.3em] ml-1">Analyzing Transaction Pattern...</span>
            </div>
          ) : (
            <MilestoneChart 
              data={chartData} 
              targetValue={targetValue} 
              isZoomedToGoal={isZoomedToGoal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneAnalyticsDrawer;
