import {
  applyBackupPayload,
  type BackupV2,
  buildBackupPayload,
  parseBackupPayload,
} from './backup';
import { downloadBackup, isICloudAvailable, uploadBackup } from './icloud';
import { useExpenses } from './store/expenses';
import { useIncomes } from './store/incomes';
import { useProfile } from './store/profile';
import { useSettings } from './store/settings';
import { useSubscriptions } from './store/subscriptions';

export interface CloudPayload extends BackupV2 {
  updatedAt: string;
}

const UPLOAD_DEBOUNCE_MS = 5000;
const REMOTE_NEWER_TOLERANCE_MS = 1000;
const APPLY_GUARD_MS = 200;

let uploadTimer: ReturnType<typeof setTimeout> | null = null;
let storeUnsubscribers: Array<() => void> = [];
let isApplyingRemote = false;

const buildCloudPayload = (): CloudPayload => ({
  ...buildBackupPayload(),
  updatedAt: new Date().toISOString(),
});

const isCloudSyncEnabled = (): boolean =>
  useSettings.getState().settings.cloudSync;

const applyRemote = (payload: CloudPayload): void => {
  const parsed = parseBackupPayload(payload);
  isApplyingRemote = true;
  try {
    applyBackupPayload(parsed);
    useSettings.getState().update({
      lastCloudSyncAt:
        typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
    });
  } finally {
    setTimeout(() => {
      isApplyingRemote = false;
    }, APPLY_GUARD_MS);
  }
};

const pushCurrentToCloud = async (): Promise<string> => {
  const payload = buildCloudPayload();
  await uploadBackup(payload);
  useSettings.getState().update({ lastCloudSyncAt: payload.updatedAt });
  return payload.updatedAt;
};

export const peekRemote = async (): Promise<CloudPayload | null> => {
  if (!(await isICloudAvailable())) return null;
  return (await downloadBackup<CloudPayload>()) ?? null;
};

export const syncUpNow = async (): Promise<boolean> => {
  if (!isCloudSyncEnabled()) return false;
  if (!(await isICloudAvailable())) return false;
  await pushCurrentToCloud();
  return true;
};

export const syncDownNow = async (): Promise<boolean> => {
  if (!isCloudSyncEnabled()) return false;
  if (!(await isICloudAvailable())) return false;
  const payload = await downloadBackup<CloudPayload>();
  if (!payload) return false;
  applyRemote(payload);
  return true;
};

export type LaunchSyncResult = 'pulled' | 'pushed' | 'noop' | 'unavailable';

export const decideOnLaunch = async (): Promise<LaunchSyncResult> => {
  if (!isCloudSyncEnabled()) return 'noop';
  if (!(await isICloudAvailable())) return 'unavailable';

  const payload = await downloadBackup<CloudPayload>();
  if (!payload) {
    await pushCurrentToCloud();
    return 'pushed';
  }

  const localTs = useSettings.getState().settings.lastCloudSyncAt;
  const remoteTs = typeof payload.updatedAt === 'string' ? payload.updatedAt : null;

  const remoteIsNewer = (() => {
    if (!remoteTs) return false;
    if (!localTs) return true;
    return new Date(remoteTs).getTime() > new Date(localTs).getTime() + REMOTE_NEWER_TOLERANCE_MS;
  })();

  if (remoteIsNewer) {
    applyRemote(payload);
    return 'pulled';
  }
  return 'noop';
};

export interface EnableArgs {
  direction: 'push' | 'pull';
  remote?: CloudPayload | null;
}

export const enableCloudSync = async ({ direction, remote }: EnableArgs): Promise<void> => {
  if (!(await isICloudAvailable())) throw new Error('iCloud unavailable');

  if (direction === 'push') {
    await pushCurrentToCloud();
    useSettings.getState().update({ cloudSync: true });
    return;
  }

  const r = remote ?? (await downloadBackup<CloudPayload>());
  if (!r) {
    await pushCurrentToCloud();
    useSettings.getState().update({ cloudSync: true });
    return;
  }
  applyRemote(r);
  useSettings.getState().update({ cloudSync: true });
};

const onStoreChange = (): void => {
  if (isApplyingRemote) return;
  if (!isCloudSyncEnabled()) return;
  if (uploadTimer) clearTimeout(uploadTimer);
  uploadTimer = setTimeout(() => {
    uploadTimer = null;
    syncUpNow().catch((err) => {
      console.warn('iCloud upload failed', err);
    });
  }, UPLOAD_DEBOUNCE_MS);
};

export const startCloudSync = (): void => {
  stopCloudSync();
  storeUnsubscribers = [
    useExpenses.subscribe(onStoreChange),
    useIncomes.subscribe(onStoreChange),
    useSubscriptions.subscribe(onStoreChange),
    useProfile.subscribe(onStoreChange),
  ];
};

export const stopCloudSync = (): void => {
  if (uploadTimer) {
    clearTimeout(uploadTimer);
    uploadTimer = null;
  }
  storeUnsubscribers.forEach((fn) => fn());
  storeUnsubscribers = [];
};
