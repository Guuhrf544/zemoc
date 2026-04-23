import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatLongMonth } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { localeFor, useSettings } from '@/lib/store/settings';
import { ThemedText } from './themed-text';

interface Props {
  visible: boolean;
  monthDate: Date;
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onClose: () => void;
}

const CELL_SIZE = 40;

export function DayPickerSheet({
  visible,
  monthDate,
  selectedDay,
  onSelectDay,
  onClose,
}: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const language = useSettings((s) => s.settings.language);

  const { rows, todayDay, weekdayLabels } = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0).getDate();
    // Weekday 0=Sun..6=Sat → shift so Mon=0..Sun=6
    const startWeekday = (firstDay.getDay() + 6) % 7;

    const today = new Date();
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();

    const cells: (number | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= lastDay; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const grid: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) grid.push(cells.slice(i, i + 7));

    const locale = localeFor(language);
    const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    // Jan 1, 2024 was a Monday
    const labels = Array.from({ length: 7 }, (_, i) =>
      weekdayFmt.format(new Date(2024, 0, 1 + i))
    );

    return {
      rows: grid,
      todayDay: isCurrentMonth ? today.getDate() : null,
      weekdayLabels: labels,
    };
  }, [monthDate, language]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView
        edges={['bottom']}
        style={[
          styles.sheet,
          { backgroundColor: palette.background, borderColor: palette.border },
        ]}
      >
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: palette.border }]} />
        </View>

        <View style={styles.header}>
          <ThemedText style={[styles.title, { color: palette.text }]}>
            {t('day.picker.title')}
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: palette.textMuted }]}>
            {formatLongMonth(monthDate)}
          </ThemedText>
        </View>

        <View style={styles.weekdayRow}>
          {weekdayLabels.map((label, i) => (
            <View key={i} style={styles.weekdayCell}>
              <ThemedText style={[styles.weekday, { color: palette.textMuted }]}>
                {label}
              </ThemedText>
            </View>
          ))}
        </View>

        {rows.map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((day, cIdx) => {
              if (day === null) {
                return <View key={cIdx} style={styles.cellEmpty} />;
              }
              const isSelected = day === selectedDay;
              const isToday = day === todayDay;
              return (
                <Pressable
                  key={cIdx}
                  onPress={() => onSelectDay(day)}
                  style={({ pressed }) => [
                    styles.cell,
                    {
                      backgroundColor: isSelected
                        ? palette.tint
                        : isToday
                          ? palette.surfaceAlt
                          : 'transparent',
                      opacity: pressed ? 0.6 : 1,
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.cellText,
                      {
                        color: isSelected
                          ? palette.onAccent
                          : palette.text,
                        fontWeight: isSelected || isToday ? '700' : '500',
                      },
                    ]}
                  >
                    {day}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable
            onPress={() => onSelectDay(null)}
            style={({ pressed }) => [
              styles.actionBtn,
              {
                backgroundColor: palette.surfaceAlt,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <ThemedText style={[styles.actionLabel, { color: palette.text }]}>
              {t('day.picker.clear')}
            </ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  handle: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  handleBar: { width: 40, height: 4, borderRadius: 2 },
  header: { gap: 2, marginBottom: Spacing.md },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
  },
  subtitle: {
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * 1.4,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekday: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  cell: {
    flex: 1,
    height: CELL_SIZE,
    marginHorizontal: 2,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellEmpty: {
    flex: 1,
    height: CELL_SIZE,
    marginHorizontal: 2,
  },
  cellText: {
    fontSize: FontSize.md,
  },
  actions: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    lineHeight: FontSize.md * 1.3,
  },
});
