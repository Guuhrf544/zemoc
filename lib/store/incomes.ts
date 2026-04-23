import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Income } from '@/types/models';

interface State {
  items: Income[];
  add: (i: Omit<Income, 'id' | 'createdAt'>) => void;
  update: (id: string, patch: Partial<Income>) => void;
  remove: (id: string) => void;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useIncomes = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (i) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...i, id: newId(), createdAt: new Date().toISOString() },
          ],
        })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
    }),
    {
      name: 'zemoc-incomes',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
      migrate: (persisted: any, version: number) => {
        if (version < 3 && Array.isArray(persisted?.items)) {
          persisted.items = persisted.items.map((i: Record<string, unknown>) => ({
            ...i,
            category: i.category ?? 'Other',
          }));
        }
        if (version < 4 && Array.isArray(persisted?.items)) {
          persisted.items = persisted.items.map((i: Record<string, unknown>) => {
            const { frequency: _f, recurring: _r, ...rest } = i;
            return rest;
          });
        }
        return persisted;
      },
    }
  )
);

export const incomeForMonth = (items: Income[], monthIso: string): number => {
  const month = monthIso.slice(0, 7);
  return items
    .filter((i) => i.date.slice(0, 7) === month)
    .reduce((sum, i) => sum + i.amount, 0);
};

export const incomesForMonthList = (items: Income[], monthIso: string): Income[] => {
  const month = monthIso.slice(0, 7);
  return items.filter((i) => i.date.slice(0, 7) === month);
};
