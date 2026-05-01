import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  onFinish: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onFinish }) => {
  React.useEffect(() => {
    // Lock body scroll from top level when success page is mounted
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed top-[var(--header-height)] inset-x-0 bottom-0 flex items-center justify-center p-6 page-container overflow-hidden z-[50]">
      <div className="max-w-md w-full text-center">
        
        {/* Success Icon with Animation */}
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-[var(--neon-emerald)] blur-2xl opacity-20 animate-pulse"></div>
          <CheckCircle className="w-24 h-24 text-[var(--neon-emerald)] relative animate-in zoom-in-50 duration-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-[var(--text-secondary)] mb-10 leading-relaxed">
          Welcome to the next level of asset tracking. Your subscription is now active and your account features have been upgraded.
        </p>

        <div className="space-y-4">
          <button
            onClick={onFinish}
            className="w-full py-4 px-6 bg-[var(--neon-emerald)] hover:bg-[#059669] text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[var(--neon-emerald)]/10"
          >
            Go to My Profile
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <p className="text-xs text-[var(--text-secondary)]/60 font-medium tracking-wide uppercase">
            A confirmation receipt has been sent to your email
          </p>
        </div>

        {/* Decorative background details */}
        <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[var(--neon-emerald)]/5 blur-[120px] rounded-full -z-10"></div>
        <div className="fixed bottom-1/4 -right-20 w-64 h-64 bg-[var(--neon-emerald)]/5 blur-[120px] rounded-full -z-10"></div>
      </div>
    </div>
  );
};

export default SuccessPage;
