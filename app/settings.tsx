import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';

import { PickerSheet } from '@/components/picker-sheet';
import { SettingsRow } from '@/components/settings-row';
import { SettingsSection } from '@/components/settings-section';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { exportBackup, importBackup } from '@/lib/backup';
import { exportCsv } from '@/lib/export-csv';
import { useT } from '@/lib/i18n';
import { clearPin } from '@/lib/security';
import { useExpenses } from '@/lib/store/expenses';
import { useIncomes } from '@/lib/store/incomes';
import {
  type Appearance,
  type CurrencyCode,
  CURRENCY_SYMBOL,
  type Language,
  useSettings,
} from '@/lib/store/settings';
import { useSubscriptions } from '@/lib/store/subscriptions';

type PickerKey = 'language' | 'currency' | 'appearance';

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  const settings = useSettings((s) => s.settings);
  const update = useSettings((s) => s.update);

  const incomes = useIncomes((s) => s.items);
  const expenses = useExpenses((s) => s.items);
  const subscriptions = useSubscriptions((s) => s.items);

  const [picker, setPicker] = useState<PickerKey | null>(null);

  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  const LANGUAGES: { value: Language; label: string }[] = [
    { value: 'pt', label: t('settings.language.pt') },
    { value: 'en', label: t('settings.language.en') },
  ];
  const CURRENCIES: { value: CurrencyCode; label: string; hint?: string }[] = [
    { value: 'EUR', label: t('settings.currency.EUR'), hint: '€' },
    { value: 'BRL', label: t('settings.currency.BRL'), hint: 'R$' },
    { value: 'USD', label: t('settings.currency.USD'), hint: '$' },
  ];
  const APPEARANCES: { value: Appearance; label: string; hint?: string }[] = [
    { value: 'light', label: t('settings.appearance.light') },
    { value: 'dark', label: t('settings.appearance.dark') },
    {
      value: 'auto',
      label: t('settings.appearance.auto'),
      hint: t('settings.appearance.auto.hint'),
    },
  ];

  const labelOf = <T extends string>(
    list: { value: T; label: string }[],
    value: T
  ): string => list.find((o) => o.value === value)?.label ?? '';

  const handleTogglePin = (next: boolean) => {
    if (next) {
      router.push('/pin-setup?mode=new');
    } else {
      Alert.alert(t('pin.disable.confirm'), t('pin.disable.confirmMsg'), [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('pin.disable.action'),
          style: 'destructive',
          onPress: async () => {
            await clearPin();
            update({ securityPin: false, securityBiometric: false });
          },
        },
      ]);
    }
  };

  const handleToggleBiometric = async (next: boolean) => {
    if (!next) {
      update({ securityBiometric: false });
      return;
    }
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!compatible || !enrolled) {
      Alert.alert(t('biometric.notAvailable'), t('biometric.notAvailableMsg'));
      return;
    }
    update({ securityBiometric: true });
  };

  const handleExportCsv = async () => {
    try {
      await exportCsv(incomes, expenses, subscriptions);
    } catch (error) {
      Alert.alert(
        t('settings.export.failed'),
        error instanceof Error ? error.message : t('settings.export.failed.default')
      );
    }
  };

  const handleBackup = async () => {
    try {
      await exportBackup();
    } catch (error) {
      Alert.alert(
        t('backup.failed'),
        error instanceof Error ? error.message : t('settings.export.failed.default')
      );
    }
  };

  const handleRestore = () => {
    Alert.alert(t('restore.confirm'), t('restore.confirmMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('restore.action'),
        style: 'destructive',
        onPress: async () => {
          try {
            const ok = await importBackup();
            if (ok) {
              Alert.alert(t('restore.success'), t('restore.successMsg'));
            }
          } catch (error) {
            Alert.alert(
              t('restore.failed'),
              error instanceof Error && error.message === 'Invalid backup file'
                ? t('restore.invalidFile')
                : error instanceof Error
                  ? error.message
                  : t('settings.export.failed.default')
            );
          }
        },
      },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t('settings.title'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.background }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title={t('settings.preferences')}>
          <SettingsRow
            icon="globe"
            label={t('settings.language')}
            value={labelOf(LANGUAGES, settings.language)}
            onPress={() => setPicker('language')}
          />
          <SettingsRow
            icon="dollarsign.circle"
            label={t('settings.currency')}
            value={`${CURRENCY_SYMBOL[settings.currency]} ${settings.currency}`}
            onPress={() => setPicker('currency')}
          />
          <SettingsRow
            icon="paintbrush"
            label={t('settings.appearance')}
            value={labelOf(APPEARANCES, settings.appearance)}
            onPress={() => setPicker('appearance')}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t('settings.notifications')}>
          <SettingsRow
            icon="bell"
            label={t('settings.notifications.enable')}
            switchValue={settings.notifications}
            onSwitchChange={(v) => update({ notifications: v })}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t('settings.security')}>
          <SettingsRow
            icon="lock"
            label={t('settings.security.pin')}
            switchValue={settings.securityPin}
            onSwitchChange={handleTogglePin}
          />
          {settings.securityPin ? (
            <SettingsRow
              icon="shield"
              label={t('settings.security.changePin')}
              onPress={() => router.push('/pin-setup?mode=change')}
            />
          ) : null}
          <SettingsRow
            icon="faceid"
            label={t('settings.security.biometric')}
            value={!settings.securityPin ? t('settings.security.biometric.hint') : undefined}
            switchValue={settings.securityPin ? settings.securityBiometric : false}
            onSwitchChange={settings.securityPin ? handleToggleBiometric : undefined}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t('settings.data')}>
          <SettingsRow
            icon="arrow.up.doc"
            label={t('settings.data.backup')}
            onPress={handleBackup}
          />
          <SettingsRow
            icon="arrow.down.doc"
            label={t('settings.data.restore')}
            onPress={handleRestore}
          />
          <SettingsRow
            icon="square.and.arrow.up"
            label={t('settings.data.export')}
            onPress={handleExportCsv}
            isLast
          />
        </SettingsSection>

        <SettingsSection title={t('settings.about')}>
          <SettingsRow
            icon="info.circle"
            label={t('settings.about.version')}
            value={appVersion}
          />
          <SettingsRow
            icon="doc.text"
            label={t('settings.about.terms')}
            onPress={() => router.push('/terms')}
          />
          <SettingsRow
            icon="doc.text"
            label={t('settings.about.privacy')}
            onPress={() => router.push('/privacy')}
          />
          <SettingsRow
            icon="bubble.left"
            label={t('settings.about.support')}
            onPress={() =>
              Linking.openURL('mailto:elogia.dev@gmail.com').catch(() =>
                Alert.alert(
                  t('settings.about.noEmail'),
                  t('settings.about.noEmailMsg')
                )
              )
            }
            isLast
          />
        </SettingsSection>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <PickerSheet
        visible={picker === 'language'}
        title={t('settings.language')}
        options={LANGUAGES}
        value={settings.language}
        onChange={(v) => {
          update({ language: v });
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <PickerSheet
        visible={picker === 'currency'}
        title={t('settings.currency')}
        options={CURRENCIES}
        value={settings.currency}
        onChange={(v) => {
          update({ currency: v });
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
      <PickerSheet
        visible={picker === 'appearance'}
        title={t('settings.appearance')}
        options={APPEARANCES}
        value={settings.appearance}
        onChange={(v) => {
          update({ appearance: v });
          setPicker(null);
        }}
        onClose={() => setPicker(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
});
