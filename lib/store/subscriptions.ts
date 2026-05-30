import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Subscription } from '@/types/models';

import { isValidAmount, sanitizePatch } from './validate';

interface State {
  items: Subscription[];
  add: (s: Omit<Subscription, 'id' | 'createdAt'>) => void;
  update: (id: string, patch: Partial<Subscription>) => void;
  remove: (id: string) => void;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useSubscriptions = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (s) =>
        set((state) =>
          isValidAmount(s.amount)
            ? {
                items: [
                  ...state.items,
                  { ...s, id: newId(), createdAt: new Date().toISOString() },
                ],
              }
            : state
        ),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, ...sanitizePatch<Subscription>(patch) } : i
          ),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    {
      name: 'zemoc-subscriptions',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const monthlyEquivalent = (s: Subscription): number =>
  s.billingPeriod === 'yearly' ? s.amount / 12 : s.amount;

export const subscriptionsMonthlyTotal = (items: Subscription[]) =>
  items.reduce((sum, s) => sum + monthlyEquivalent(s), 0);
