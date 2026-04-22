import React, { useState, useMemo, useEffect } from 'react';
import type { Milestone, SubChecklistItem } from '../../types';
import { Home, Bitcoin, DollarSign, TrendingUp, ChevronDown, CheckCircle2, Settings, X, Plus, Check, Trash2, AlertTriangle, TrendingUp as TrendingUpIcon, MoveUp, MoveDown, ArrowUpRight } from 'lucide-react';
import MilestoneChart from './MilestoneChart';
import * as storage from '../../utils/storage';
import type { Transaction as TLogTransaction } from '../../types';

interface MilestoneDetailViewProps {
  milestone: Milestone;
  currentValue: number;
  onClose: () => void;
  onToggleItem: (itemId: string) => void;
  onAddItem: (label: string) => void;
  onReorderItem: (milestoneId: string, itemId: string, direction: 'up' | 'down') => void;
  onUpdateMilestone: (id: string, data: Partial<Milestone>) => void;
  onDeleteMilestone: (id: string) => void;
  initialEditMode?: boolean;
}

const MilestoneDetailView: React.FC<MilestoneDetailViewProps> = ({ 
  milestone, 
  currentValue, 
  onClose, 
  onToggleItem,
  onAddItem,
  onReorderItem,
  onUpdateMilestone,
  onDeleteMilestone,
  initialEditMode = false
}) => {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [frequency, setFrequency] = useState<'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year'>('month');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);
  const [isZoomedToGoal, setIsZoomedToGoal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [followedAssets, setFollowedAssets] = useState<{symbol: string, name: string}[]>([]);

  // Load Real Follow List Assets from Asset Mart
  useEffect(() => {
    const followedStr = localStorage.getItem('planto_followed_assets');
    if (followedStr) {
      try {
        const assets = JSON.parse(followedStr);
        // Map to simple symbol/name structure
        setFollowedAssets(assets.map((a: any) => ({ symbol: a.symbol, name: a.name })));
      } catch (e) {
        console.error('Failed to parse followed assets', e);
      }
    }
  }, []);

  // Memoize chart data to avoid recalculation on every render
  const chartData = useMemo(() => {
    // 1. Load All Transactions
    const allTransactions = storage.loadTransactions();
    
    // 2. Filter transactions for the linked asset
    const filteredTxs = allTransactions.filter(tx => 
      milestone.linkedAssetSymbol && 
      tx.asset.toUpperCase() === milestone.linkedAssetSymbol.toUpperCase()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const dataMap: Record<string, { date: string; progress: number; effort: number }> = {};
    
    // If we have asset transactions, use them for the chart
    if (filteredTxs.length > 0) {
      let cumulativeBalance = 0;
      
      filteredTxs.forEach(tx => {
        const date = new Date(tx.date);
        let key = '';
        
        if (frequency === 'year') {
          key = `${date.getFullYear()}`;
        } else if (frequency === 'quarter') {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
        } else if (frequency === 'month') {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (frequency === 'week') {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
        } else if (frequency === 'day') {
          key = date.toISOString().split('T')[0];
        } else {
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
        }

        if (!dataMap[key]) {
          dataMap[key] = { date: key, progress: 0, effort: 0 };
        }

        // Calculate value based on tracking dimension
        const txAmount = tx.type === 'SELL' ? -tx.amount : tx.amount;
        const txValue = tx.type === 'SELL' ? -(tx.amount * tx.price) : (tx.amount * tx.price);
        
        cumulativeBalance += (milestone.unit === 'USD' || milestone.unit === 'THB' ? txValue : txAmount);
        
        dataMap[key].progress = cumulativeBalance;
        dataMap[key].effort += 1; // Count of activities
      });

      const sortedKeys = Object.keys(dataMap).sort();
      return sortedKeys.map(key => dataMap[key]);
    }

    // Fallback to Checklist grouping if no asset transactions found
    milestone.subChecklist.forEach(item => {
      if (item.isCompleted && item.completedAt) {
        const date = new Date(item.completedAt);
        let key = '';
        
        if (frequency === 'year') {
          key = `${date.getFullYear()}`;
        } else if (frequency === 'quarter') {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
        } else if (frequency === 'month') {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else if (frequency === 'week') {
          const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
          const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
          const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
          key = `${date.getFullYear()}-W${weekNum}`;
        } else if (frequency === 'day') {
          key = date.toISOString().split('T')[0];
        } else {
          key = `${date.toISOString().split('T')[0]} ${String(date.getHours()).padStart(2, '0')}:00`;
        }

        if (!dataMap[key]) {
          dataMap[key] = { date: key, progress: 0, effort: 0 };
        }
        dataMap[key].effort += 1;
      }
    });

    const sortedKeys = Object.keys(dataMap).sort();
    let cumulativeProgress = 0;
    
    return sortedKeys.length > 0 ? sortedKeys.map(key => {
      cumulativeProgress += (currentValue / (sortedKeys.length || 1));
      return {
        ...dataMap[key],
        progress: cumulativeProgress
      };
    }) : [
      { date: 'Waiting for Data', progress: 0, effort: 0 }
    ];
  }, [milestone.subChecklist, frequency, currentValue, milestone.linkedAssetSymbol, milestone.unit]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemLabel.trim()) {
      onAddItem(newItemLabel);
      setNewItemLabel('');
    }
  };

  const progressPercentage = milestone.targetValue > 0 
    ? Math.min((currentValue / milestone.targetValue) * 100, 100) 
    : 0;

  return (
    <div className="milestone-detail-overlay">
      <button className="close-detail-btn" onClick={onClose}>
        <X size={20} />
      </button>

      <div className="detail-content-top">
        <div className="max-w-[1100px] mx-auto w-full">
          {/* Summary Card Header */}
          <div className="summary-card">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4 items-center">
                <div className="summary-icon-bg">
                  <TrendingUp size={48} className="text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  {/* Title & Tags Row */}
                  <div className="flex items-center flex-wrap gap-x-2">
                    <div className="flex-shrink-0">
                      <div className={`flex items-center h-[48px] rounded-xl px-3 py-1 -ml-3 transition-all border ${isEditing ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent'}`}>
                        {isEditing ? (
                          <input 
                            className="text-3xl font-bold text-white font-['Manrope'] bg-transparent border-none outline-none focus:ring-0 p-0 w-80"
                            value={milestone.title}
                            onChange={(e) => onUpdateMilestone(milestone.id, { title: e.target.value })}
                            placeholder="Untitled Goal"
                            autoFocus
                          />
                        ) : (
                          <h2 className="text-3xl font-bold text-white font-['Manrope'] leading-none w-80 truncate">{milestone.title}</h2>
                        )}
                      </div>
                    </div>

                    <div className={`flex items-center h-[32px] rounded-lg px-2 py-1 transition-all border ${isEditing ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent'}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-500 font-bold text-[10px]">#</span>
                        {isEditing ? (
                          <input 
                            className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider bg-transparent border-none outline-none focus:ring-0 p-0 w-32"
                            value={milestone.tags.join(' ')}
                            onChange={(e) => onUpdateMilestone(milestone.id, { tags: e.target.value.split(' ').filter(t => t !== '') })}
                            placeholder="tags..."
                          />
                        ) : (
                          <div className="text-[10px] text-emerald-500/50 font-bold uppercase tracking-wider w-32 truncate">
                            {milestone.tags.join(' ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description Section */}
                  <div className="mt-1">
                    {isEditing ? (
                      <textarea 
                        className="text-gray-400 text-sm max-w-xl bg-white/5 border border-white/10 outline-none focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-3 py-1.5 -ml-3 w-full resize-none h-[64px] transition-all leading-relaxed"
                        value={milestone.description}
                        onChange={(e) => onUpdateMilestone(milestone.id, { description: e.target.value })}
                        placeholder="Add a description..."
                      />
                    ) : (
                      <p className="text-gray-400 text-sm max-w-xl border border-transparent px-3 py-1.5 -ml-3 leading-relaxed h-[64px] overflow-hidden line-clamp-3">{milestone.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <div className="flex items-center">
                      {showDeleteConfirm ? (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1 animate-in fade-in slide-in-from-right-2">
                          <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">Are you sure?</span>
                          <button 
                            onClick={() => {
                              onDeleteMilestone(milestone.id);
                              onClose();
                            }}
                            className="text-[10px] font-extrabold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-lg transition-colors"
                          >
                            YES, DELETE
                          </button>
                          <button 
                            onClick={() => setShowDeleteConfirm(false)}
                            className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="p-2 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                          onClick={() => setShowDeleteConfirm(true)}
                          title="Delete Milestone"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  )}
                  <button 
                    className={`p-2 rounded-full transition-all ${isEditing ? 'bg-emerald-500 text-white' : 'hover:bg-white/5 text-gray-500'}`}
                    onClick={() => {
                      setIsEditing(!isEditing);
                      setShowDeleteConfirm(false);
                    }}
                    title={isEditing ? 'Save Changes' : 'Edit Milestone'}
                  >
                    {isEditing ? <CheckCircle2 size={20} /> : <Settings size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="summary-progress-section">
              <div className="flex justify-between items-end mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Cumulative Progress</span>
                  <span className="text-4xl font-bold emerald-text">
                    {progressPercentage.toFixed(3)}%
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Target Achievement</span>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-4xl font-bold text-white">{currentValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}</span>
                    <span className="text-gray-600 text-3xl">/</span>
                    <span className="text-4xl font-bold text-emerald-500">{milestone.targetValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 8 })}</span>
                    <span className="text-lg text-gray-500 ml-1 self-end mb-1">{milestone.unit}</span>
                  </div>
                </div>
              </div>
              <div className="summary-progress-bar-bg">
                <div 
                  className="summary-progress-bar-fill" 
                  style={{ 
                    width: `${milestone.targetValue > 0 ? Math.min((currentValue / milestone.targetValue) * 100, 100) : 0}%` 
                  }}
                ></div>
              </div>

              {/* Linked Asset Section */}
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Linked Strategic Asset</span>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Asset Selector (Card or Dashed Box) */}
                  <div className="relative">
                    {milestone.linkedAssetSymbol ? (
                      <div 
                        className={`asset-link-card group relative ${isEditing ? 'cursor-pointer hover:border-emerald-500/50' : 'cursor-default'}`}
                        onClick={() => isEditing && setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                      >
                        <div className="asset-link-logo">
                          <span className="text-emerald-500 font-bold">{milestone.linkedAssetSymbol[0]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white leading-tight">{milestone.linkedAssetSymbol}</span>
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Strategic Asset</span>
                        </div>
                        
                        <div className={`ml-2 transition-all ${isEditing ? 'text-gray-600 group-hover:text-emerald-500 opacity-100' : 'opacity-0'}`}>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    ) : (
                      isEditing && (
                        <button 
                          className="h-[48px] px-6 border border-dashed border-white/10 rounded-2xl text-gray-600 hover:text-emerald-500 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-[11px] uppercase font-bold tracking-widest flex items-center gap-3"
                          onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                        >
                          <Plus size={14} />
                          <span>Select Asset</span>
                        </button>
                      )
                    )}

                    {/* Asset Dropdown Menu */}
                    {isEditing && isAssetDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] py-2 overflow-hidden backdrop-blur-2xl ring-1 ring-emerald-500/20">
                        <div className="px-3 py-1 mb-1 border-b border-white/5 text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-white/[0.02]">Choose Asset</div>
                        <div className="max-h-60 overflow-y-auto">
                          <button
                            className="w-full text-left px-4 py-2.5 hover:bg-red-500/10 text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
                            onClick={() => {
                              onUpdateMilestone(milestone.id, { linkedAssetSymbol: '' });
                              setIsAssetDropdownOpen(false);
                            }}
                          >
                            <X size={12} />
                            <span>Unlink / Blank</span>
                          </button>
                          {followedAssets.map(asset => (
                            <button
                              key={asset.symbol}
                              className="w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs text-gray-300 hover:text-emerald-500 transition-colors flex justify-between items-center group/item"
                              onClick={() => {
                                onUpdateMilestone(milestone.id, { linkedAssetSymbol: asset.symbol });
                                setIsAssetDropdownOpen(false);
                              }}
                            >
                              <span className="font-medium">{asset.name}</span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 text-gray-500 group-hover/item:bg-emerald-500/20 group-hover/item:text-emerald-500 transition-colors uppercase tracking-wider">{asset.symbol}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dimension Selector (Cash / Unit) */}
                  <div className="relative">
                    <button 
                      className={`h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all ${isEditing ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default opacity-80'}`}
                      onClick={() => isEditing && setIsDimensionDropdownOpen(!isDimensionDropdownOpen)}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-500">
                        {milestone.unit?.toLowerCase().includes('$') || milestone.unit?.toLowerCase().includes('฿') ? '₿' : 'Σ'}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Tracking Mode</span>
                        <span className="text-xs font-bold text-white capitalize">{milestone.trackingDimension || 'Select Mode'}</span>
                      </div>
                      <ChevronDown size={14} className={`transition-all ${isEditing ? 'text-gray-600 opacity-100' : 'opacity-0'}`} />
                    </button>

                    {/* Dimension Dropdown Menu */}
                    {isEditing && isDimensionDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-44 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] py-2 overflow-hidden backdrop-blur-2xl ring-1 ring-emerald-500/20">
                        <div className="px-3 py-1 mb-1 border-b border-white/5 text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-white/[0.02]">Focus Dimension</div>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs text-gray-300 hover:text-emerald-500 transition-colors flex items-center gap-3"
                          onClick={() => {
                            onUpdateMilestone(milestone.id, { 
                              trackingDimension: 'Cash',
                              unit: milestone.unit === 'Units' || !milestone.unit ? 'USD' : milestone.unit 
                            });
                            setIsDimensionDropdownOpen(false);
                          }}
                        >
                          <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">$</div>
                          <span>Value (Cash)</span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs text-gray-300 hover:text-emerald-500 transition-colors flex items-center gap-3"
                          onClick={() => {
                            onUpdateMilestone(milestone.id, { 
                              trackingDimension: 'Unit',
                              unit: milestone.unit === 'USD' || milestone.unit === 'THB' || !milestone.unit ? 'Units' : milestone.unit
                            });
                            setIsDimensionDropdownOpen(false);
                          }}
                        >
                          <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">U</div>
                          <span>Quantity (Unit)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Target Value Card */}
                  <div className="h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all">
                    <div className="flex flex-col items-start w-24">
                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Target Value</span>
                      {isEditing ? (
                        <input 
                          type="number"
                          className="text-xs font-bold text-emerald-500 bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                          value={milestone.targetValue}
                          onChange={(e) => onUpdateMilestone(milestone.id, { targetValue: Number(e.target.value) })}
                        />
                      ) : (
                        <span className="text-xs font-bold text-emerald-500 truncate w-full">{milestone.targetValue.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Measure Unit Card */}
                  <div className="h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all">
                    <div className="flex flex-col items-start w-16">
                      <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Measure Unit</span>
                      {isEditing ? (
                        <input 
                          className="text-xs font-bold text-white bg-transparent border-none outline-none focus:ring-0 w-full p-0 uppercase"
                          value={milestone.unit}
                          onChange={(e) => onUpdateMilestone(milestone.id, { unit: e.target.value })}
                          placeholder="UNIT..."
                        />
                      ) : (
                        <span className="text-xs font-bold text-white uppercase truncate w-full">{milestone.unit}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-white/[0.02] flex justify-between items-center">
                <div className="text-[9px] text-gray-600 uppercase font-bold tracking-widest flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-500/50"></div>
                  Real-time synchronization with Asset Mart active
                </div>
                <div className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">
                  Last Updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="sub-checklist-container">
            {/* Left Column: Active Tasks */}
            <div className="sub-checklist-column">
              <div className="column-panel active-panel">
                <h4 className="column-header">Active Tasks</h4>
                <div className="sub-checklist-list">
                  {milestone.subChecklist
                    .filter(item => !item.isCompleted)
                    .map((item: SubChecklistItem, index: number, filteredArray: SubChecklistItem[]) => (
                      <div key={item.id} className="sub-checklist-item active-task">
                        <div className="custom-checkbox" onClick={() => onToggleItem(item.id)}>
                          {/* Empty checkbox for active tasks */}
                        </div>
                        <span className="text-sm text-gray-200" onClick={() => onToggleItem(item.id)}>{item.label}</span>
                        
                        <div className="ml-auto flex flex-col reorder-controls">
                          <button 
                            className="reorder-btn" 
                            onClick={(e) => { e.stopPropagation(); onReorderItem(item.id, 'up'); }}
                            disabled={index === 0}
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button 
                            className="reorder-btn" 
                            onClick={(e) => { e.stopPropagation(); onReorderItem(item.id, 'down'); }}
                            disabled={index === filteredArray.length - 1}
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    ))}

                  <form onSubmit={handleAdd} className="mt-2">
                    <input 
                      type="text" 
                      value={newItemLabel}
                      onChange={(e) => setNewItemLabel(e.target.value)}
                      placeholder="+ เพิ่มเป้าหมายย่อย..."
                      className="add-sub-item-btn text-left outline-none"
                    />
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column: History */}
            <div className="sub-checklist-column">
              <div className="column-panel history-panel">
                <h4 className="column-header">Completed History</h4>
                <div className="sub-checklist-list">
                  {milestone.subChecklist
                    .filter(item => item.isCompleted)
                    .sort((a, b) => {
                      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                      return dateB - dateA; // Newest completion at top
                    })
                    .map((item: SubChecklistItem) => (
                      <div key={item.id} className="sub-checklist-item completed" onClick={() => onToggleItem(item.id)}>
                        <div className="custom-checkbox checked">
                          <Check size={14} color="white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 line-through">{item.label}</span>
                          {item.completedAt && (
                            <span className="text-[9px] text-gray-600">
                              Completed: {new Date(item.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`detail-content-bottom ${isDrawerOpen ? 'open' : 'closed'}`}>
        <button 
          className="drawer-toggle-btn"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
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
                  onClick={() => setIsZoomedToGoal(!isZoomedToGoal)}
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
              {(['hour', 'day', 'week', 'month', 'quarter', 'year'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
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
          <div className="h-[250px]">
            <MilestoneChart 
              data={chartData} 
              targetValue={milestone.targetValue} 
              isZoomedToGoal={isZoomedToGoal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetailView;
