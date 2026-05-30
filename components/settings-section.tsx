import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

import { ThemedText } from './themed-text';

interface Props {
  title: string;
  children: ReactNode;
}

export function SettingsSection({ title, children }: Props) {
  const palette = usePalette();

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
