import type { CategoryTotal } from '@/components/category-bar-chart';
import { subscriptionsSplitForMonth } from '@/lib/billing';
import { expensesSplit } from '@/lib/store/expenses';
import { monthlyEquivalent, subscriptionsMonthlyTotal } from '@/lib/store/subscriptions';
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

  // Run rate is based on REALIZED spending only. Future-dated (planned) expenses
  // this month must not inflate the daily average — they are added on top.
  const { actual: actualExpenses, planned: plannedExpenses } = expensesSplit(
    expenses,
    monthIso,
    now
  );

  // Only subscriptions actually billed this month count toward this month's
  // spend (monthly ones + yearly ones whose renewal lands in this month),
  // matching the dashboard balance model — not 1/12 of every annual plan.
  const subs = subscriptionsSplitForMonth(subscriptions, now, now);
  const subscriptionsThisMonth = subs.actual + subs.planned;

  const dailyAverage = dayOfMonth > 0 ? actualExpenses / dayOfMonth : 0;
  const projectedExpenses = dailyAverage * daysInMonth + plannedExpenses;
  const projectedMonthEnd = projectedExpenses + subscriptionsThisMonth;
  const spentSoFar = actualExpenses + subs.actual;

  return {
    spentSoFar,
    projectedMonthEnd,
    dayOfMonth,
    daysInMonth,
    // Amortized monthly subscription cost — feeds the "subscriptions take
    // {amount} every month" tip, which is an average, not this month's cash flow.
    subscriptionsShare: subscriptionsMonthlyTotal(subscriptions),
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
