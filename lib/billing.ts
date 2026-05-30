import type { Subscription } from '@/types/models';

const daysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

// Builds a date at local noon, clamping the day to the last valid day of the
// target month. This prevents billingDay 29-31 from overflowing into the next
// month (e.g. day 31 in February would otherwise roll over to March 2/3).
const billingDateAtNoon = (year: number, month: number, day: number): Date => {
  const clampedDay = Math.max(1, Math.min(daysInMonth(year, month), day));
  return new Date(year, month, clampedDay, 12, 0, 0, 0);
};

export const nextBillingDate = (sub: Subscription, now: Date = new Date()): Date => {
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = sub.billingDay;

  if (sub.billingPeriod === 'yearly') {
    const billingMonthIdx = Math.max(1, Math.min(12, sub.billingMonth ?? 1)) - 1;
    const thisYear = billingDateAtNoon(year, billingMonthIdx, day);
    if (thisYear.getTime() >= now.getTime() - 24 * 60 * 60 * 1000) return thisYear;
    return billingDateAtNoon(year + 1, billingMonthIdx, day);
  }

  const thisMonth = billingDateAtNoon(year, month, day);
  if (thisMonth.getTime() >= now.getTime() - 24 * 60 * 60 * 1000) return thisMonth;
  return billingDateAtNoon(year, month + 1, day);
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
  const noonToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);

  return subs
    .map((s) => {
      const date = nextBillingDate(s, now);
      const daysUntil = Math.round((date.getTime() - noonToday.getTime()) / msPerDay);
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
  const lastDay = new Date(year, month, daysInMonth(year, month), 12, 0, 0, 0);
  const firstDay = new Date(year, month, 1, 12, 0, 0, 0);

  let cutoff: Date;
  if (lastDay.getTime() < now.getTime()) cutoff = lastDay;
  else if (firstDay.getTime() > now.getTime()) cutoff = new Date(year, month, 0, 12, 0, 0, 0);
  else cutoff = now;

  let actual = 0;
  let planned = 0;
  for (const s of subs) {
    if (!isBilledInMonth(s, monthDate)) continue;
    const billingDate = billingDateAtNoon(year, month, s.billingDay);
    if (billingDate.getTime() <= cutoff.getTime()) actual += s.amount;
    else planned += s.amount;
  }
  return { actual, planned };
};
