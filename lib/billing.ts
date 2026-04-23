import type { Subscription } from '@/types/models';

export const nextBillingDate = (sub: Subscription, now: Date = new Date()): Date => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = Math.max(1, Math.min(31, sub.billingDay));

  if (sub.billingPeriod === 'yearly') {
    const billingMonthIdx = Math.max(1, Math.min(12, sub.billingMonth ?? 1)) - 1;
    const thisYear = new Date(year, billingMonthIdx, day, 12, 0, 0, 0);
    if (thisYear.getTime() >= now.getTime() - 24 * 60 * 60 * 1000) return thisYear;
    return new Date(year + 1, billingMonthIdx, day, 12, 0, 0, 0);
  }

  const thisMonth = new Date(year, month, day, 12, 0, 0, 0);
  if (thisMonth.getTime() >= now.getTime() - 24 * 60 * 60 * 1000) return thisMonth;
  return new Date(year, month + 1, day, 12, 0, 0, 0);
};

export interface UpcomingCharge {
  subscription: Subscription;
  date: Date;
  daysUntil: number;
}

export const upcomingCharges = (
  subs: Subscription[],
  now: Date = new Date(),
  limit = 5
): UpcomingCharge[] => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return subs
    .map((s) => {
      const date = nextBillingDate(s, now);
      const daysUntil = Math.round((date.getTime() - startOfToday.getTime()) / msPerDay);
      return { subscription: s, date, daysUntil };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, limit);
};

const isBilledInMonth = (sub: Subscription, monthDate: Date): boolean => {
  if (sub.billingPeriod === 'monthly') return true;
  return (sub.billingMonth ?? 1) === monthDate.getMonth() + 1;
};

export const subscriptionsSplitForMonth = (
  subs: Subscription[],
  monthDate: Date,
  now: Date = new Date()
): { actual: number; planned: number } => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const firstDay = new Date(year, month, 1);

  let cutoff: Date;
  if (lastDay.getTime() < now.getTime()) cutoff = lastDay;
  else if (firstDay.getTime() > now.getTime()) cutoff = new Date(year, month, 0);
  else cutoff = now;

  let actual = 0;
  let planned = 0;
  for (const s of subs) {
    if (!isBilledInMonth(s, monthDate)) continue;
    const billingDate = new Date(
      year,
      month,
      Math.max(1, Math.min(28, s.billingDay)),
      12, 0, 0, 0
    );
    if (billingDate.getTime() <= cutoff.getTime()) actual += s.amount;
    else planned += s.amount;
  }
  return { actual, planned };
};
