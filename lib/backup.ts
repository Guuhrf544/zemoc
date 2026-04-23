import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import type { Expense, Income, Subscription } from '@/types/models';

import { useExpenses } from './store/expenses';
import { useIncomes } from './store/incomes';
import { useSubscriptions } from './store/subscriptions';

interface Backup {
  version: 1;
  createdAt: string;
  incomes: Income[];
  expenses: Expense[];
  subscriptions: Subscription[];
}

export const exportBackup = async (): Promise<void> => {
  const backup: Backup = {
    version: 1,
    createdAt: new Date().toISOString(),
    incomes: useIncomes.getState().items,
    expenses: useExpenses.getState().items,
    subscriptions: useSubscriptions.getState().items,
  };

  const json = JSON.stringify(backup, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `zemoc-backup-${stamp}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const available = await Sharing.isAvailableAsync();
  if (!available) throw new Error('Sharing not available on this device');

  await Sharing.shareAsync(uri, {
    mimeType: 'application/json',
    dialogTitle: 'Zemoc backup',
    UTI: 'public.json',
  });
};

export const importBackup = async (): Promise<boolean> => {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (result.canceled) return false;

  const asset = result.assets?.[0];
  if (!asset) throw new Error('No file selected');

  const content = await FileSystem.readAsStringAsync(asset.uri, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  const parsed = JSON.parse(content) as Partial<Backup>;
  if (
    typeof parsed.version !== 'number' ||
    !Array.isArray(parsed.incomes) ||
    !Array.isArray(parsed.expenses) ||
    !Array.isArray(parsed.subscriptions)
  ) {
    throw new Error('Invalid backup file');
  }

  useIncomes.setState({ items: parsed.incomes as Income[] });
  useExpenses.setState({ items: parsed.expenses as Expense[] });
  useSubscriptions.setState({ items: parsed.subscriptions as Subscription[] });

  return true;
};
