import React from 'react';
import SubscriptionSelector from './SubscriptionSelector';
import CheckoutPage from './CheckoutPage';
import SuccessPage from './SuccessPage';
import { useSubscription } from './hooks/useSubscription';

interface SubscriptionJourneyProps {
  currentPlanId: string | null;
  onSubscriptionSuccess: (planId: string) => void;
  onComplete: () => void;
}

const SubscriptionJourney: React.FC<SubscriptionJourneyProps> = ({ 
  currentPlanId, 
  onSubscriptionSuccess, 
  onComplete 
}) => {
  const {
    step,
    selectedPlanId,
    billingCycle,
    handlePlanSelect,
    handlePaymentComplete,
    handleBack
  } = useSubscription(onSubscriptionSuccess);

  return (
    <div className={`subscription-journey-wrapper w-full relative ${step === 3 ? 'h-[calc(100vh-var(--header-height))] overflow-hidden' : 'min-h-screen'}`}>
      {step === 1 && (
        <SubscriptionSelector 
          currentPlanId={currentPlanId} 
          onSelect={handlePlanSelect} 
        />
      )}
      
      {step === 2 && selectedPlanId && (
        <CheckoutPage 
          planId={selectedPlanId} 
          cycle={billingCycle} 
          onBack={handleBack}
          onComplete={handlePaymentComplete}
        />
      )}

      {step === 3 && (
        <SuccessPage onFinish={onComplete} />
      )}
    </div>
  );
};

export default SubscriptionJourney;
