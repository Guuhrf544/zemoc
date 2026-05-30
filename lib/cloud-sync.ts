import {
  applyBackupPayload,
  type BackupV2,
  buildBackupPayload,
  parseBackupPayload,
} from './backup';
import { downloadBackup, getRemoteModifiedAt, isICloudAvailable, uploadBackup } from './icloud';
import { useExpenses } from './store/expenses';
import { useIncomes } from './store/incomes';
import { useProfile } from './store/profile';
import { useSettings } from './store/settings';
import { useSubscriptions } from './store/subscriptions';

export interface CloudPayload extends BackupV2 {
  updatedAt: string;
}

const UPLOAD_DEBOUNCE_MS = 5000;
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

const applyRemote = (payload: CloudPayload, remoteAt: number | null): void => {
  const parsed = parseBackupPayload(payload);
  isApplyingRemote = true;
  try {
    applyBackupPayload(parsed);
    useSettings.getState().update({
      lastCloudSyncAt:
        typeof payload.updatedAt === 'string' ? payload.updatedAt : new Date().toISOString(),
      lastSyncedRemoteAt: remoteAt,
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
  // Record the iCloud file's own modification time so later launches can tell
  // whether ANOTHER device changed it, without comparing app-generated clocks.
  const remoteAt = await getRemoteModifiedAt();
  useSettings.getState().update({
    lastCloudSyncAt: payload.updatedAt,
    lastSyncedRemoteAt: remoteAt,
  });
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
  const remoteAt = await getRemoteModifiedAt();
  applyRemote(payload, remoteAt);
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

  // Decide using the iCloud file's filesystem modification time (set by the OS)
  // versus the mtime we recorded at our last sync. Both come from the same
  // source, so the comparison is immune to device clock skew.
  const remoteAt = await getRemoteModifiedAt();
  // mtime unavailable (e.g. stat failed): stay safe and do nothing. Local data
  // is preserved; pending local edits still upload via the debounced push.
  if (remoteAt === null) return 'noop';

  const lastSynced = useSettings.getState().settings.lastSyncedRemoteAt;

  // No baseline yet (e.g. first launch after upgrading to mtime-based sync, or
  // sync enabled on another device). Adopt the current remote as our baseline
  // WITHOUT overwriting local data, so unsynced local edits are never clobbered
  // on the transition. Genuinely newer remote writes (mtime beyond this
  // baseline) will pull on later launches.
  if (lastSynced === null) {
    useSettings.getState().update({ lastSyncedRemoteAt: remoteAt });
    return 'noop';
  }

  // Strictly newer mtime ⇒ another device wrote the file since we last synced.
  if (remoteAt > lastSynced) {
    applyRemote(payload, remoteAt);
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
  const remoteAt = await getRemoteModifiedAt();
  applyRemote(r, remoteAt);
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
