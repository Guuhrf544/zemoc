import { Stack } from 'expo-router';
import { Fragment } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';

const SECTIONS = [
  { h: 'terms.s1.h', p: 'terms.s1.p' },
  { h: 'terms.s2.h', p: 'terms.s2.p' },
  { h: 'terms.s3.h', p: 'terms.s3.p' },
  { h: 'terms.s4.h', p: 'terms.s4.p' },
  { h: 'terms.s5.h', p: 'terms.s5.p' },
  { h: 'terms.s6.h', p: 'terms.s6.p' },
  { h: 'terms.s7.h', p: 'terms.s7.p' },
] as const;

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
          {t('terms.title')}
        </ThemedText>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>
          {t('legal.updated')}
        </ThemedText>

        {SECTIONS.map((s, i) => (
          <Fragment key={s.h}>
            <ThemedText style={[styles.h2, { color: palette.text }]}>
              {i + 1}. {t(s.h)}
            </ThemedText>
            <ThemedText style={[styles.p, { color: palette.text }]}>
              {t(s.p)}
            </ThemedText>
          </Fragment>
        ))}
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
