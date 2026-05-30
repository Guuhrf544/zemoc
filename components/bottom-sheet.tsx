import { type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Radius, Spacing } from '@/constants/theme';
import { usePalette } from '@/hooks/use-palette';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const palette = usePalette();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
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
        {children}
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
});
