import React, { useState } from 'react';
import { Globe, Shield, AlertTriangle, Check, X } from 'lucide-react';
import { useSettings } from '../../hooks/SettingsManager';
import './Settings.css';

const SettingsPage: React.FC = () => {
  const { 
    privacyHideNumbers, 
    privacyHideText, 
    timezoneOffset,
    setPrivacyHideNumbers,
    setPrivacyHideText,
    setTimezoneOffset,
    resetAllData 
  } = useSettings();

  const [nukeStep, setNukeStep] = useState<'idle' | 'confirm'>('idle');

  const timezoneOptions = Array.from({ length: 27 }, (_, i) => i - 12); // -12 to +14

  return (
    <div className="page-container settings-page container-centered py-12 px-6">
      <div className="settings-header mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your system preferences and privacy</p>
      </div>

      <div className="settings-content space-y-8 max-w-3xl">
        
        {/* Section 1: Account & Localization */}
        <section className="settings-section glass-panel p-8 rounded-3xl border border-white/5">
          <div className="section-title-area mb-6 flex items-center gap-3">
            <div className="section-icon-box bg-emerald-500/10 text-emerald-400 p-2 rounded-xl">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">Account & Localization</h2>
          </div>

          <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl">
            <div className="setting-info">
              <div className="setting-label text-white font-medium">Timezone Offset</div>
              <div className="setting-desc text-sm text-gray-500">Set your local timezone for transaction history</div>
            </div>
            <div className="setting-control">
              <select 
                value={timezoneOffset}
                onChange={(e) => setTimezoneOffset(parseInt(e.target.value))}
                className="zen-select bg-[#151515] text-white border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-emerald-500/50 transition-colors cursor-pointer"
              >
                {timezoneOptions.map(offset => (
                  <option key={offset} value={offset}>
                    {offset >= 0 ? `+${offset}` : offset} {offset === 7 ? '(BKK)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Security & Privacy */}
        <section className="settings-section glass-panel p-8 rounded-3xl border border-white/5">
          <div className="section-title-area mb-6 flex items-center gap-3">
            <div className="section-icon-box bg-blue-500/10 text-blue-400 p-2 rounded-xl">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">Security & Privacy</h2>
          </div>

          <div className="space-y-4">
            {/* Hide Numbers */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => setPrivacyHideNumbers(!privacyHideNumbers)}>
              <div className="setting-info">
                <div className="setting-label text-white font-medium">Hide Numbers</div>
                <div className="setting-desc text-sm text-gray-500">Replace amounts, prices, and fees with ******** (T-Log only)</div>
              </div>
              <div className={`zen-toggle ${privacyHideNumbers ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </div>
            </div>

            {/* Hide Text */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => setPrivacyHideText(!privacyHideText)}>
              <div className="setting-info">
                <div className="setting-label text-white font-medium">Hide Text Details</div>
                <div className="setting-desc text-sm text-gray-500">Replace asset names, date, currency, and notes with ******** (T-Log only)</div>
              </div>
              <div className={`zen-toggle ${privacyHideText ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Danger Zone */}
        <section className="settings-section glass-panel p-8 rounded-3xl border border-red-500/10 bg-red-500/[0.02]">
          <div className="section-title-area mb-6 flex items-center gap-3">
            <div className="section-icon-box bg-red-500/10 text-red-400 p-2 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">Danger Zone</h2>
          </div>

          <div className="setting-item flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
            <div className="setting-info">
              <div className="setting-label text-white font-medium">Reset All Data (Nuke)</div>
              <div className="setting-desc text-sm text-red-400/60">Permanently delete all transactions, milestones, and settings. This cannot be undone.</div>
            </div>
            <div className="setting-control min-w-[160px] flex justify-end">
              {nukeStep === 'idle' ? (
                <button 
                  onClick={() => setNukeStep('confirm')}
                  className="nuke-btn-initial px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all font-medium"
                >
                  Reset Everything
                </button>
              ) : (
                <div className="inline-confirmation-box flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <button 
                    onClick={() => setNukeStep('idle')}
                    className="p-2.5 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                  <button 
                    onClick={resetAllData}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  >
                    <Check size={18} />
                    Confirm Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;
