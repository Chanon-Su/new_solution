import React from 'react';
import { useSettings } from '../../../hooks/SettingsManager';
import { translations } from '../../../utils/translations';
import { BarChart2, Settings } from 'lucide-react';

interface VisEmptyStateProps {
  editMode: boolean;
  onConfigure?: () => void;
}

const VisEmptyState: React.FC<VisEmptyStateProps> = ({ editMode, onConfigure }) => {
  const { language } = useSettings();
  const t = translations[language] || translations.th;

  return (
    <div className="vis-empty-state">
      <BarChart2 className="vis-empty-state__icon" size={28} />
      <p className="vis-empty-state__label">{language === 'th' ? 'ยังไม่มี Visualization' : 'No Visualization yet'}</p>
      {editMode && onConfigure && (
        <button className="vis-empty-state__btn" onClick={onConfigure}>
          <Settings size={13} />
          {language === 'th' ? 'ตั้งค่า Vis' : 'Configure Vis'}
        </button>
      )}
    </div>
  );
};

export default VisEmptyState;
