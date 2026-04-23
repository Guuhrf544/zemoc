import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import {
  ALL_CATEGORIES,
  ALL_INCOME_CATEGORIES,
  type Expense,
  type Income,
  type Subscription,
} from '@/types/models';

import { useExpenses } from './store/expenses';
import { useIncomes } from './store/incomes';
import { useProfile, type Profile } from './store/profile';
import { useSettings, type Settings } from './store/settings';
import { useSubscriptions } from './store/subscriptions';

const SUPPORTED_VERSIONS = [1, 2] as const;
type BackupVersion = (typeof SUPPORTED_VERSIONS)[number];

interface BackupV2 {
  version: 2;
  createdAt: string;
  incomes: Income[];
  expenses: Expense[];
  subscriptions: Subscription[];
  profile: Profile;
  settings: Settings;
}

const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number =>
  typeof v === 'number' && Number.isFinite(v);
const isOptStr = (v: unknown): v is string | undefined =>
  v === undefined || typeof v === 'string';
const isOptNum = (v: unknown): v is number | undefined =>
  v === undefined || (typeof v === 'number' && Number.isFinite(v));

function validExpense(x: unknown): x is Expense {
  if (!x || typeof x !== 'object') return false;
  const o = x as Partial<Expense>;
  return (
    isStr(o.id) &&
    isStr(o.description) &&
    isNum(o.amount) &&
    isStr(o.date) &&
    isStr(o.category) &&
    ALL_CATEGORIES.includes(o.category as never) &&
    isStr(o.createdAt)
  );
}

function validIncome(x: unknown): x is Income {
  if (!x || typeof x !== 'object') return false;
  const o = x as Partial<Income>;
  return (
    isStr(o.id) &&
    isStr(o.source) &&
    isNum(o.amount) &&
    isStr(o.date) &&
    isStr(o.category) &&
    ALL_INCOME_CATEGORIES.includes(o.category as never) &&
    isStr(o.createdAt)
  );
}

function sanitizeProfile(x: unknown): Profile | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Partial<Profile>;
  if (!isStr(o.name) || !isStr(o.email)) return null;
  return {
    name: o.name,
    email: o.email,
    phone: isStr(o.phone) ? o.phone : undefined,
    photoUri: isStr(o.photoUri) ? o.photoUri : undefined,
  };
}

function sanitizeSettings(x: unknown): Settings | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Partial<Settings>;
  if (o.language !== 'en' && o.language !== 'pt') return null;
  if (o.currency !== 'EUR' && o.currency !== 'BRL' && o.currency !== 'USD') return null;
  if (o.appearance !== 'light' && o.appearance !== 'dark' && o.appearance !== 'auto') return null;
  if (typeof o.notifications !== 'boolean') return null;
  if (typeof o.securityPin !== 'boolean') return null;
  if (typeof o.securityBiometric !== 'boolean') return null;
  return {
    language: o.language,
    currency: o.currency,
    appearance: o.appearance,
    notifications: o.notifications,
    securityPin: o.securityPin,
    securityBiometric: o.securityBiometric,
  };
}

function validSubscription(x: unknown): x is Subscription {
  if (!x || typeof x !== 'object') return false;
  const o = x as Partial<Subscription>;
  return (
    isStr(o.id) &&
    isStr(o.name) &&
    isNum(o.amount) &&
    (o.billingPeriod === 'monthly' || o.billingPeriod === 'yearly') &&
    isNum(o.billingDay) &&
    isOptNum(o.billingMonth) &&
    (o.category === undefined ||
      (isStr(o.category) && ALL_CATEGORIES.includes(o.category as never))) &&
    isOptStr(o.notes) &&
    isStr(o.createdAt) &&
    isOptStr(o.lastUsedAt)
  );
}

export const exportBackup = async (): Promise<void> => {
  const backup: BackupV2 = {
    version: 2,
    createdAt: new Date().toISOString(),
    incomes: useIncomes.getState().items,
    expenses: useExpenses.getState().items,
    subscriptions: useSubscriptions.getState().items,
    profile: useProfile.getState().profile,
    settings: useSettings.getState().settings,
  };

  const json = JSON.stringify(backup, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `zemoc-backup-${stamp}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing not available on this device');
  }

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

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('File is not valid JSON');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Malformed backup');
  }
  const b = parsed as Partial<BackupV2>;

  if (
    typeof b.version !== 'number' ||
    !SUPPORTED_VERSIONS.includes(b.version as BackupVersion)
  ) {
    throw new Error('Unsupported backup version');
  }

  if (
    !Array.isArray(b.incomes) ||
    !Array.isArray(b.expenses) ||
    !Array.isArray(b.subscriptions)
  ) {
    throw new Error('Malformed backup');
  }

  const expenses = b.expenses.filter(validExpense);
  const incomes = b.incomes.filter(validIncome);
  const subscriptions = b.subscriptions.filter(validSubscription);

  const rejected =
    b.expenses.length - expenses.length +
    (b.incomes.length - incomes.length) +
    (b.subscriptions.length - subscriptions.length);

  if (rejected > 0) {
    throw new Error(`Backup has ${rejected} invalid record(s)`);
  }

  let profileSafe: Profile | null = null;
  let settingsSafe: Settings | null = null;
  if (b.version >= 2) {
    if (b.profile !== undefined) {
      profileSafe = sanitizeProfile(b.profile);
      if (!profileSafe) throw new Error('Malformed backup (profile)');
    }
    if (b.settings !== undefined) {
      settingsSafe = sanitizeSettings(b.settings);
      if (!settingsSafe) throw new Error('Malformed backup (settings)');
    }
  }

  useIncomes.setState({ items: incomes });
  useExpenses.setState({ items: expenses });
  useSubscriptions.setState({ items: subscriptions });
  if (profileSafe) useProfile.setState({ profile: profileSafe });
  if (settingsSafe) useSettings.setState({ settings: settingsSafe });

  return true;
};
