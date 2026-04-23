import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MonthFilter } from '@/hooks/use-month-filter';
import { formatLongMonth } from '@/lib/format';
import { useT } from '@/lib/i18n';

import { PickerSheet } from './picker-sheet';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface Props {
  filter: MonthFilter;
}

const MONTHS_BACK = 12;
const MONTHS_FORWARD = 12;

export function MonthSelector({ filter }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const [open, setOpen] = useState(false);

  const options = useMemo(() => {
    const now = new Date();
    const total = MONTHS_BACK + MONTHS_FORWARD + 1;
    return Array.from({ length: total }, (_, i) => {
      const offset = i - MONTHS_BACK;
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1, 12, 0, 0, 0);
      return {
        value: String(offset),
        label: formatLongMonth(d),
        hint: offset === 0 ? t('day.picker.today') : undefined,
      };
    });
  }, [t]);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.bar,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: palette.surfaceAlt }]}>
          <IconSymbol name="calendar" size={18} color={palette.text} />
        </View>
        <View style={styles.labelWrap}>
          <ThemedText style={[styles.label, { color: palette.text }]}>
            {filter.monthLabel}
          </ThemedText>
        </View>
        <IconSymbol name="chevron.down" size={18} color={palette.textMuted} />
      </Pressable>

      <PickerSheet
        visible={open}
        title={t('month.picker.title')}
        options={options}
        value={String(filter.offset)}
        onChange={(v) => {
          filter.setOffset(parseInt(v, 10));
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 56,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: { flex: 1 },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: FontSize.md * 1.3,
  },
});
