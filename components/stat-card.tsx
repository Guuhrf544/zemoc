import { StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';

import { ThemedText } from './themed-text';

interface Props {
  label: string;
  value: number;
  tone?: 'neutral' | 'positive' | 'negative';
}

export function StatCard({ label, value, tone = 'neutral' }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const money = useMoney();

  const valueColor =
    tone === 'positive' ? palette.success : tone === 'negative' ? palette.danger : palette.text;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: palette.surface, borderColor: palette.border },
      ]}
    >
      <ThemedText style={[styles.label, { color: palette.textMuted }]}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.value, { color: valueColor }]}>
        {money(value)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '500',
    lineHeight: FontSize.xs * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    lineHeight: FontSize.xl * 1.25,
  },
});
