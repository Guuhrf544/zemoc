import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { decideOnLaunch, startCloudSync, stopCloudSync } from '@/lib/cloud-sync';
import { useSettings } from '@/lib/store/settings';

export function useCloudSync(): void {
  const cloudSync = useSettings((s) => s.settings.cloudSync);
  const lastLaunchAtRef = useRef<number>(0);

  useEffect(() => {
    if (!cloudSync) {
      stopCloudSync();
      return;
    }

    startCloudSync();

    const now = Date.now();
    if (now - lastLaunchAtRef.current > 30_000) {
      lastLaunchAtRef.current = now;
      decideOnLaunch().catch((err) => {
        console.warn('iCloud launch sync failed', err);
      });
    }

    return () => {
      stopCloudSync();
    };
  }, [cloudSync]);

  useEffect(() => {
    if (!cloudSync) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      const now = Date.now();
      if (now - lastLaunchAtRef.current <= 30_000) return;
      lastLaunchAtRef.current = now;
      decideOnLaunch().catch((err) => {
        console.warn('iCloud foreground sync failed', err);
      });
    });
    return () => sub.remove();
  }, [cloudSync]);
}
