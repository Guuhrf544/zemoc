import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { PinPad } from '@/components/pin-pad';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';
import { savePin, verifyPin } from '@/lib/security';
import { useSettings } from '@/lib/store/settings';

type Mode = 'new' | 'change';
type Step = 'current' | 'new' | 'confirm';

export default function PinSetupScreen() {
  const { mode } = useLocalSearchParams<{ mode?: Mode }>();
  const isChange = mode === 'change';
  const t = useT();
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const update = useSettings((s) => s.update);

  const [step, setStep] = useState<Step>(isChange ? 'current' : 'new');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState<string | undefined>();

  const finish = async (pin: string) => {
    await savePin(pin);
    update({ securityPin: true });
    router.back();
    Alert.alert(isChange ? t('pin.change.success') : t('pin.setup.saved'));
  };

  const handleCurrent = async (pin: string) => {
    const result = await verifyPin(pin);
    if (result.ok) {
      setError(undefined);
      setStep('new');
      return;
    }
    if (result.reason === 'locked') {
      const seconds = Math.ceil((result.until - Date.now()) / 1000);
      setError(t('pin.unlock.locked', { seconds: String(seconds) }));
    } else if (result.reason === 'wrong') {
      setError(t('pin.unlock.remaining', { remaining: String(result.remaining) }));
    } else {
      setError(t('pin.unlock.wrong'));
    }
  };

  const handleNew = (pin: string) => {
    setFirstPin(pin);
    setError(undefined);
    setStep('confirm');
  };

  const handleConfirm = async (pin: string) => {
    if (pin === firstPin) {
      await finish(pin);
    } else {
      setError(t('pin.setup.mismatch'));
      setFirstPin('');
      setStep('new');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isChange ? t('settings.security.changePin') : t('pin.setup.title'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <View style={[styles.body, { backgroundColor: palette.background }]}>
        {step === 'current' ? (
          <PinPad
            key="current"
            title={t('pin.change.current')}
            error={error}
            onComplete={handleCurrent}
          />
        ) : step === 'new' ? (
          <PinPad
            key="new"
            title={t('pin.setup.title')}
            subtitle={t('pin.setup.step1')}
            onComplete={handleNew}
          />
        ) : (
          <PinPad
            key="confirm"
            title={t('pin.setup.title')}
            subtitle={t('pin.setup.step2')}
            error={error}
            onComplete={handleConfirm}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
});
