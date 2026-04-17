import { useState, useEffect } from 'react';

export const useSubscription = (onSubscriptionSuccess: (planId: string) => void) => {
  const [step, setStep] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    const handleReset = () => {
      setStep(1);
      setSelectedPlanId(null);
    };

    window.addEventListener('planto_reset_subscription', handleReset);
    return () => window.removeEventListener('planto_reset_subscription', handleReset);
  }, []);

  const handlePlanSelect = (planId: string, cycle: 'monthly' | 'yearly') => {
    setSelectedPlanId(planId);
    setBillingCycle(cycle);
    setStep(2);
  };

  const handlePaymentComplete = () => {
    if (selectedPlanId) {
      onSubscriptionSuccess(selectedPlanId);
    }
    setStep(3);
  };

  const handleBack = () => {
    setStep(1);
  };

  return {
    step,
    selectedPlanId,
    billingCycle,
    handlePlanSelect,
    handlePaymentComplete,
    handleBack,
    setStep
  };
};
