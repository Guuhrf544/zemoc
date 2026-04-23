import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <View style={[styles.track, { backgroundColor: palette.surfaceAlt }]}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={[styles.seg, active && { backgroundColor: palette.tint }]}
          >
            <ThemedText
              style={[
                styles.label,
                { color: active ? palette.onAccent : palette.text },
              ]}
            >
              {opt.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  seg: {
    flex: 1,
    height: 40,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    lineHeight: FontSize.sm * 1.4,
  },
});
