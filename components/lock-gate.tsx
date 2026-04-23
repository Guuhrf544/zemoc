import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';
import { verifyPin } from '@/lib/security';
import { useLock } from '@/lib/store/lock';
import { useSettings } from '@/lib/store/settings';

import { PinPad } from './pin-pad';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

export function LockGate() {
  const t = useT();
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const securityPin = useSettings((s) => s.settings.securityPin);
  const biometric = useSettings((s) => s.settings.securityBiometric);
  const unlocked = useLock((s) => s.unlocked);
  const setUnlocked = useLock((s) => s.setUnlocked);

  const [hydrated, setHydrated] = useState(() =>
    useSettings.persist.hasHydrated()
  );
  const [error, setError] = useState<string | undefined>();
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const biometricTriedRef = useRef(false);

  useEffect(() => {
    if (hydrated) return;
    const unsub = useSettings.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [hydrated]);

  const shouldLock = hydrated && securityPin && !unlocked;

  useEffect(() => {
    if (!lockedUntil) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= lockedUntil) {
        setLockedUntil(null);
        setError(undefined);
      }
    }, 500);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && now < lockedUntil;
  const secondsLeft = isLocked ? Math.ceil((lockedUntil! - now) / 1000) : 0;

  const handlePin = async (pin: string) => {
    if (isLocked) return;
    const result = await verifyPin(pin);
    if (result.ok) {
      setError(undefined);
      setLockedUntil(null);
      setUnlocked(true);
      return;
    }
    if (result.reason === 'locked') {
      setLockedUntil(result.until);
      setError(
        t('pin.unlock.locked', {
          seconds: String(Math.ceil((result.until - Date.now()) / 1000)),
        })
      );
    } else if (result.reason === 'wrong') {
      setError(t('pin.unlock.remaining', { remaining: String(result.remaining) }));
    } else {
      setError(t('pin.unlock.wrong'));
    }
  };

  const tryBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!compatible || !enrolled) return;
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: t('biometric.prompt'),
      cancelLabel: t('common.cancel'),
      disableDeviceFallback: false,
    });
    if (res.success) setUnlocked(true);
  };

  useEffect(() => {
    if (!shouldLock) {
      biometricTriedRef.current = false;
      return;
    }
    if (biometric && !biometricTriedRef.current) {
      biometricTriedRef.current = true;
      tryBiometric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLock, biometric]);

  if (!shouldLock) return null;

  return (
    <View style={[styles.fill, { backgroundColor: palette.background }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <PinPad
            title={t('pin.unlock.title')}
            error={
              isLocked
                ? t('pin.unlock.locked', { seconds: String(secondsLeft) })
                : error
            }
            onComplete={handlePin}
          />
          {biometric && !isLocked ? (
            <Pressable
              onPress={tryBiometric}
              style={({ pressed }) => [
                styles.bioBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <IconSymbol name="faceid" size={20} color={palette.tint} />
              <ThemedText style={[styles.bioLabel, { color: palette.tint }]}>
                {t('pin.unlock.useBiometric')}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  safe: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  bioBtn: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  bioLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
