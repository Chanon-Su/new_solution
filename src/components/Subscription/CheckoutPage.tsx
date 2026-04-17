import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Landmark, QrCode, ShieldCheck, Wallet } from 'lucide-react';
import { ALL_PLANS } from './planData';
import ZenField from '../UI/ZenField';
import { calculateTax, calculateDiscount, formatCurrency } from './utils/billingUtils';

interface CheckoutPageProps {
  planId: string;
  cycle: 'monthly' | 'yearly';
  onBack: () => void;
  onComplete: () => void;
}

const PaymentMethodSelector: React.FC<{
  selected: string;
  onSelect: (id: string) => void;
}> = ({ selected, onSelect }) => {
  const methods = [
    { id: 'promptpay', label: 'PromptPay', icon: QrCode },
    { id: 'card', label: 'Credit Card', icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', icon: Landmark },
    { id: 'true-money', label: 'TrueMoney', icon: Wallet },
    { id: 'shopeepay', label: 'ShopeePay', icon: Wallet },
  ];

  return (
    <section>
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#10B981]" />
        Payment Method
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {methods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`
              flex flex-col items-center justify-center p-5 rounded-2xl border transition-all
              ${selected === method.id 
                ? 'bg-[#10B981]/10 border-[#10B981] text-white shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                : 'bg-[#0D0D0D] border-white/[0.05] text-gray-400 hover:border-white/10'}
            `}
          >
            <method.icon className={`w-6 h-6 mb-2 ${selected === method.id ? 'text-[#10B981]' : 'text-gray-500'}`} />
            <span className="text-xs font-medium">{method.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

const ComplianceSection: React.FC<{
  isGroupPlan: boolean;
  remainingMembers: number;
  agreements: { agreed: boolean; privacy: boolean; group: boolean };
  onChange: (key: 'agreed' | 'privacy' | 'group', val: boolean) => void;
}> = ({ isGroupPlan, remainingMembers, agreements, onChange }) => (
  <section className="p-8 bg-[#0D0D0D] rounded-3xl border border-white/[0.05] space-y-5">
    <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
      <ShieldCheck className="w-5 h-5 text-emerald-500" />
      Legal & Privacy Agreements
    </h2>
    <label className="flex items-start gap-3 cursor-pointer group">
      <input 
        type="checkbox"
        checked={agreements.agreed}
        onChange={(e) => onChange('agreed', e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-white/10 bg-transparent text-[#10B981] focus:ring-[#10B981]"
      />
      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        I acknowledge that I can request a full refund within 7 days of purchase if I am not satisfied.
      </span>
    </label>
    {isGroupPlan && (
      <label className="flex items-start gap-3 cursor-pointer group animate-in fade-in slide-in-from-left-2">
        <input 
          type="checkbox"
          checked={agreements.group}
          onChange={(e) => onChange('group', e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-white/10 bg-transparent text-[#10B981] focus:ring-[#10B981]"
        />
        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
          I acknowledge that activation codes for the remaining {remainingMembers} members will be sent to my registered email address.
        </span>
      </label>
    )}
    <label className="flex items-start gap-3 cursor-pointer group">
      <input 
        type="checkbox"
        checked={agreements.privacy}
        onChange={(e) => onChange('privacy', e.target.checked)}
        className="mt-1 w-4 h-4 rounded border-white/10 bg-transparent text-[#10B981] focus:ring-[#10B981]"
      />
      <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
        I accept the Terms of Service and Privacy Policy of PLANTO.
      </span>
    </label>
  </section>
);

const BillingSummary: React.FC<{
  planTitle: string;
  cycle: string;
  basePrice: number;
  discount: number;
  tax: number;
  total: number;
  coupon: string;
  onCouponChange: (val: string) => void;
  onApplyCoupon: () => void;
}> = ({ planTitle, cycle, basePrice, discount, tax, total, coupon, onCouponChange, onApplyCoupon }) => (
  <div className="lg:sticky lg:top-12 self-start">
    <div className="p-8 bg-[#0D0D0D] border border-white/[0.05] rounded-3xl shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 blur-3xl rounded-full"></div>
      <h2 className="text-xl font-bold mb-8">Billing Summary</h2>
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/[0.05]">
        <div>
          <div className="text-sm font-semibold text-white">{planTitle}</div>
          <div className="text-xs text-gray-500 mt-1 capitalize">{cycle} billing</div>
        </div>
        <div className="text-lg font-bold">${formatCurrency(basePrice)}</div>
      </div>
      <div className="space-y-4 mb-8">
        <div className="flex justify-between text-sm text-gray-400">
          <span>Subtotal</span>
          <span>${formatCurrency(basePrice)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-emerald-400">
            <span>Discount (SAVE10)</span>
            <span>-${formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-400">
          <span>Tax (VAT 7%)</span>
          <span>${formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
          <span className="text-base font-bold">Total Payable</span>
          <span className="text-2xl font-black text-[#10B981]">${formatCurrency(total)}</span>
        </div>
      </div>
      <ZenField label="Discount Coupon" className="mt-10">
        <input 
          type="text"
          value={coupon}
          onChange={(e) => onCouponChange(e.target.value)}
          placeholder="Enter code (e.g. SAVE10)"
          className="flex-grow bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-gray-600 uppercase"
        />
        <button 
          onClick={onApplyCoupon}
          className="px-6 py-2 mr-1 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Apply
        </button>
      </ZenField>
      <p className="mt-6 text-[10px] text-gray-600 text-center leading-relaxed">
        By completing this purchase, you authorize PLANTO to charge your account. <br/>
        Transaction secured with end-to-end encryption.
      </p>
    </div>
  </div>
);

const CheckoutPage: React.FC<CheckoutPageProps> = ({ planId, cycle, onBack, onComplete }) => {
  const plan = ALL_PLANS.find(p => p.id === planId);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [agreements, setAgreements] = useState({ agreed: false, privacy: false, group: false });

  const basePrice = plan ? (cycle === 'monthly' ? plan.billing.monthlyPrice : plan.billing.yearlyPrice) : 0;
  const subtotal = basePrice - discount;
  const tax = calculateTax(subtotal);
  const total = subtotal + tax;

  const isGroupPlan = plan?.type === 'group';
  const remainingMembers = planId === 'plan-group-4' ? 3 : (planId === 'plan-group-8' ? 7 : 0);
  
  const isFormValid = paymentMethod !== '' && 
    agreements.agreed && 
    agreements.privacy && 
    (!isGroupPlan || agreements.group);

  const handleApplyCoupon = () => {
    const d = calculateDiscount(basePrice, coupon);
    if (d > 0) {
      setDiscount(d);
    } else {
      alert('Invalid or expired coupon');
    }
  };

  const handleAgreementChange = (key: keyof typeof agreements, val: boolean) => {
    setAgreements(prev => ({ ...prev, [key]: val }));
  };

  if (!plan) return <div className="p-20 text-white">Plan not found</div>;

  return (
    <div className="min-h-screen text-white py-12 px-6 sm:px-12 lg:px-20 page-container">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to Selection</span>
        </button>

        <h1 className="text-3xl font-bold mb-10 tracking-tight">Step 2: Checkout & Verification</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
            <ComplianceSection 
              isGroupPlan={isGroupPlan} 
              remainingMembers={remainingMembers} 
              agreements={agreements} 
              onChange={handleAgreementChange} 
            />
            <button
              disabled={!isFormValid}
              onClick={onComplete}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 shadow-xl
                ${isFormValid ? 'bg-[#10B981] hover:bg-[#059669] text-black hover:scale-[1.01] active:scale-[0.99]' : 'bg-white/5 text-gray-500 cursor-not-allowed'}
              `}
            >
              Complete Payment
            </button>
          </div>

          <BillingSummary 
            planTitle={plan.title}
            cycle={cycle}
            basePrice={basePrice}
            discount={discount}
            tax={tax}
            total={total}
            coupon={coupon}
            onCouponChange={setCoupon}
            onApplyCoupon={handleApplyCoupon}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
