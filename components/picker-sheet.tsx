import { useEffect, useRef } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
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
        <ThemedText style={[styles.title, { color: palette.text }]}>
          {title}
        </ThemedText>
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
                  <IconSymbol
                    name="checkmark"
                    size={20}
                    color={palette.tint}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>
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
