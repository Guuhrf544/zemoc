import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

export interface ListItemRowProps {
  onPress: () => void;
  title: string;
  meta: string;
  amount: string;
  /** Optional leading category dot (expenses / incomes). */
  dotColor?: string;
  /** Optional pill next to the title (e.g. "planned"). */
  badge?: string;
  /** 'positive' tints the amount with the success color (incomes). */
  amountTone?: 'default' | 'positive';
  /** Prefix glued before the amount (e.g. "+"). */
  amountPrefix?: string;
  /** Optional second line under the amount (e.g. billing period). */
  trailingSublabel?: string;
}

function ListItemRowInner({
  onPress,
  title,
  meta,
  amount,
  dotColor,
  badge,
  amountTone = 'default',
  amountPrefix,
  trailingSublabel,
}: ListItemRowProps) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const amountColor = amountTone === 'positive' ? palette.success : palette.text;

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
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <View style={styles.middle}>
        <View style={styles.titleRow}>
          <ThemedText style={[styles.title, { color: palette.text }]} numberOfLines={1}>
            {title}
          </ThemedText>
          {badge ? (
            <View style={[styles.badge, { backgroundColor: palette.surfaceAlt }]}>
              <ThemedText style={[styles.badgeText, { color: palette.textMuted }]}>
                {badge}
              </ThemedText>
            </View>
          ) : null}
        </View>
        <ThemedText style={[styles.meta, { color: palette.textMuted }]}>{meta}</ThemedText>
      </View>
      <View style={styles.trailing}>
        <ThemedText style={[styles.amount, { color: amountColor }]}>
          {amountPrefix ? amountPrefix : ''}
          {amount}
        </ThemedText>
        {trailingSublabel ? (
          <ThemedText style={[styles.sublabel, { color: palette.textMuted }]}>
            {trailingSublabel}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

export const ListItemRow = memo(ListItemRowInner);

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
  title: { fontSize: FontSize.md, fontWeight: '600', lineHeight: FontSize.md * 1.3 },
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
  trailing: { alignItems: 'flex-end' },
  amount: { fontSize: FontSize.md, fontWeight: '700', lineHeight: FontSize.md * 1.3 },
  sublabel: { fontSize: FontSize.xs, lineHeight: FontSize.xs * 1.4 },
});
