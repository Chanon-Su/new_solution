import React from 'react';
import type { Milestone } from '../../types';
import { TrendingUp, Settings, CheckCircle2, Trash2, X, ChevronDown, Plus } from 'lucide-react';

interface MilestoneSummaryProps {
  milestone: Milestone;
  currentValue: number;
  isEditing: boolean;
  showDeleteConfirm: boolean;
  isAssetDropdownOpen: boolean;
  isDimensionDropdownOpen: boolean;
  isUnitDropdownOpen: boolean;
  followedAssets: { symbol: string, name: string }[];
  onToggleEdit: () => void;
  onShowDeleteConfirm: (show: boolean) => void;
  onDelete: () => void;
  onUpdate: (data: Partial<Milestone>) => void;
  onToggleAssetDropdown: () => void;
  onToggleDimensionDropdown: () => void;
  onToggleUnitDropdown: () => void;
}

const MilestoneSummary: React.FC<MilestoneSummaryProps> = ({
  milestone,
  currentValue,
  isEditing,
  showDeleteConfirm,
  isAssetDropdownOpen,
  isDimensionDropdownOpen,
  isUnitDropdownOpen,
  followedAssets,
  onToggleEdit,
  onShowDeleteConfirm,
  onDelete,
  onUpdate,
  onToggleAssetDropdown,
  onToggleDimensionDropdown,
  onToggleUnitDropdown
}) => {
  const rawPercentage = (milestone.targetValue > 0 && milestone.linkedAssetSymbol)
    ? (currentValue / milestone.targetValue) * 100
    : null;

  const displayPercentage = rawPercentage !== null 
    ? (rawPercentage > 300 ? 'COMPLETED' : `${rawPercentage.toFixed(2)}%`)
    : '?%';

  const precision = milestone.precision ?? 2;

  return (
    <div className="summary-card">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          <div className="summary-icon-bg">
            <TrendingUp size={48} className="text-emerald-500" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center flex-wrap gap-x-2">
              <div className="flex-shrink-0">
                <div className={`flex items-center h-[48px] rounded-xl px-3 py-1 -ml-3 transition-all border ${isEditing ? 'bg-white/5 border-white/10' : 'bg-transparent border-transparent'}`}>
                  {isEditing ? (
                    <input
                      className="text-3xl font-bold text-white font-['Manrope'] bg-transparent border-none outline-none focus:ring-0 p-0 w-80"
                      value={milestone.title}
                      onChange={(e) => onUpdate({ title: e.target.value })}
                      placeholder="Untitled Goal"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold text-white font-['Manrope'] leading-none max-w-md truncate">{milestone.title}</h2>
                      {rawPercentage !== null && rawPercentage >= 100 && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse flex-shrink-0">
                          Complete
                        </span>
                      )}
                    </div>
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
                      onChange={(e) => onUpdate({ tags: e.target.value.split(' ').filter(t => t !== '') })}
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

            <div className="mt-1">
              {isEditing ? (
                <textarea
                  className="text-gray-400 text-sm max-w-xl bg-white/5 border border-white/10 outline-none focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-3 py-1.5 -ml-3 w-full resize-none h-[64px] transition-all leading-relaxed"
                  value={milestone.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
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
                      onClick={onDelete}
                      className="text-[10px] font-extrabold text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      YES, DELETE
                    </button>
                    <button
                      onClick={() => onShowDeleteConfirm(false)}
                      className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <button
                    className="p-2 rounded-full hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all"
                    onClick={() => onShowDeleteConfirm(true)}
                    title="Delete Milestone"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            )}
            <button
              className={`p-2 rounded-full transition-all ${isEditing ? 'bg-emerald-500 text-white' : 'hover:bg-white/5 text-gray-500'}`}
              onClick={onToggleEdit}
              title={isEditing ? 'Save Changes' : 'Edit Milestone'}
            >
              {isEditing ? <CheckCircle2 size={20} /> : <Settings size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="summary-progress-section">
        <div className="flex justify-between items-end mb-3">
          <span className={`text-4xl font-bold ${displayPercentage === 'COMPLETED' ? 'emerald-text animate-pulse tracking-tight' : 'emerald-text'}`}>
            {displayPercentage}
          </span>
          
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block mb-1">Target Achievement</span>
            <div className="flex items-center justify-end gap-3">
              <span className="text-4xl font-bold text-white leading-none">
                {milestone.linkedAssetSymbol && !isNaN(currentValue) ? currentValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision }) : '?'}
              </span>
              <span className="text-gray-600 text-3xl leading-none">/</span>
              <span className="text-4xl font-bold text-emerald-500 leading-none">{milestone.targetValue.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}</span>
              <span className="text-lg text-gray-500 ml-1 self-end mb-0.5 leading-none">{milestone.unit || '---'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="summary-progress-bar-bg">
        <div
          className="summary-progress-bar-fill"
          style={{ width: `${Math.min(rawPercentage || 0, 100)}%` }}
        ></div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Linked Strategic Asset</span>
          <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            {milestone.linkedAssetSymbol ? (
              <div
                className={`asset-link-card group relative ${isEditing ? 'cursor-pointer hover:border-emerald-500/50' : 'cursor-default'}`}
                onClick={() => isEditing && onToggleAssetDropdown()}
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
                  onClick={onToggleAssetDropdown}
                >
                  <Plus size={14} />
                  <span>Select Asset</span>
                </button>
              )
            )}

            {isEditing && isAssetDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] py-2 overflow-hidden backdrop-blur-2xl ring-1 ring-emerald-500/20">
                <div className="px-3 py-1 mb-1 border-b border-white/5 text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-white/[0.02]">Choose Asset</div>
                <div className="max-h-60 overflow-y-auto">
                  <button
                    className="w-full text-left px-4 py-2.5 hover:bg-red-500/10 text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-2"
                    onClick={() => {
                      onUpdate({ linkedAssetSymbol: '' });
                      onToggleAssetDropdown();
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
                        onUpdate({ linkedAssetSymbol: asset.symbol });
                        onToggleAssetDropdown();
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

          <div className="relative">
            <button
              className={`h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all ${isEditing ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default opacity-80'}`}
              onClick={() => isEditing && onToggleDimensionDropdown()}
            >
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-emerald-500">
                {milestone.unit?.toLowerCase().includes('$') || milestone.unit?.toLowerCase().includes('฿') ? '₿' : 'Σ'}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Tracking Mode</span>
                <span className="text-xs font-bold text-white capitalize">
                  {milestone.trackingDimension === 'Cash' ? 'Value' : (milestone.trackingDimension === 'Unit' ? 'Quantity' : 'Select Mode')}
                </span>
              </div>
              <ChevronDown size={14} className={`transition-all ${isEditing ? 'text-gray-600 opacity-100' : 'opacity-0'}`} />
            </button>

            {isEditing && isDimensionDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] py-2 overflow-hidden backdrop-blur-2xl ring-1 ring-emerald-500/20">
                <div className="px-3 py-1 mb-1 border-b border-white/5 text-[9px] text-gray-500 uppercase font-bold tracking-widest bg-white/[0.02]">Focus Dimension</div>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs text-gray-300 hover:text-emerald-500 transition-colors flex items-center gap-3"
                  onClick={() => {
                    onUpdate({
                      trackingDimension: 'Cash',
                      unit: milestone.unit === 'Units' || !milestone.unit ? 'USD' : milestone.unit
                    });
                    onToggleDimensionDropdown();
                  }}
                >
                  <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">$</div>
                  <span>Value (USD/THB)</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs text-gray-300 hover:text-emerald-500 transition-colors flex items-center gap-3"
                  onClick={() => {
                    onUpdate({
                      trackingDimension: 'Unit',
                      unit: milestone.unit === 'USD' || milestone.unit === 'THB' || !milestone.unit ? 'Units' : milestone.unit
                    });
                    onToggleDimensionDropdown();
                  }}
                >
                  <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-500">U</div>
                  <span>Quantity (Unit)</span>
                </button>
              </div>
            )}
          </div>

          <div className="h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all">
            <div className="flex flex-col items-start w-24">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Target Value</span>
              {isEditing ? (
                <input
                  type="number"
                  className="text-xs font-bold text-emerald-500 bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                  value={milestone.targetValue}
                  onChange={(e) => onUpdate({ targetValue: Number(e.target.value) })}
                />
              ) : (
                <span className="text-xs font-bold text-emerald-500 truncate w-full select-none cursor-default">{milestone.targetValue.toLocaleString(undefined, { maximumFractionDigits: 8 })}</span>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className={`h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all min-w-[120px] ${isEditing && milestone.trackingDimension === 'Cash' ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default'}`}
              onClick={() => isEditing && milestone.trackingDimension === 'Cash' && onToggleUnitDropdown()}
            >
              <div className="flex flex-col items-start w-full">
                <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Measure Unit</span>
                {isEditing ? (
                  milestone.trackingDimension === 'Cash' ? (
                    <div className="flex items-center justify-between w-full group">
                      <span className="text-xs font-bold text-white uppercase">{milestone.unit || 'USD'}</span>
                      <ChevronDown size={14} className={`text-gray-600 transition-all ${isUnitDropdownOpen ? 'rotate-180 text-emerald-500' : 'group-hover:text-emerald-500'}`} />
                    </div>
                  ) : (
                    <input
                      className="text-xs font-bold text-white bg-transparent border-none outline-none focus:ring-0 w-full p-0 uppercase"
                      value={milestone.unit}
                      onChange={(e) => onUpdate({ unit: e.target.value })}
                      placeholder="UNIT..."
                    />
                  )
                ) : (
                  <span className="text-xs font-bold text-white uppercase truncate w-full select-none cursor-default">{milestone.linkedAssetSymbol ? (milestone.unit || '---') : '---'}</span>
                )}
              </div>
            </div>

            {isEditing && milestone.trackingDimension === 'Cash' && isUnitDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-[#0F0F0F] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] py-2 overflow-hidden backdrop-blur-2xl ring-1 ring-emerald-500/20">
                <button
                  className={`w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs transition-colors flex items-center justify-between ${milestone.unit === 'USD' ? 'text-emerald-500 font-bold' : 'text-gray-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ unit: 'USD' });
                    onToggleUnitDropdown();
                  }}
                >
                  <span>USD</span>
                  {milestone.unit === 'USD' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                </button>
                <button
                  className={`w-full text-left px-4 py-2.5 hover:bg-emerald-500/10 text-xs transition-colors flex items-center justify-between ${milestone.unit === 'THB' ? 'text-emerald-500 font-bold' : 'text-gray-300'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate({ unit: 'THB' });
                    onToggleUnitDropdown();
                  }}
                >
                  <span>THB</span>
                  {milestone.unit === 'THB' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                </button>
              </div>
            )}
          </div>

          <div className="h-[48px] px-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 transition-all min-w-[80px]">
            <div className="flex flex-col items-start w-full">
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Precision</span>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="8"
                  className="text-xs font-bold text-emerald-500 bg-transparent border-none outline-none focus:ring-0 w-full p-0"
                  value={milestone.precision ?? 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdate({ precision: isNaN(val) ? 0 : Math.max(0, Math.min(8, val)) });
                  }}
                />
              ) : (
                <span className="text-xs font-bold text-gray-500 select-none cursor-default">.{'0'.repeat(precision)}</span>
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
          Last Updated: {new Date(milestone.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MilestoneSummary);
