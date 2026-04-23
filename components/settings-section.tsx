import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Props {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <View style={styles.wrap}>
      <ThemedText style={[styles.title, { color: palette.textMuted }]}>
        {title}
      </ThemedText>
      <View
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  title: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    lineHeight: FontSize.xs * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: Spacing.md,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
