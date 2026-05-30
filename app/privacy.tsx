import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';

export default function PrivacyScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('privacy.title'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: palette.background }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.heading, { color: palette.text }]}>
          Privacy Policy
        </ThemedText>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>
          Last updated: May 2026
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          1. What we collect
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Zemoc is designed to be private by default. All financial data you
          enter — subscriptions, expenses, incomes, profile details — is stored
          locally on your device using the operating system&apos;s storage and
          secure keychain. We do not operate any server and do not have access
          to your financial data.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          2. iCloud sync (optional)
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          If you enable &quot;Sync with iCloud&quot; in Settings, Zemoc stores a
          copy of your data inside your personal iCloud container. This lets you
          back up your data and sync it across your iOS devices. The data lives
          in your iCloud account and is processed by Apple under its terms.
          Zemoc and its developer do not have access to it. You can disable sync
          at any time in Settings; existing iCloud data can be removed from your
          device&apos;s iOS settings under iCloud Storage.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          3. Photos
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          If you add a profile photo, it is stored locally on your device only.
          We request photo library access solely for this purpose.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          4. Biometrics and PIN
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          If you enable PIN or biometric unlock, your PIN is stored using your
          device&apos;s secure keychain and never leaves your device — it is
          excluded from iCloud sync. Biometric verification is handled entirely
          by the operating system — Zemoc only receives a pass/fail result.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          5. Backups and exports
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          When you use the manual backup or export features, a file is generated
          on your device and you decide how to share or save it. Zemoc never
          uploads it automatically to any server we control.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          6. Analytics and tracking
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Zemoc does not use analytics SDKs, advertising SDKs, or third-party
          trackers.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          7. Children
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Zemoc is not directed to children under 13.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          8. Contact
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Privacy questions? Write to elogia.dev@gmail.com.
        </ThemedText>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  heading: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    lineHeight: FontSize.xxl * 1.25,
  },
  meta: {
    fontSize: FontSize.sm,
    marginBottom: Spacing.md,
  },
  h2: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
    marginTop: Spacing.md,
  },
  p: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.5,
  },
});
