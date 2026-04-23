import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';

export default function TermsScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  return (
    <>
      <Stack.Screen
        options={{
          title: t('terms.title'),
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
          Terms of Use
        </ThemedText>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>
          Last updated: April 2026
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          1. Acceptance
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          By using Zemoc (&quot;the App&quot;), you agree to these Terms of Use. If you do
          not agree, please do not use the App.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          2. The service
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Zemoc is a personal finance tracker. All data you enter (expenses,
          incomes, subscriptions) is stored locally on your device. The App does
          not send your financial data to any server.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          3. Your responsibilities
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          You are responsible for the accuracy of the data you enter and for
          keeping backups of your information. Deleting the App will delete all
          local data unless you have saved a backup.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          4. No financial advice
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Zemoc provides tools and summaries based on the data you enter. It does
          not provide financial, tax, legal, or investment advice. Decisions you
          make based on the App are your own responsibility.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          5. Limitation of liability
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          The App is provided &quot;as is&quot;, without warranties of any kind. We are
          not liable for any loss of data or damages arising from the use of the
          App, to the extent permitted by law.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          6. Changes
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          We may update these Terms from time to time. Continued use of the App
          after changes means you accept the updated Terms.
        </ThemedText>

        <ThemedText style={[styles.h2, { color: palette.text }]}>
          7. Contact
        </ThemedText>
        <ThemedText style={[styles.p, { color: palette.text }]}>
          Questions? Write to support@zemoc.app.
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
