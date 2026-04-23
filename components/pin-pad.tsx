import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';

interface Props {
  length?: number;
  title?: string;
  subtitle?: string;
  error?: string;
  onComplete: (pin: string) => void;
}

export function PinPad({
  length = 4,
  title,
  subtitle,
  error,
  onComplete,
}: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (error) setPin('');
  }, [error]);

  const press = (digit: string) => {
    if (pin.length >= length) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === length) {
      onComplete(next);
    }
  };

  const backspace = () => setPin((p) => p.slice(0, -1));

  const keys: (string | 'back' | 'empty')[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'empty', '0', 'back',
  ];

  return (
    <View style={styles.container}>
      {title ? (
        <ThemedText style={[styles.title, { color: palette.text }]}>
          {title}
        </ThemedText>
      ) : null}
      {subtitle ? (
        <ThemedText style={[styles.subtitle, { color: palette.textMuted }]}>
          {subtitle}
        </ThemedText>
      ) : null}

      <View style={styles.dots}>
        {Array.from({ length }).map((_, i) => {
          const filled = pin.length > i;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: filled ? palette.tint : 'transparent',
                  borderColor: filled ? palette.tint : palette.border,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.errorWrap}>
        {error ? (
          <ThemedText style={[styles.error, { color: palette.danger }]}>
            {error}
          </ThemedText>
        ) : null}
      </View>

      <View style={styles.grid}>
        {keys.map((k, idx) => {
          if (k === 'empty') {
            return <View key={idx} style={styles.key} />;
          }
          if (k === 'back') {
            return (
              <Pressable
                key={idx}
                onPress={backspace}
                style={({ pressed }) => [
                  styles.key,
                  { opacity: pressed ? 0.5 : 1 },
                ]}
              >
                <IconSymbol name="delete.left" size={26} color={palette.text} />
              </Pressable>
            );
          }
          return (
            <Pressable
              key={idx}
              onPress={() => press(k)}
              style={({ pressed }) => [
                styles.key,
                {
                  backgroundColor: pressed ? palette.surfaceAlt : 'transparent',
                },
              ]}
            >
              <ThemedText style={[styles.keyText, { color: palette.text }]}>
                {k}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = 14;
const KEY_SIZE = 72;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    lineHeight: FontSize.xl * 1.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    lineHeight: FontSize.md * 1.4,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 1.5,
  },
  errorWrap: {
    minHeight: 24,
    justifyContent: 'center',
  },
  error: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: KEY_SIZE * 3 + Spacing.lg * 2,
    gap: Spacing.lg,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 40,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
