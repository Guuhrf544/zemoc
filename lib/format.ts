import { useCallback } from 'react';

import { t } from '@/lib/i18n';
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

export const formatShortDate = (iso: string): string => {
  const { language } = useSettings.getState().settings;
  const locale = localeFor(language);
  const fmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
  });
  return fmt.format(new Date(iso));
};

export const formatLongMonth = (date: Date): string => {
  const { language } = useSettings.getState().settings;
  const locale = localeFor(language);
  const fmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' });
  return fmt.format(date);
};

export const formatBillingSchedule = (sub: Subscription): string => {
  const day = Math.max(1, Math.min(31, sub.billingDay));
  if (sub.billingPeriod === 'yearly') {
    const monthIdx = Math.max(0, Math.min(11, (sub.billingMonth ?? 1) - 1));
    const { language } = useSettings.getState().settings;
    const locale = localeFor(language);
    const fmt = new Intl.DateTimeFormat(locale, { month: 'short' });
    const month = fmt.format(new Date(2000, monthIdx, 1));
    return `${month} ${day}`;
  }
  return t('format.day', { day });
};

export const formatPeriodLabel = (period: Subscription['billingPeriod']): string =>
  period === 'yearly' ? t('review.perYearLabel') : t('review.perMonth');
