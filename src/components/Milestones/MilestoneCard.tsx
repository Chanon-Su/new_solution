import React from 'react';
import type { Milestone } from '../../types';
import { useSettings } from '../../hooks/SettingsManager';
import { translations } from '../../utils/translations';
import { Home, Bitcoin, DollarSign, TrendingUp } from 'lucide-react';

interface MilestoneCardProps {
  milestone: Milestone;
  currentValue: number;
  onViewDetails: () => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, currentValue, onViewDetails }) => {
  const { language } = useSettings();
  const t = translations[language] || translations.th;
  
  const progressPercent = Math.min(Math.round((currentValue / milestone.targetValue) * 100), 100);

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'home': return <Home size={24} />;
      case 'bitcoin': return <Bitcoin size={24} />;
      case 'dividend': return <DollarSign size={24} />;
      default: return <TrendingUp size={24} />;
    }
  };

  return (
    <div className="milestone-card group">
      <div className="card-icon-container">
        {getIcon(milestone.icon)}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="milestone-title">{milestone.title}</h3>
        {progressPercent >= 100 && (
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
            {language === 'th' ? 'สำเร็จแล้ว' : 'Complete'}
          </span>
        )}
      </div>
      
      <p className="milestone-desc">{milestone.description}</p>
      
      <div className="progress-section">
        <div className="progress-labels">
          <span className="progress-text">
            {progressPercent >= 100 
              ? (language === 'th' ? 'สำเร็จแล้ว' : 'COMPLETED') 
              : (language === 'th' ? 'ความคืบหน้า' : 'PROGRESS')}: {progressPercent}%
          </span>
          <span className="progress-values">
            {currentValue.toLocaleString()} / {milestone.targetValue.toLocaleString()} {milestone.unit}
          </span>
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      
      <div className="milestone-tags">
        {milestone.tags.map(tag => (
          <span key={tag} className="tag-chip">#{tag}</span>
        ))}
      </div>
      
      <button className="view-details-btn flex items-center justify-center gap-2" onClick={onViewDetails}>
        {language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
      </button>
    </div>
  );
};

export default MilestoneCard;
