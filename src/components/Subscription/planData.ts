import type { SubscriptionPlan } from '../../types';

export const STATIC_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    title: 'Basic Plan',
    description: 'Perfect for beginners',
    features: ['Sync notes across devices', 'End-to-end encryption', 'Version history (30 days)'],
    billing: { monthlyPrice: 4, yearlyPrice: 40, currency: 'USD' },
    type: 'standard',
    rank: 1
  },
  {
    id: 'plan-pro',
    title: 'Pro Plan',
    description: 'Our most popular plan',
    features: ['Everything in Basic', 'Collaborate on shared vaults', 'Priority support', 'Graph and full text search'],
    billing: { monthlyPrice: 8, yearlyPrice: 80, currency: 'USD' },
    type: 'standard',
    rank: 2,
    isFeatured: true
  },
  {
    id: 'plan-business',
    title: 'Business Plan',
    description: 'For power users and teams',
    features: ['Everything in Pro', 'Customizable theme', 'Technical consulting', 'Unlimited version history'],
    billing: { monthlyPrice: 12, yearlyPrice: 120, currency: 'USD' },
    type: 'standard',
    rank: 3
  }
];

export const GROUP_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-group-4',
    title: 'Friends Pack (4 Users)',
    description: 'Perfect for small groups of friends',
    features: ['Full <u>Pro Plan</u> ($8) features for all 4 members', 'Centralized billing', 'Shared vault management'],
    billing: { monthlyPrice: 24, yearlyPrice: 240, currency: 'USD' },
    type: 'group',
    rank: 4
  },
  {
    id: 'plan-group-8',
    title: 'Family Pack (8 Users)',
    description: 'Perfect for large families or teams',
    features: ['Full <u>Pro Plan</u> ($8) features for all 8 members', 'Priority support for all members', 'Advanced admin controls'],
    billing: { monthlyPrice: 40, yearlyPrice: 400, currency: 'USD' },
    type: 'group',
    rank: 5
  }
];

export const VIP_PLAN: SubscriptionPlan = {
  id: 'plan-vip',
  title: '🚀 VIP Alpha Plan',
  description: 'Exclusive access for Alpha testers',
  features: ['Lifetime priority access', 'Early bird features', 'Personal concierge', 'Custom domain support', 'Private Discord channel'],
  billing: { monthlyPrice: 99, yearlyPrice: 990, currency: 'USD' },
  type: 'vip',
  rank: 6,
  isFeatured: true
};

export const ALL_PLANS = [...STATIC_PLANS, ...GROUP_PLANS, VIP_PLAN];
