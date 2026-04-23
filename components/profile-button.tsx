import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Colors, FontSize } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getInitials, useProfile } from '@/lib/store/profile';

import { ThemedText } from './themed-text';

const SIZE = 44;

export function ProfileButton() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const profile = useProfile((s) => s.profile);

  return (
    <Pressable
      onPress={() => router.push('/profile')}
      style={({ pressed }) => [
        styles.wrap,
        {
          backgroundColor: palette.surfaceAlt,
          borderColor: palette.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {profile.photoUri ? (
        <Image source={{ uri: profile.photoUri }} style={styles.image} />
      ) : (
        <ThemedText style={[styles.initials, { color: palette.tint }]}>
          {getInitials(profile.name)}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  initials: { fontSize: FontSize.sm, fontWeight: '700' },
});
