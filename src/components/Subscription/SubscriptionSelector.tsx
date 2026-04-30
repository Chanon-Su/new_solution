import React, { useState } from 'react';
import PricingCard from './PricingCard';
import ZenField from '../UI/ZenField';
import { Sparkles, Users } from 'lucide-react';

import { STATIC_PLANS, GROUP_PLANS, VIP_PLAN, ALL_PLANS } from './planData';

interface SubscriptionSelectorProps {
  currentPlanId?: string | null;
  onSelect: (planId: string, billingCycle: 'monthly' | 'yearly') => void;
}

const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({ currentPlanId, onSelect }) => {
  const [activationCode, setActivationCode] = useState('');
  const [isVipRevealed, setIsVipRevealed] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const currentPlan = ALL_PLANS.find(p => p.id === currentPlanId);
  const currentPlanRank = currentPlan?.rank;

  // If there's a current plan, it overrides any selection and hover
  // The selection is only allowed/shown if there's no current plan
  const effectiveSelectedId = currentPlanId ? null : selectedCardId;
  const hasSelectionLock = !!currentPlanId || !!selectedCardId;

  const handleSelect = (planId: string, billingCycle: 'monthly' | 'yearly') => {
    onSelect(planId, billingCycle);
  };

  const handleApplyActivation = () => {
    if (activationCode.toUpperCase() === 'VIPALPHA') {
      setIsVipRevealed(true);
      // Auto-scroll logic could go here
    } else {
      alert('Invalid activation code');
    }
  };

  return (
    <div className="min-h-screen text-white py-20 px-6 sm:px-12 lg:px-20 overflow-y-auto page-container">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Step 1: Subscription Plans</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your digital second brain. Unlock advanced sync and collaboration features.
          </p>
        </div>

        {/* Activation Coupon Section */}
        <div className="max-w-md mx-auto mb-20">
          <ZenField label="Special Activation Code" className="w-full">
            <input 
              type="text"
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="Enter VIP code to reveal hidden plans..."
              className="flex-grow bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
            />
            <button 
              onClick={handleApplyActivation}
              className="px-6 py-2 mr-1 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Apply
            </button>
          </ZenField>
        </div>

        {/* VIP Section (Conditional) */}
        {isVipRevealed && (
          <div className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles className="text-yellow-400 w-6 h-6" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                VIP Alpha Rewards
              </h2>
            </div>
            <div className="max-w-md">
              <PricingCard 
                plan={VIP_PLAN} 
                onSelect={handleSelect} 
                isCurrent={currentPlanId === VIP_PLAN.id}
                isSelected={effectiveSelectedId === VIP_PLAN.id}
                hasAnySelected={hasSelectionLock}
                onCardClick={(id) => setSelectedCardId(id)}
                currentPlanRank={currentPlanRank}
              />
            </div>
          </div>
        )}

        {/* Standard Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {STATIC_PLANS.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handleSelect} 
              isCurrent={currentPlanId === plan.id}
              isSelected={effectiveSelectedId === plan.id}
              hasAnySelected={hasSelectionLock}
              onCardClick={(id) => setSelectedCardId(id)}
              currentPlanRank={currentPlanRank}
            />
          ))}
        </div>

        {/* Group Packs Section */}
        <div className="pt-10 border-t border-white/[0.05]">
          <div className="flex items-center gap-3 mb-10">
            <Users className="text-[#10B981] w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Groups & Friends Pack</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GROUP_PLANS.map((plan) => (
              <PricingCard 
                key={plan.id} 
                plan={plan} 
                onSelect={handleSelect} 
                isCurrent={currentPlanId === plan.id}
                isSelected={effectiveSelectedId === plan.id}
                hasAnySelected={hasSelectionLock}
                onCardClick={(id) => setSelectedCardId(id)}
                currentPlanRank={currentPlanRank}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionSelector;
