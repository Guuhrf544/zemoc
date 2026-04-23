import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT, type TranslateFn } from '@/lib/i18n';
import type { UpcomingCharge } from '@/lib/billing';

import { ThemedText } from './themed-text';

interface Props {
  items: UpcomingCharge[];
}

const labelForDays = (days: number, t: TranslateFn): string => {
  if (days <= 0) return t('upcoming.today');
  if (days === 1) return t('upcoming.tomorrow');
  if (days < 7) return t('upcoming.inDays', { days });
  if (days < 14) return t('upcoming.nextWeek');
  if (days < 31) return t('upcoming.inDays', { days });
  return t('upcoming.inMonths', { months: Math.round(days / 30) });
};

export function UpcomingCharges({ items }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  if (items.length === 0) return null;

  return (
    <View style={styles.container}>
      {items.map(({ subscription, daysUntil }) => (
        <Pressable
          key={subscription.id}
          onPress={() => router.push(`/subscription/${subscription.id}`)}
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
            <ThemedText style={[styles.when, { color: palette.textMuted }]}>
              {labelForDays(daysUntil, t)}
            </ThemedText>
          </View>
          <ThemedText style={[styles.amount, { color: palette.text }]}>
            {money(subscription.amount)}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  left: { flex: 1, gap: 2 },
  name: { fontSize: FontSize.md, fontWeight: '600', lineHeight: FontSize.md * 1.3 },
  when: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.4 },
  amount: { fontSize: FontSize.md, fontWeight: '700', lineHeight: FontSize.md * 1.3 },
});
