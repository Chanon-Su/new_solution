import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  privacyHideNumbers: boolean;
  privacyHideText: boolean;
  timezoneOffset: number;
  setPrivacyHideNumbers: (val: boolean) => void;
  setPrivacyHideText: (val: boolean) => void;
  setTimezoneOffset: (val: number) => void;
  resetAllData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'planto_settings',
  TRANSACTIONS: 'planto_transactions',
  MILESTONES: 'planto_milestones',
  FOLLOWED_ASSETS: 'planto_followed_assets',
  QUICKFILL: 'planto_quick_fills',
  DASHBOARD_V3: 'planto-zen-dashboard-v3',
  LAST_CATEGORY: 'planto_tlog_last_category'
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      privacyHideNumbers: false,
      privacyHideText: false,
      timezoneOffset: 7 // Default BKK
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const setPrivacyHideNumbers = (val: boolean) => 
    setSettings((prev: any) => ({ ...prev, privacyHideNumbers: val }));

  const setPrivacyHideText = (val: boolean) => 
    setSettings((prev: any) => ({ ...prev, privacyHideText: val }));

  const setTimezoneOffset = (val: number) => 
    setSettings((prev: any) => ({ ...prev, timezoneOffset: val }));

  const resetAllData = () => {
    // ล้างข้อมูลทั้งหมดใน localStorage ที่เกี่ยวข้องกับแอป
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    // Force reload page เพื่อให้ state ทุกอย่างกลับเป็นค่าเริ่มต้น
    window.location.reload();
  };

  const value = {
    privacyHideNumbers: settings.privacyHideNumbers,
    privacyHideText: settings.privacyHideText,
    timezoneOffset: settings.timezoneOffset,
    setPrivacyHideNumbers,
    setPrivacyHideText,
    setTimezoneOffset,
    resetAllData
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
