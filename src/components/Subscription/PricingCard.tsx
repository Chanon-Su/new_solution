import React from 'react';
import { Check } from 'lucide-react';
import type { SubscriptionPlan } from '../../types';

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrent?: boolean;
  isSelected?: boolean;
  hasAnySelected?: boolean;
  onSelect: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
  onCardClick: (planId: string) => void;
  currentPlanRank?: number;
}

const PlanFeatureList: React.FC<{ features: string[] }> = ({ features }) => (
  <ul className="space-y-4">
    {features.map((feature, index) => (
      <li key={index} className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0 w-4 h-4 rounded-full bg-[#10B981]/10 flex items-center justify-center">
          <Check className="w-3 h-3 text-[#10B981]" />
        </div>
        <span className="text-sm text-gray-300 leading-snug">
          {feature.split(/(<u>.*?<\/u>)/g).map((part, i) =>
            part.startsWith('<u>')
              ? <u key={i} className="decoration-[#10B981] underline-offset-4">{part.replace(/<\/?u>/g, '')}</u>
              : part
          )}
        </span>
      </li>
    ))}
  </ul>
);

const PlanActionButtons: React.FC<{
  plan: SubscriptionPlan;
  isCurrent: boolean;
  currentPlanRank?: number;
  onSelect: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}> = ({ plan, isCurrent, currentPlanRank, onSelect }) => {
  const getButtonLabel = (cycle: 'monthly' | 'yearly') => {
    if (isCurrent) return cycle === 'monthly' ? 'Currently Active' : 'Active Plan';
    if (!currentPlanRank) return cycle === 'monthly' ? 'Buy Monthly' : `Buy Yearly ($${plan.billing.yearlyPrice}/yr)`;
    
    const prefix = plan.rank > currentPlanRank ? 'Upgrade' : 'Downgrade';
    return cycle === 'monthly' 
      ? `${prefix} Monthly` 
      : `${prefix} Yearly ($${plan.billing.yearlyPrice}/yr)`;
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan.id, 'monthly');
        }}
        disabled={isCurrent}
        className={`
          w-full py-3.5 px-4 font-bold text-sm rounded-xl transition-all duration-200 
          ${isCurrent
            ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
            : 'bg-[#10B981] hover:bg-[#059669] text-black active:scale-[0.98]'}
        `}
      >
        {getButtonLabel('monthly')}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan.id, 'yearly');
        }}
        disabled={isCurrent}
        className={`
          w-full py-3.5 px-4 font-bold text-sm rounded-xl border transition-all duration-200 
          ${isCurrent
            ? 'bg-white/5 text-gray-500 cursor-not-allowed border-white/5'
            : 'bg-white/[0.05] hover:bg-white/[0.08] text-white border-white/[0.05] active:scale-[0.98]'}
        `}
      >
        {getButtonLabel('yearly')}
      </button>
    </div>
  );
};

const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  isCurrent,
  isSelected,
  hasAnySelected,
  onSelect,
  onCardClick,
  currentPlanRank
}) => {


  return (
    <div
      onClick={() => !isCurrent && onCardClick(plan.id)}
      className={`
        relative flex flex-col p-8 rounded-3xl transition-all duration-500 group border
        ${isCurrent 
          ? 'cursor-default border-[#10B981] ring-2 ring-[#10B981]/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] bg-[#0D0D0D]' 
          : 'cursor-pointer border-white/[0.05]'}
        ${isSelected 
          ? 'bg-white/[0.12] brightness-125 shadow-[0_20px_80px_rgba(0,0,0,0.6)] z-10 scale-[1.02]' 
          : 'bg-[#0D0D0D] hover:bg-white/[0.05] hover:brightness-110'}
      `}
    >
      {isCurrent && (
        <span className="absolute -top-3 left-8 px-3 py-1 bg-[#10B981] text-black text-[10px] font-extrabold uppercase tracking-widest rounded-full ring-2 ring-[#10B981]/20">
          Current Plan
        </span>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">${plan.billing.monthlyPrice}</span>
          <span className="text-sm text-gray-500 font-medium">{plan.billing.currency}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Per month, billed monthly</p>
      </div>

      <div className="flex-grow mb-10">
        <PlanFeatureList features={plan.features} />
      </div>

      <PlanActionButtons 
        plan={plan} 
        isCurrent={!!isCurrent} 
        currentPlanRank={currentPlanRank} 
        onSelect={onSelect} 
      />
    </div>
  );
};

export default PricingCard;
