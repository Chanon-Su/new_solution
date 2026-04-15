import React from 'react';

interface NavigationArrowsProps {
  activePage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const NavigationArrows: React.FC<NavigationArrowsProps> = ({
  activePage,
  totalPages,
  onPrev,
  onNext
}) => {
  return (
    <>
      <div 
        className={`ghost-nav left ${activePage === 0 ? 'disabled' : ''}`} 
        onClick={onPrev}
      >
        <div className="arrow">‹</div>
      </div>
      <div 
        className={`ghost-nav right ${activePage === totalPages - 1 ? 'disabled' : ''}`} 
        onClick={onNext}
      >
        <div className="arrow">›</div>
      </div>
    </>
  );
};

export default NavigationArrows;
