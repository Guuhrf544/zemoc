import type { Income } from '@/types/models';

import { createCrudStore } from './create-crud-store';

export const useIncomes = createCrudStore<Income>({
  name: 'zemoc-incomes',
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
});

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
