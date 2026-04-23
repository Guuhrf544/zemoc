import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';

type Variant = 'primary' | 'secondary' | 'danger';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  leading?: ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  leading,
}: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  const bg =
    variant === 'primary'
      ? palette.tint
      : variant === 'danger'
        ? palette.danger
        : palette.surfaceAlt;
  const fg = variant === 'secondary' ? palette.text : palette.onAccent;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.content}>
          {leading}
          <ThemedText style={[styles.label, { color: fg }]}>{label}</ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  label: { fontSize: FontSize.md, fontWeight: '600', lineHeight: FontSize.md * 1.3 },
});
