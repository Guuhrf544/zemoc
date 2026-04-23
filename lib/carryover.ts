import type { Expense, Income, Subscription } from '@/types/models';

import { subscriptionsSplitForMonth } from './billing';
import { expensesSplit } from './store/expenses';
import { incomeForMonth } from './store/incomes';

export function cumulativeCarryover(
  monthDate: Date,
  incomes: Income[],
  expenses: Expense[],
  subscriptions: Subscription[]
): number {
  const months: string[] = [];
  for (const i of incomes) months.push(i.date.slice(0, 7));
  for (const e of expenses) months.push(e.date.slice(0, 7));
  for (const s of subscriptions) months.push(s.createdAt.slice(0, 7));
  if (months.length === 0) return 0;
  const earliest = months.reduce((min, m) => (m < min ? m : min));

  const [startYear, startMonthOneBased] = earliest.split('-').map(Number);
  const targetYear = monthDate.getFullYear();
  const targetMonth = monthDate.getMonth();

  let total = 0;
  let year = startYear;
  let month = startMonthOneBased - 1;

  while (year < targetYear || (year === targetYear && month < targetMonth)) {
    const d = new Date(year, month, 1, 12, 0, 0, 0);
    const iso = d.toISOString();
    const income = incomeForMonth(incomes, iso);
    const exp = expensesSplit(expenses, iso);
    const subs = subscriptionsSplitForMonth(subscriptions, d);
    total += income - (exp.actual + exp.planned) - (subs.actual + subs.planned);

    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }

  return total;
}
