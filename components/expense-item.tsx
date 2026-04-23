import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatShortDate, useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { CATEGORY_COLOR, type Expense } from '@/types/models';

import { ThemedText } from './themed-text';

interface Props {
  expense: Expense;
  onPress: (id: string) => void;
  planned?: boolean;
}

function ExpenseItemInner({ expense, onPress, planned }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();
  const dotColor = CATEGORY_COLOR[expense.category];

  const handlePress = useCallback(() => onPress(expense.id), [onPress, expense.id]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.middle}>
        <View style={styles.titleRow}>
          <ThemedText style={[styles.desc, { color: palette.text }]} numberOfLines={1}>
            {expense.description}
          </ThemedText>
          {planned ? (
            <View
              style={[styles.badge, { backgroundColor: palette.surfaceAlt }]}
            >
              <ThemedText style={[styles.badgeText, { color: palette.textMuted }]}>
                {t('badge.planned')}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>
          {t(`category.${expense.category}` as never)} · {formatShortDate(expense.date)}
        </ThemedText>
      </View>
      <ThemedText style={[styles.amount, { color: palette.text }]}>
        {money(expense.amount)}
      </ThemedText>
    </Pressable>
  );
}

export const ExpenseItem = memo(ExpenseItemInner);

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
  dot: { width: 10, height: 10, borderRadius: 5 },
  middle: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  desc: { fontSize: FontSize.md, fontWeight: '600', lineHeight: FontSize.md * 1.3 },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    lineHeight: FontSize.xs * 1.3,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  meta: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.4 },
  amount: { fontSize: FontSize.md, fontWeight: '700', lineHeight: FontSize.md * 1.3 },
});
