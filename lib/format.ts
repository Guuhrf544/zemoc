import { useCallback } from 'react';

import { useT } from '@/lib/i18n';
import { localeFor, useSettings, type Language } from '@/lib/store/settings';
import type { Subscription } from '@/types/models';

const formatWith = (
  value: number,
  currency: string,
  language: Language
): string => {
  const locale = localeFor(language);
  const fmt = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  return fmt.format(Number.isFinite(value) ? value : 0);
};

export const formatMoney = (value: number): string => {
  const { currency, language } = useSettings.getState().settings;
  return formatWith(value, currency, language);
};

export function useMoney(): (value: number) => string {
  const currency = useSettings((s) => s.settings.currency);
  const language = useSettings((s) => s.settings.language);
  return useCallback(
    (value: number) => formatWith(value, currency, language),
    [currency, language]
  );
}

export const parseMoneyInput = (raw: string): number => {
  if (!raw) return 0;
  const stripped = raw.replace(/[^\d.,-]/g, '').trim();
  if (!stripped) return 0;

  const lastDot = stripped.lastIndexOf('.');
  const lastComma = stripped.lastIndexOf(',');

  let normalized = stripped;
  if (lastDot >= 0 || lastComma >= 0) {
    const decimalSep = lastDot > lastComma ? '.' : ',';
    const thousandsSep = decimalSep === '.' ? ',' : '.';
    normalized = stripped.split(thousandsSep).join('').replace(decimalSep, '.');
  }

  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
};

const shortDateIn = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(new Date(iso));

const dateTimeIn = (iso: string, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

const longMonthIn = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date);

export interface DateFormatters {
  shortDate: (iso: string) => string;
  dateTime: (iso: string) => string;
  longMonth: (date: Date) => string;
  billingSchedule: (sub: Subscription) => string;
  periodLabel: (period: Subscription['billingPeriod']) => string;
}

// Reactive date/label formatters — they re-render with the active language, the
// same way useMoney() reacts to currency. Use these in render instead of reading
// settings via getState() (which wouldn't refresh on a language change).
export function useDateFormat(): DateFormatters {
  const language = useSettings((s) => s.settings.language);
  const t = useT();
  const locale = localeFor(language);
  return {
    shortDate: (iso) => shortDateIn(iso, locale),
    dateTime: (iso) => dateTimeIn(iso, locale),
    longMonth: (date) => longMonthIn(date, locale),
    billingSchedule: (sub) => {
      const day = Math.max(1, Math.min(31, sub.billingDay));
      if (sub.billingPeriod === 'yearly') {
        const monthIdx = Math.max(0, Math.min(11, (sub.billingMonth ?? 1) - 1));
        const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(
          new Date(2000, monthIdx, 1)
        );
        return `${month} ${day}`;
      }
      return t('format.day', { day });
    },
    periodLabel: (period) =>
      period === 'yearly' ? t('review.perYearLabel') : t('review.perMonth'),
  };
}
