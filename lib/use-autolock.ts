import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useLock } from './store/lock';
import { useSettings } from './store/settings';

const LOCK_AFTER_BG_MS = 30_000;

export function useAutoLock() {
  const setUnlocked = useLock((s) => s.setUnlocked);
  const securityPin = useSettings((s) => s.settings.securityPin);
  const bgSince = useRef<number | null>(null);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === 'active') {
        if (
          securityPin &&
          bgSince.current !== null &&
          Date.now() - bgSince.current > LOCK_AFTER_BG_MS
        ) {
          setUnlocked(false);
        }
        bgSince.current = null;
      } else if (state === 'background' || state === 'inactive') {
        if (bgSince.current === null) bgSince.current = Date.now();
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [securityPin, setUnlocked]);
}
