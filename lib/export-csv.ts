import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { Expense, Income, Subscription } from '@/types/models';

// RFC 4180: wrap in quotes if the value contains a quote, comma or newline.
const quote = (s: string): string =>
  /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;

// Machine-generated cell (type label, date, amount, enum) — RFC 4180 only.
const cell = (v: string | number): string => quote(String(v ?? ''));

// User-controlled free text. A leading =, +, -, @, tab or CR makes Excel /
// Sheets / Numbers treat the cell as a formula, so prefix it with a single
// quote to neutralize CSV/formula injection before applying RFC 4180 quoting.
const textCell = (v: string): string => {
  const s = String(v ?? '');
  const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return quote(safe);
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
      [
        cell('Income'),
        cell(i.date.slice(0, 10)),
        cell(i.category),
        textCell(i.source),
        cell(i.amount.toFixed(2)),
        cell(''),
      ].join(',')
    );
  }

  for (const e of expenses) {
    rows.push(
      [
        cell('Expense'),
        cell(e.date.slice(0, 10)),
        cell(e.category),
        textCell(e.description),
        cell(e.amount.toFixed(2)),
        cell(''),
      ].join(',')
    );
  }

  for (const s of subscriptions) {
    const schedule =
      s.billingPeriod === 'yearly'
        ? `yearly · month ${s.billingMonth ?? 1} day ${s.billingDay}`
        : `monthly · day ${s.billingDay}`;
    rows.push(
      [
        cell('Subscription'),
        cell(''),
        cell(s.category ?? ''),
        textCell(s.name),
        cell(s.amount.toFixed(2)),
        cell(schedule),
      ].join(',')
    );
  }

  return rows.join('\n');
};

export const exportCsv = async (
  incomes: Income[],
  expenses: Expense[],
  subscriptions: Subscription[]
): Promise<void> => {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing not available on this device');
  }

  const csv = buildCsv(incomes, expenses, subscriptions);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `zemoc-${stamp}.csv`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  try {
    await Sharing.shareAsync(uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Zemoc data',
      UTI: 'public.comma-separated-values-text',
    });
  } finally {
    // Don't leave the exported financial data sitting in the cache directory.
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
};
