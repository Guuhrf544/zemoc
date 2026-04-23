import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { Expense, Income, Subscription } from '@/types/models';

const escape = (v: string | number): string => {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export const buildCsv = (
  incomes: Income[],
  expenses: Expense[],
  subscriptions: Subscription[]
): string => {
  const rows: string[] = [];
  rows.push('Type,Date,Category,Description,Amount,Details');

  for (const i of incomes) {
    rows.push(
      ['Income', i.date.slice(0, 10), i.category, i.source, i.amount.toFixed(2), '']
        .map(escape)
        .join(',')
    );
  }

  for (const e of expenses) {
    rows.push(
      ['Expense', e.date.slice(0, 10), e.category, e.description, e.amount.toFixed(2), '']
        .map(escape)
        .join(',')
    );
  }

  for (const s of subscriptions) {
    const schedule =
      s.billingPeriod === 'yearly'
        ? `yearly · month ${s.billingMonth ?? 1} day ${s.billingDay}`
        : `monthly · day ${s.billingDay}`;
    rows.push(
      [
        'Subscription',
        '',
        s.category ?? '',
        s.name,
        s.amount.toFixed(2),
        schedule,
      ]
        .map(escape)
        .join(',')
    );
  }

  return rows.join('\n');
};

export const exportCsv = async (
  incomes: Income[],
  expenses: Expense[],
  subscriptions: Subscription[]
): Promise<void> => {
  const csv = buildCsv(incomes, expenses, subscriptions);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `zemoc-${stamp}.csv`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('Sharing not available on this device');
  }

  await Sharing.shareAsync(uri, {
    mimeType: 'text/csv',
    dialogTitle: 'Export Zemoc data',
    UTI: 'public.comma-separated-values-text',
  });
};
