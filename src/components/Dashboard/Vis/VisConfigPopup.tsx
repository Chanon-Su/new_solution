import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { useSettings } from '../../../hooks/SettingsManager';
import type { VisConfig, VisType, VisDataSource, VisDimension, VisValue, VisCurrency } from '../../../types';
import VisRenderer from './VisRenderer';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CHART_OPTIONS: { type: VisType; label: Record<string, string>; emoji: string; sources: VisDataSource[] }[] = [
  { type: 'pie',        label: { th: 'กราฟวงกลม (Pie)', en: 'Pie Chart' },       emoji: '🥧', sources: ['tlog'] },
  { type: 'bar',        label: { th: 'กราฟแท่ง (Bar)', en: 'Bar Chart' },        emoji: '📊', sources: ['tlog'] },
  { type: 'target-bar', label: { th: 'แถบเป้าหมาย (Target)', en: 'Target Bar' },       emoji: '🎯', sources: ['milestone'] },
  { type: 'line',       label: { th: 'กราฟเส้น (Line)', en: 'Line Chart' },       emoji: '📈', sources: ['tlog', 'assetmart'] },
  { type: 'treemap',    label: { th: 'Treemap', en: 'Treemap' },          emoji: '🗺️', sources: ['tlog'] },
  { type: 'histogram',  label: { th: 'ฮิสโตแกรม', en: 'Histogram' },        emoji: '📉', sources: ['tlog'] },
  { type: 'table',      label: { th: 'รายการ (Table)', en: 'Table List' },   emoji: '📋', sources: ['tlog'] },
  { type: 'title',      label: { th: 'ชื่อหัวข้อ', en: 'Title Block' },       emoji: '🏷️', sources: [] },
];

const DATE_PRESETS = (lang: string) => [
  { value: 'all',  label: lang === 'th' ? 'ทั้งหมด' : 'All' },
  { value: '7d',   label: lang === 'th' ? '7 วันล่าสุด' : 'Last 7 Days' },
  { value: '30d',  label: lang === 'th' ? '30 วันล่าสุด' : 'Last 30 Days' },
  { value: '90d',  label: lang === 'th' ? '3 เดือนล่าสุด' : 'Last 3 Months' },
  { value: '1y',   label: lang === 'th' ? '1 ปีล่าสุด' : 'Last 1 Year' },
  { value: 'ytd',  label: lang === 'th' ? 'ปีนี้ (YTD)' : 'Year to Date (YTD)' },
];

const TX_TYPES = ['BUY', 'SELL', 'DIVIDEND'] as const;
const ASSET_PRESETS = ['1D', '1W', '1M', '1Y', 'ALL'] as const;

function getCategories(): string[] {
  try {
    const txs = JSON.parse(localStorage.getItem('planto_transactions') ?? '[]');
    return [...new Set<string>(txs.map((t: any) => t.category).filter(Boolean))];
  } catch { return ['Crypto', 'Stock', 'Gold', 'Others']; }
}


function getFollowedSymbols(): string[] {
  try {
    const arr = JSON.parse(localStorage.getItem('planto_followed_assets') ?? '[]');
    return arr.map((a: any) => a.symbol).filter(Boolean);
  } catch { return []; }
}

function getMilestones(): { id: string; title: string }[] {
  try {
    const arr = JSON.parse(localStorage.getItem('planto_milestones') ?? '[]');
    return arr.map((m: any) => ({ id: m.id, title: m.title }));
  } catch { return []; }
}

// ─── Small UI Atoms ───────────────────────────────────────────────────────────

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="vis-config-label">{children}</label>
);

const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <div className="vis-config-select-wrapper">
    <select
      className="vis-config-select"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    <ChevronDown size={14} className="vis-config-select-icon" />
  </div>
);

