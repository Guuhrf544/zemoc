import { Platform } from 'react-native';
import * as CloudStore from 'react-native-cloud-store';

const FILENAME = 'zemoc-data.json';

async function getRemotePath(): Promise<string | null> {
  if (Platform.OS !== 'ios') return null;
  const container = await CloudStore.getDefaultICloudContainerPath();
  if (!container) return null;
  return CloudStore.PathUtils.join(container, 'Documents', FILENAME);
}

export const isICloudAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') return false;
  try {
    return await CloudStore.isICloudAvailable();
  } catch {
    return false;
  }
};

export const uploadBackup = async (payload: object): Promise<void> => {
  const path = await getRemotePath();
  if (!path) throw new Error('iCloud unavailable');
  const json = JSON.stringify(payload);
  await CloudStore.writeFile(path, json, { override: true });
};

export const downloadBackup = async <T = unknown>(): Promise<T | null> => {
  const path = await getRemotePath();
  if (!path) return null;
  const exists = await CloudStore.exist(path);
  if (!exists) return null;
  const content = await CloudStore.readFile(path);
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
};

export const getRemoteModifiedAt = async (): Promise<number | null> => {
  const path = await getRemotePath();
  if (!path) return null;
  try {
    const exists = await CloudStore.exist(path);
    if (!exists) return null;
    const info = await CloudStore.stat(path);
    return info.modifyTimestamp ?? null;
  } catch {
    return null;
  }
};

export const deleteBackup = async (): Promise<void> => {
  const path = await getRemotePath();
  if (!path) return;
  try {
    if (await CloudStore.exist(path)) await CloudStore.unlink(path);
  } catch {
    // file may not exist; ignore
  }
};
