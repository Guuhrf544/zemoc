import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface HeroCardProps {
  children: ReactNode;
  /** Vertical spacing between children. Defaults to Spacing.md. */
  gap?: number;
}

export function HeroCard({ children, gap = Spacing.md }: HeroCardProps) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  return (
    <View
      style={[
        styles.card,
        { gap, backgroundColor: palette.hero, borderColor: palette.heroBorder },
      ]}
    >
      {children}
    </View>
  );
}

// Shared "hero" label + value text styles (balance and forecast cards).
export const heroStyles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: FontSize.display,
    fontWeight: '700',
    lineHeight: FontSize.display * 1.2,
    letterSpacing: -0.5,
  },
});

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
  },
});