const MultiToggle: React.FC<{
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
}> = ({ options, selected, onChange }) => (
  <div className="vis-config-multi-toggle">
    {options.map(opt => {
      const isOn = selected.includes(opt);
      return (
        <button
          key={opt}
          className={`vis-config-toggle-btn ${isOn ? 'active' : ''}`}
          onClick={() => onChange(isOn ? selected.filter(s => s !== opt) : [...selected, opt])}
          type="button"
        >
          {opt}
        </button>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface VisConfigPopupProps {
  blockId: string;
  initialConfig: VisConfig | undefined;
  onSave: (config: VisConfig) => void;
  onCancel: () => void;
}

const defaultConfig = (type: VisType = 'empty'): VisConfig => ({
  visType: type,
  dataSource: type === 'target-bar' ? 'milestone' : type === 'title' ? 'tlog' : 'tlog',
  title: 'New Block',
  dimension: 'category',
  value: 'cash',
  currency: 'THB',
  dateRange: { preset: 'all' },
  maxRows: 30,
  assetmartPreset: '1M',
});

const VisConfigPopup: React.FC<VisConfigPopupProps> = ({
  initialConfig, onSave, onCancel,
}) => {
  const { language } = useSettings();
  const [draft, setDraft] = useState<VisConfig>(() => initialConfig ?? defaultConfig());

  useEffect(() => {
    setDraft(initialConfig ?? defaultConfig());
  }, [initialConfig]);

  const patch = (updates: Partial<VisConfig>) =>
    setDraft(prev => ({ ...prev, ...updates }));

  const selectedChart = CHART_OPTIONS.find(c => c.type === draft.visType);

  // Auto-set dataSource when chart type changes
  const handleChartTypeChange = (type: VisType) => {
    const defaultSource = type === 'target-bar' ? 'milestone'
      : type === 'title' ? 'tlog'
      : 'tlog';
    patch({ visType: type, dataSource: defaultSource });
    // Remove assetmart symbol when switching away from line
    if (type !== 'line') {
      patch({ visType: type, dataSource: defaultSource, assetmartSymbol: undefined });
    }
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    onSave(draft);
  };

  const showDimension = ['pie', 'bar', 'treemap', 'histogram'].includes(draft.visType)
    && draft.dataSource === 'tlog';
  const showValue = ['pie', 'bar', 'line', 'treemap', 'histogram'].includes(draft.visType)
    && draft.dataSource === 'tlog';
  const showCurrency = draft.visType !== 'title' && draft.dataSource !== 'assetmart';
  const showFilters = draft.dataSource === 'tlog' && draft.visType !== 'title';
  const showDateRange = ['bar', 'line', 'histogram', 'table'].includes(draft.visType)
    && draft.dataSource === 'tlog';
  const showMilestoneFilter = draft.visType === 'target-bar';
  const showAssetmartConfig = draft.visType === 'line' && draft.dataSource === 'assetmart';
  const showMaxRows = draft.visType === 'table';
  const showTitleConfig = draft.visType === 'title';
  const showDataSourceSwitch = draft.visType === 'line';

  const categories = getCategories();
  const followedSymbols = getFollowedSymbols();
  const milestones = getMilestones();

  return createPortal(
    <div className="vis-config-overlay" onClick={onCancel}>
      <div className="vis-config-popup" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="vis-config-header">
          <h2 className="vis-config-title">⚙️ {language === 'th' ? 'ตั้งค่า Visualization' : 'Visualization Settings'}</h2>
          <button className="vis-config-close" onClick={onCancel}><X size={18} /></button>
        </div>

        <div className="vis-config-body">
          {/* ── LEFT PANEL: Config Form ── */}
          <div className="vis-config-form">

            {/* Block Title */}
            <div className="vis-config-field">
              <Label>{language === 'th' ? 'ชื่อ Block' : 'Block Title'}</Label>
              <input
                className="vis-config-input"
                value={draft.title}
                onChange={e => patch({ title: e.target.value })}
                placeholder={language === 'th' ? 'เช่น Portfolio Allocation' : 'e.g. Portfolio Allocation'}
              />
            </div>

            {/* Chart Type */}
            <div className="vis-config-field">
              <Label>{language === 'th' ? 'ประเภท Chart' : 'Chart Type'}</Label>
              <div className="vis-config-chart-grid">
                {CHART_OPTIONS.map(opt => (
                  <button
                    key={opt.type}
                    type="button"
                    className={`vis-config-chart-btn ${draft.visType === opt.type ? 'active' : ''}`}
                    onClick={() => handleChartTypeChange(opt.type)}
                  >
                    <span className="vis-config-chart-emoji">{opt.emoji}</span>
                    <span className="vis-config-chart-label">{opt.label[language] || opt.label.en}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Source Switch (only for Line) */}
            {showDataSourceSwitch && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'แหล่งข้อมูล' : 'Data Source'}</Label>
                <MultiToggle
                  options={['tlog', 'assetmart']}
                  selected={[draft.dataSource]}
                  onChange={([v]) => patch({ dataSource: (v as VisDataSource) ?? 'tlog' })}
                />
              </div>
            )}

            {/* Dimension */}
            {showDimension && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'แกนหลัก (Dimension)' : 'Primary Dimension'}</Label>
                <Select
                  value={draft.dimension ?? 'category'}
                  onChange={v => patch({ dimension: v as VisDimension })}
                  options={[
                    { value: 'category', label: language === 'th' ? 'หมวดหมู่ (Crypto, Stock ...)' : 'Category (Crypto, Stock ...)' },
                    { value: 'asset', label: language === 'th' ? 'สินทรัพย์ (BTC, AAPL ...)' : 'Asset (BTC, AAPL ...)' },
                    { value: 'type', label: language === 'th' ? 'ประเภทธุรกรรม (BUY/SELL/DIVIDEND)' : 'Transaction Type (BUY/SELL/DIVIDEND)' },
                  ]}
                />
              </div>
            )}

            {/* Value */}
            {showValue && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'ค่าที่แสดง' : 'Displayed Value'}</Label>
                <Select
                  value={draft.value ?? 'cash'}
                  onChange={v => patch({ value: v as VisValue })}
                  options={[
                    { value: 'cash', label: language === 'th' ? 'มูลค่า (Cash)' : 'Value (Cash)' },
                    { value: 'unit', label: language === 'th' ? 'จำนวนหน่วย (Unit)' : 'Units (Quantity)' },
                    { value: 'count', label: language === 'th' ? 'จำนวนธุรกรรม (Count)' : 'Transaction Count' },
                  ]}
                />
              </div>
            )}

            {/* Currency */}
            {showCurrency && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'สกุลเงินที่แสดง' : 'Display Currency'}</Label>
                <MultiToggle
                  options={['THB', 'USD']}
                  selected={[draft.currency ?? 'THB']}
                  onChange={([v]) => patch({ currency: (v as VisCurrency) ?? 'THB' })}
                />
              </div>
            )}

            {/* Filters: Category & Asset */}
            {showFilters && (
              <>
                {categories.length > 0 && (
                  <div className="vis-config-field">
                    <Label>{language === 'th' ? 'กรองหมวดหมู่' : 'Filter Categories'}</Label>
                    <MultiToggle
                      options={categories}
                      selected={draft.filter?.categories ?? []}
                      onChange={cats => patch({ filter: { ...draft.filter, categories: cats } })}
                    />
                  </div>
                )}

                <div className="vis-config-field">
                  <Label>{language === 'th' ? 'กรองประเภทธุรกรรม' : 'Filter Tx Types'}</Label>
                  <MultiToggle
                    options={[...TX_TYPES]}
                    selected={draft.filter?.txTypes ?? []}
                    onChange={types => patch({
                      filter: { ...draft.filter, txTypes: types as ('BUY' | 'SELL' | 'DIVIDEND')[] }
                    })}
                  />
                </div>
              </>
            )}

            {/* Date Range */}
            {showDateRange && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'ช่วงเวลา' : 'Time Period'}</Label>
                <Select
                  value={draft.dateRange?.preset ?? 'all'}
                  onChange={v => patch({ dateRange: { preset: v as any } })}
                  options={DATE_PRESETS(language)}
                />
              </div>
            )}

            {/* Milestone Filter */}
            {showMilestoneFilter && milestones.length > 0 && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'เลือก Milestone ที่จะแสดง' : 'Select Milestones to Display'}</Label>
                <MultiToggle
                  options={milestones.map(m => m.title)}
                  selected={
                    milestones
                      .filter(m => (draft.filter?.milestoneIds ?? []).includes(m.id))
                      .map(m => m.title)
                  }
                  onChange={titles => patch({
                    filter: {
                      ...draft.filter,
                      milestoneIds: milestones.filter(m => titles.includes(m.title)).map(m => m.id),
                    }
                  })}
                />
                <p className="vis-config-hint">{language === 'th' ? 'ไม่เลือก = แสดงทั้งหมด' : 'None selected = Show all'}</p>
              </div>
            )}

            {/* AssetMart Config */}
            {showAssetmartConfig && (
              <>
                <div className="vis-config-field">
                  <Label>{language === 'th' ? 'Asset จาก Follow List' : 'Asset from Follow List'}</Label>
                  {followedSymbols.length > 0 ? (
                    <Select
                      value={draft.assetmartSymbol ?? ''}
                      onChange={v => patch({ assetmartSymbol: v })}
                      placeholder={language === 'th' ? '-- เลือก Asset --' : '-- Select Asset --'}
                      options={followedSymbols.map(s => ({ value: s, label: s }))}
                    />
                  ) : (
                    <p className="vis-config-hint">
                      {language === 'th' ? 'ยังไม่มี Asset ใน Follow List — ไปกด Follow ที่ Asset-Mart ก่อน' : 'No assets in Follow List — Go follow them in Asset-Mart first'}
                    </p>
                  )}
                </div>
                <div className="vis-config-field">
                  <Label>{language === 'th' ? 'ช่วงเวลา' : 'Time Period'}</Label>
                  <MultiToggle
                    options={[...ASSET_PRESETS]}
                    selected={[draft.assetmartPreset ?? '1M']}
                    onChange={([v]) => patch({ assetmartPreset: (v as any) ?? '1M' })}
                  />
                </div>
              </>
            )}

            {/* Max Rows */}
            {showMaxRows && (
              <div className="vis-config-field">
                <Label>{language === 'th' ? 'จำนวนรายการสูงสุด (N)' : 'Max Rows (N)'}</Label>
                <input
                  className="vis-config-input"
                  type="number"
                  min={5}
                  max={200}
                  value={draft.maxRows ?? 30}
                  onChange={e => patch({ maxRows: parseInt(e.target.value) || 30 })}
                />
              </div>
            )}

            {/* Title Block Config */}
            {showTitleConfig && (
              <>
                <div className="vis-config-field">
                  <Label>{language === 'th' ? 'ข้อความหัวข้อ' : 'Title Text'}</Label>
                  <input
                    className="vis-config-input"
                    value={draft.titleText ?? ''}
                    onChange={e => patch({ titleText: e.target.value })}
                    placeholder={language === 'th' ? 'เช่น My Portfolio' : 'e.g. My Portfolio'}
                  />
                </div>
                <div className="vis-config-field">
                  <Label>{language === 'th' ? 'ข้อความรอง (ไม่บังคับ)' : 'Subtitle (Optional)'}</Label>
                  <input
                    className="vis-config-input"
                    value={draft.titleSubtext ?? ''}
                    onChange={e => patch({ titleSubtext: e.target.value })}
                    placeholder={language === 'th' ? 'เช่น อัปเดต 2026' : 'e.g. Updated 2026'}
                  />
                </div>
              </>
            )}

            {/* Actions */}
            <div className="vis-config-actions">
              <button className="vis-config-btn-cancel" onClick={onCancel}>{language === 'th' ? 'ยกเลิก' : 'Cancel'}</button>
              <button className="vis-config-btn-apply" onClick={handleSave}>✓ Apply</button>
            </div>
          </div>

          {/* ── RIGHT PANEL: Live Preview ── */}
          <div className="vis-config-preview">
            <div className="vis-config-preview-label">
              <span>Preview</span>
              <span className="vis-config-preview-badge">{selectedChart?.emoji} {selectedChart?.label[language] || selectedChart?.label.en}</span>
            </div>
            <div className="vis-config-preview-canvas">
              <VisRenderer config={draft} editMode={false} />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default VisConfigPopup;
