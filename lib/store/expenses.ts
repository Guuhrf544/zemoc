import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Expense } from '@/types/models';

interface State {
  items: Expense[];
  add: (e: Omit<Expense, 'id' | 'createdAt'>) => void;
  update: (id: string, patch: Partial<Expense>) => void;
  remove: (id: string) => void;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const useExpenses = create<State>()(
  persist(
    (set) => ({
      items: [],
      add: (e) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...e, id: newId(), createdAt: new Date().toISOString() },
          ],
        })),
      update: (id, patch) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
    }),
    {
      name: 'zemoc-expenses',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const sumByMonth = (items: Expense[], monthIso: string): number => {
  const month = monthIso.slice(0, 7);
  return items
    .filter((e) => e.date.slice(0, 7) === month)
    .reduce((sum, e) => sum + e.amount, 0);
};

export const expensesForMonth = (items: Expense[], monthIso: string): Expense[] => {
  const month = monthIso.slice(0, 7);
  return items.filter((e) => e.date.slice(0, 7) === month);
};

export const expensesSplit = (
  items: Expense[],
  monthIso: string,
  now: Date = new Date()
): { actual: number; planned: number } => {
  const monthItems = expensesForMonth(items, monthIso);
  let actual = 0;
  let planned = 0;
  const nowTs = now.getTime();
  for (const e of monthItems) {
    if (new Date(e.date).getTime() <= nowTs) actual += e.amount;
    else planned += e.amount;
  }
  return { actual, planned };
};

export const isPlanned = (expense: Expense, now: Date = new Date()): boolean =>
  new Date(expense.date).getTime() > now.getTime();
