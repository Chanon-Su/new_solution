import React, { useState } from 'react';
import { Globe, Shield, AlertTriangle, Check, X, Languages } from 'lucide-react';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import './Settings.css';

const SettingsPage: React.FC = () => {
  const { 
    privacyHideNumbers, 
    privacyHideText, 
    timezoneOffset,
    language,
    setPrivacyHideNumbers,
    setPrivacyHideText,
    setTimezoneOffset,
    setLanguage,
    resetAllData 
  } = useSettings();

  const [nukeStep, setNukeStep] = useState<'idle' | 'confirm'>('idle');

  // Safely get translations based on current language
  const t = translations[language] || translations.th;

  const timezoneOptions = Array.from({ length: 27 }, (_, i) => i - 12); // -12 to +14

  return (
    <div className="page-container settings-page container-centered py-12 px-6">
      <div className="settings-header mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">{t.settings.title}</h1>
        <p className="text-gray-400">{t.settings.subtitle}</p>
      </div>

      <div className="settings-content space-y-8 max-w-3xl">
        
        {/* Section 1: Account & Localization */}
        <section className="settings-section glass-panel p-8 rounded-3xl border border-white/5">
          <div className="section-title-area mb-6 flex items-center gap-3">
            <div className="section-icon-box bg-emerald-500/10 text-emerald-400 p-2 rounded-xl">
              <Globe size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">{t.settings.sections.localization}</h2>
          </div>

          <div className="space-y-6">
            {/* Language Selection */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors">
              <div className="setting-info flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <Languages size={18} />
                </div>
                <div>
                  <div className="setting-label text-white font-medium">{t.settings.language.label}</div>
                  <div className="setting-desc text-sm text-gray-500">{t.settings.language.desc}</div>
                </div>
              </div>
              <div className="setting-control">
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5">
                  <button 
                    onClick={() => setLanguage('th')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'th' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    ภาษาไทย
                  </button>
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-[#10B981] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>

            {/* Timezone Selection */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="setting-info flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Globe size={18} />
                </div>
                <div>
                  <div className="setting-label text-white font-medium">{t.settings.timezone.label}</div>
                  <div className="setting-desc text-sm text-gray-500">{t.settings.timezone.desc}</div>
                </div>
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
          </div>
        </section>

        {/* Section 2: Security & Privacy */}
        <section className="settings-section glass-panel p-8 rounded-3xl border border-white/5">
          <div className="section-title-area mb-6 flex items-center gap-3">
            <div className="section-icon-box bg-blue-500/10 text-blue-400 p-2 rounded-xl">
              <Shield size={20} />
            </div>
            <h2 className="text-xl font-semibold text-white">{t.settings.sections.privacy}</h2>
          </div>

          <div className="space-y-4">
            {/* Hide Numbers */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => setPrivacyHideNumbers(!privacyHideNumbers)}>
              <div className="setting-info">
                <div className="setting-label text-white font-medium">{t.settings.privacy.hideNumbers.label}</div>
                <div className="setting-desc text-sm text-gray-500">{t.settings.privacy.hideNumbers.desc}</div>
              </div>
              <div className={`zen-toggle ${privacyHideNumbers ? 'active' : ''}`}>
                <div className="toggle-knob"></div>
              </div>
            </div>

            {/* Hide Text */}
            <div className="setting-item flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/[0.07] transition-colors cursor-pointer" onClick={() => setPrivacyHideText(!privacyHideText)}>
              <div className="setting-info">
                <div className="setting-label text-white font-medium">{t.settings.privacy.hideText.label}</div>
                <div className="setting-desc text-sm text-gray-500">{t.settings.privacy.hideText.desc}</div>
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
            <h2 className="text-xl font-semibold text-white">{t.settings.sections.danger}</h2>
          </div>

          <div className="setting-item flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
            <div className="setting-info">
              <div className="setting-label text-white font-medium">{t.settings.nuke.label}</div>
              <div className="setting-desc text-sm text-red-400/60">{t.settings.nuke.desc}</div>
            </div>
            <div className="setting-control min-w-[160px] flex justify-end">
              {nukeStep === 'idle' ? (
                <button 
                  onClick={() => setNukeStep('confirm')}
                  className="nuke-btn-initial px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all font-medium"
                >
                  {t.settings.nuke.btn}
                </button>
              ) : (
                <div className="inline-confirmation-box flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                  <button 
                    onClick={() => setNukeStep('idle')}
                    className="p-2.5 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    title={t.common.cancel}
                  >
                    <X size={18} />
                  </button>
                  <button 
                    onClick={resetAllData}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  >
                    <Check size={18} />
                    {t.settings.nuke.confirm}
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
