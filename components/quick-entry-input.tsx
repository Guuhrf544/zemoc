import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { FontSize, Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';

import { DayPickerSheet } from './day-picker-sheet';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface QuickEntryInputProps<P extends { amount: number }> {
  monthDate: Date;
  /** Parses the raw text into a typed entry, or null when incomplete. */
  parse: (raw: string) => P | null;
  /** Already-translated placeholder + "incomplete" hint. */
  placeholder: string;
  incompleteText: string;
  /** Pulls the main label (description / source) out of a parsed entry. */
  renderLabel: (parsed: P) => string;
  /** Pulls the translated category text out of a parsed entry. */
  renderCategory: (parsed: P) => string;
  /** Prefix glued before the amount in the preview (e.g. "+" for incomes). */
  amountPrefix?: string;
  onSubmit: (data: P & { day: number | null }) => void;
}

export function QuickEntryInput<P extends { amount: number }>({
  monthDate,
  parse,
  placeholder,
  incompleteText,
  renderLabel,
  renderCategory,
  amountPrefix,
  onSubmit,
}: QuickEntryInputProps<P>) {
  const palette = usePalette();
  const t = useT();
  const money = useMoney();

  const [raw, setRaw] = useState('');
  const [day, setDay] = useState<number | null>(null);
  const [dayOpen, setDayOpen] = useState(false);

  const parsed = parse(raw);

  const handleSubmit = () => {
    if (!parsed) return;
    onSubmit({ ...parsed, day });
    setRaw('');
    setDay(null);
  };

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.inputBox,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <TextInput
          value={raw}
          onChangeText={setRaw}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          style={[styles.input, { color: palette.text }]}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          onPress={handleSubmit}
          disabled={!parsed}
          style={({ pressed }) => [
            styles.send,
            {
              backgroundColor: parsed ? palette.tint : palette.surfaceAlt,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <IconSymbol
            name="plus"
            size={22}
            color={parsed ? palette.onAccent : palette.textMuted}
          />
        </Pressable>
      </View>

      <Pressable
        onPress={() => setDayOpen(true)}
        style={({ pressed }) => [
          styles.dayBtn,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <View style={[styles.dayIconWrap, { backgroundColor: palette.surfaceAlt }]}>
          <IconSymbol name="calendar" size={16} color={palette.text} />
        </View>
        <ThemedText style={[styles.dayLabel, { color: palette.text }]}>
          {day ? t('format.day', { day }) : t('day.picker.label.today')}
        </ThemedText>
        <IconSymbol name="chevron.down" size={16} color={palette.textMuted} />
      </Pressable>

      {parsed ? (
        <ThemedText style={[styles.preview, { color: palette.textMuted }]}>
          {(amountPrefix ?? '') + money(parsed.amount)} · {renderLabel(parsed)} ·{' '}
          {renderCategory(parsed)}
          {day ? ` · ${t('format.day', { day })}` : ''}
        </ThemedText>
      ) : raw.trim() ? (
        <ThemedText style={[styles.preview, { color: palette.textMuted }]}>
          {incompleteText}
        </ThemedText>
      ) : null}

      <DayPickerSheet
        visible={dayOpen}
        monthDate={monthDate}
        selectedDay={day}
        onSelectDay={(d) => {
          setDay(d);
          setDayOpen(false);
        }}
        onClose={() => setDayOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.xs,
    paddingLeft: Spacing.lg,
  },
  input: { flex: 1, fontSize: FontSize.md, height: 44, paddingVertical: 0 },
  send: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  dayIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    lineHeight: FontSize.sm * 1.4,
  },
  preview: {
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * 1.4,
    paddingLeft: Spacing.sm,
  },
});
