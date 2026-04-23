import { Pressable, StyleSheet } from 'react-native';

import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { IconSymbol } from './ui/icon-symbol';

interface Props {
  onPress: () => void;
  bottomOffset?: number;
}

export function FAB({ onPress, bottomOffset = 24 }: Props) {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.fab,
        {
          bottom: bottomOffset,
          backgroundColor: palette.tint,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
    >
      <IconSymbol name="plus" size={28} color={palette.onAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
