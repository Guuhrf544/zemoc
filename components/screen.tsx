import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  scrollable?: boolean;
  bodyStyle?: ViewStyle;
  right?: ReactNode;
}

export function Screen({
  title,
  subtitle,
  children,
  scrollable,
  bodyStyle,
  right,
}: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: palette.background }]}
    >
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <ThemedText style={[styles.title, { color: palette.text }]}>
            {title}
          </ThemedText>
          {subtitle ? (
            <ThemedText style={[styles.subtitle, { color: palette.textMuted }]}>
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        {right ? <View style={styles.right}>{right}</View> : null}
      </View>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={[styles.scrollBody, bodyStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.body, bodyStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  titleWrap: { flex: 1 },
  right: { paddingTop: Spacing.xs },
  title: {
    fontSize: FontSize.display,
    lineHeight: FontSize.display * 1.25,
    fontWeight: '700',
    letterSpacing: -0.5,
    includeFontPadding: false,
  },
  subtitle: { fontSize: FontSize.md, lineHeight: FontSize.md * 1.4, marginTop: Spacing.xs },
  body: { flex: 1, paddingHorizontal: Spacing.xl },
  scrollBody: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
});
