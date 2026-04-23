import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatBillingSchedule, formatPeriodLabel, useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { Subscription } from '@/types/models';

import { ThemedText } from './themed-text';

interface Props {
  subscription: Subscription;
  onPress: () => void;
}

export function SubscriptionItem({ subscription, onPress }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  const categoryText = subscription.category
    ? t(`category.${subscription.category}` as never)
    : '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        <ThemedText style={[styles.name, { color: palette.text }]} numberOfLines={1}>
          {subscription.name}
        </ThemedText>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>
          {formatBillingSchedule(subscription)}
          {categoryText ? ` · ${categoryText}` : ''}
        </ThemedText>
      </View>
      <View style={styles.right}>
        <ThemedText style={[styles.amount, { color: palette.text }]}>
          {money(subscription.amount)}
        </ThemedText>
        <ThemedText style={[styles.period, { color: palette.textMuted }]}>
          {formatPeriodLabel(subscription.billingPeriod)}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  left: { flex: 1, gap: 2 },
  right: { alignItems: 'flex-end' },
  name: { fontSize: FontSize.md, fontWeight: '600', lineHeight: FontSize.md * 1.3 },
  meta: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.4 },
  amount: { fontSize: FontSize.md, fontWeight: '700', lineHeight: FontSize.md * 1.3 },
  period: { fontSize: FontSize.xs, lineHeight: FontSize.xs * 1.4 },
});
