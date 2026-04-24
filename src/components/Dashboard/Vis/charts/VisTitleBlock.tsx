import React from 'react';
import { Type } from 'lucide-react';

interface VisTitleBlockProps {
  text?: string;
  subtext?: string;
}

const VisTitleBlock: React.FC<VisTitleBlockProps> = ({ text = 'Title', subtext }) => (
  <div className="vis-title-block">
    <div className="vis-title-block__icon">
      <Type size={16} />
    </div>
    <h2 className="vis-title-block__text">{text}</h2>
    {subtext && <p className="vis-title-block__subtext">{subtext}</p>}
  </div>
);

export default VisTitleBlock;
