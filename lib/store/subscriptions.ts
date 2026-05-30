import type { Subscription } from '@/types/models';

import { createCrudStore } from './create-crud-store';

export const useSubscriptions = createCrudStore<Subscription>({
  name: 'zemoc-subscriptions',
});

export const monthlyEquivalent = (s: Subscription): number =>
  s.billingPeriod === 'yearly' ? s.amount / 12 : s.amount;

export const subscriptionsMonthlyTotal = (items: Subscription[]) =>
  items.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
