import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Props {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: palette.surface, borderColor: palette.border },
      ]}
    >
      <ThemedText style={[styles.title, { color: palette.text }]}>{title}</ThemedText>
      <ThemedText style={[styles.message, { color: palette.textMuted }]}>
        {message}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  title: { fontSize: FontSize.lg, fontWeight: '600', marginBottom: Spacing.xs },
  message: { fontSize: FontSize.sm, textAlign: 'center', lineHeight: 20 },
});
