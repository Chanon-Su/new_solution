import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  privacyHideNumbers: boolean;
  privacyHideText: boolean;
  timezoneOffset: number;
  language: 'th' | 'en';
  theme: 'dark' | 'light';
  setPrivacyHideNumbers: (val: boolean) => void;
  setPrivacyHideText: (val: boolean) => void;
  setTimezoneOffset: (val: number) => void;
  setLanguage: (lang: 'th' | 'en') => void;
  setTheme: (theme: 'dark' | 'light') => void;
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
      timezoneOffset: 7, // Default BKK
      language: 'th' as const,
      theme: 'dark' as const
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    
    // Apply theme to document
    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [settings]);

  const setPrivacyHideNumbers = (val: boolean) => 
    setSettings((prev: any) => ({ ...prev, privacyHideNumbers: val }));

  const setPrivacyHideText = (val: boolean) => 
    setSettings((prev: any) => ({ ...prev, privacyHideText: val }));

  const setTimezoneOffset = (val: number) => 
    setSettings((prev: any) => ({ ...prev, timezoneOffset: val }));

  const setLanguage = (lang: 'th' | 'en') =>
    setSettings((prev: any) => ({ ...prev, language: lang }));

  const setTheme = (theme: 'dark' | 'light') =>
    setSettings((prev: any) => ({ ...prev, theme: theme }));

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
    language: settings.language || 'th',
    theme: settings.theme || 'dark',
    setPrivacyHideNumbers,
    setPrivacyHideText,
    setTimezoneOffset,
    setLanguage,
    setTheme,
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
