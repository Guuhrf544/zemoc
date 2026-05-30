import type { Expense } from '@/types/models';

import { createCrudStore } from './create-crud-store';

export const useExpenses = createCrudStore<Expense>({ name: 'zemoc-expenses' });

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
