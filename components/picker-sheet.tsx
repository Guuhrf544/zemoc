import { useEffect, useRef } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FontSize, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

import { BottomSheet } from './bottom-sheet';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface Props<T extends string> {
  visible: boolean;
  title: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  onClose: () => void;
}

const ROW_HEIGHT = 52;

export function PickerSheet<T extends string>({
  visible,
  title,
  options,
  value,
  onChange,
  onClose,
}: Props<T>) {
  const palette = usePalette();
  const scrollRef = useRef<ScrollView>(null);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const maxListHeight = Dimensions.get('window').height * 0.55;

  useEffect(() => {
    if (visible && selectedIndex >= 0) {
      const y = Math.max(0, selectedIndex * ROW_HEIGHT - 100);
      const id = setTimeout(() => {
        scrollRef.current?.scrollTo({ y, animated: false });
      }, 50);
      return () => clearTimeout(id);
    }
  }, [visible, selectedIndex]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <ThemedText style={[styles.title, { color: palette.text }]}>{title}</ThemedText>
      <ScrollView
        ref={scrollRef}
        style={{ maxHeight: maxListHeight }}
        showsVerticalScrollIndicator={false}
      >
        {options.map((opt, idx) => {
          const active = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={({ pressed }) => [
                styles.row,
                idx !== options.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: palette.border,
                },
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <View style={{ flex: 1 }}>
                <ThemedText style={[styles.label, { color: palette.text }]}>
                  {opt.label}
                </ThemedText>
                {opt.hint ? (
                  <ThemedText style={[styles.hint, { color: palette.textMuted }]}>
                    {opt.hint}
                  </ThemedText>
                ) : null}
              </View>
              {active ? (
                <IconSymbol name="checkmark" size={20} color={palette.tint} />
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: FontSize.lg * 1.3,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    minHeight: ROW_HEIGHT,
  },
  label: { fontSize: FontSize.md, fontWeight: '500', lineHeight: FontSize.md * 1.3 },
  hint: { fontSize: FontSize.sm, lineHeight: FontSize.sm * 1.4, marginTop: 2 },
});
