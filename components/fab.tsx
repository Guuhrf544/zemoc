import { Pressable, StyleSheet } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

import { IconSymbol } from './ui/icon-symbol';

interface Props {
  onPress: () => void;
  bottomOffset?: number;
}

export function FAB({ onPress, bottomOffset = 24 }: Props) {
  const palette = usePalette();

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
