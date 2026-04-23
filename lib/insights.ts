import type { CategoryTotal } from '@/components/category-bar-chart';
import { monthlyEquivalent } from '@/lib/store/subscriptions';
import { sumByMonth } from '@/lib/store/expenses';
import type { Category, Expense, Subscription } from '@/types/models';

export interface Forecast {
  spentSoFar: number;
  projectedMonthEnd: number;
  dayOfMonth: number;
  daysInMonth: number;
  subscriptionsShare: number;
}

export const endOfMonthForecast = (
  expenses: Expense[],
  subscriptions: Subscription[],
  now: Date = new Date()
): Forecast => {
  const monthIso = now.toISOString();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const expensesSoFar = sumByMonth(expenses, monthIso);
  const subscriptionsMonthly = subscriptions.reduce(
    (sum, s) => sum + monthlyEquivalent(s),
    0
  );

  const dailyAverage = dayOfMonth > 0 ? expensesSoFar / dayOfMonth : 0;
  const projectedExpenses = dailyAverage * daysInMonth;
  const projectedMonthEnd = projectedExpenses + subscriptionsMonthly;
  const spentSoFar = expensesSoFar + subscriptionsMonthly;

  return {
    spentSoFar,
    projectedMonthEnd,
    dayOfMonth,
    daysInMonth,
    subscriptionsShare: subscriptionsMonthly,
  };
};

export const topSpendingCategories = (
  expenses: Expense[],
  monthIso: string,
  limit = 3
): CategoryTotal[] => {
  const month = monthIso.slice(0, 7);
  const map = new Map<Category, number>();
  expenses
    .filter((e) => e.date.slice(0, 7) === month)
    .forEach((e) => {
      map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
    });
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
};

export interface ReviewItem {
  subscription: Subscription;
  monthlyCost: number;
}

export const subscriptionsToReview = (
  subscriptions: Subscription[],
  limit = 3
): ReviewItem[] =>
  subscriptions
    .map((s) => ({ subscription: s, monthlyCost: monthlyEquivalent(s) }))
    .sort((a, b) => b.monthlyCost - a.monthlyCost)
    .slice(0, limit);

export const potentialSavings = (reviews: ReviewItem[]): number =>
  reviews.reduce((sum, r) => sum + r.monthlyCost, 0);
