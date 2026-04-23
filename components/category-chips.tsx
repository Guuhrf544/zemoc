import { Pressable, ScrollView, StyleSheet } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Props<T extends string> {
  value?: T;
  onChange: (c: T) => void;
  categories: readonly T[];
  labelFor?: (c: T) => string;
}

export function CategoryChips<T extends string>({
  value,
  onChange,
  categories,
  labelFor,
}: Props<T>) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {categories.map((c) => {
        const active = value === c;
        return (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? palette.tint : palette.surface,
                borderColor: active ? palette.tint : palette.border,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                { color: active ? palette.onAccent : palette.text },
              ]}
            >
              {labelFor ? labelFor(c) : c}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: Spacing.sm, paddingVertical: Spacing.xs },
  chip: {
    paddingHorizontal: Spacing.lg,
    height: 38,
    borderRadius: Radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: FontSize.sm, fontWeight: '500', lineHeight: FontSize.sm * 1.4 },
});
