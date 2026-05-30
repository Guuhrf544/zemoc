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

export const SUPPORTED_VERSIONS = [1, 2] as const;
export type BackupVersion = (typeof SUPPORTED_VERSIONS)[number];

export interface BackupV2 {
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

export function validExpense(x: unknown): x is Expense {
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

export function validIncome(x: unknown): x is Income {
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

export function sanitizeProfile(x: unknown): Profile | null {
  if (!x || typeof x !== 'object') return null;
  const o = x as Partial<Profile> & { email?: unknown; phone?: unknown };
  if (!isStr(o.name)) return null;
  return {
    name: o.name,
    photoUri: isStr(o.photoUri) ? o.photoUri : undefined,
  };
}

export function sanitizeSettings(x: unknown): Settings | null {
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
    cloudSync: typeof o.cloudSync === 'boolean' ? o.cloudSync : false,
    lastCloudSyncAt: isStr(o.lastCloudSyncAt) ? o.lastCloudSyncAt : null,
    lastSyncedRemoteAt: typeof o.lastSyncedRemoteAt === 'number' ? o.lastSyncedRemoteAt : null,
  };
}

export function validSubscription(x: unknown): x is Subscription {
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

export const buildBackupPayload = (): BackupV2 => ({
  version: 2,
  createdAt: new Date().toISOString(),
  incomes: useIncomes.getState().items,
  expenses: useExpenses.getState().items,
  subscriptions: useSubscriptions.getState().items,
  profile: useProfile.getState().profile,
  settings: useSettings.getState().settings,
});

export interface ParsedBackup {
  expenses: Expense[];
  incomes: Income[];
  subscriptions: Subscription[];
  profile: Profile | null;
  settings: Settings | null;
  createdAt: string | null;
}

export function parseBackupPayload(parsed: unknown): ParsedBackup {
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

  return {
    expenses,
    incomes,
    subscriptions,
    profile: profileSafe,
    settings: settingsSafe,
    createdAt: isStr(b.createdAt) ? b.createdAt : null,
  };
}

export const applyBackupPayload = (parsed: ParsedBackup): void => {
  useIncomes.setState({ items: parsed.incomes });
  useExpenses.setState({ items: parsed.expenses });
  useSubscriptions.setState({ items: parsed.subscriptions });
  if (parsed.profile) useProfile.setState({ profile: parsed.profile });
  if (parsed.settings) {
    // Preserve local-only fields — these belong to THIS device and must never
    // come from a backup/sync payload:
    //  - cloudSync / lastCloudSyncAt: per-device sync state.
    //  - securityPin / securityBiometric: the PIN lives in this device's
    //    Keychain. Importing securityPin=true with no PIN stored here would lock
    //    the user out (verifyPin returns 'no-pin' for any input); importing
    //    false could silently drop the lock screen. Keep what the device has.
    const local = useSettings.getState().settings;
    useSettings.setState({
      settings: {
        ...parsed.settings,
        cloudSync: local.cloudSync,
        lastCloudSyncAt: local.lastCloudSyncAt,
        lastSyncedRemoteAt: local.lastSyncedRemoteAt,
        securityPin: local.securityPin,
        securityBiometric: local.securityBiometric,
      },
    });
  }
};

export const exportBackup = async (): Promise<void> => {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error('Sharing not available on this device');
  }

  const backup = buildBackupPayload();
  const json = JSON.stringify(backup, null, 2);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `zemoc-backup-${stamp}.json`;
  const uri = `${FileSystem.cacheDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(uri, json, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  try {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/json',
      dialogTitle: 'Zemoc backup',
      UTI: 'public.json',
    });
  } finally {
    // Don't leave the full plaintext backup sitting in the cache directory.
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
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

  const data = parseBackupPayload(parsed);
  applyBackupPayload(data);
  return true;
};
