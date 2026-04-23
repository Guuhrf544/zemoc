import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

interface Props extends TextInputProps {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, hint, style, ...rest },
  ref
) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <View style={styles.wrap}>
      {label ? (
        <ThemedText style={[styles.label, { color: palette.textMuted }]}>
          {label}
        </ThemedText>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={palette.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            color: palette.text,
          },
          style,
        ]}
        {...rest}
      />
      {hint ? (
        <ThemedText style={[styles.hint, { color: palette.textMuted }]}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: Spacing.xs },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  input: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.md,
  },
  hint: { fontSize: FontSize.xs, lineHeight: FontSize.xs * 1.4 },
});
