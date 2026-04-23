import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useT } from '@/lib/i18n';
import { getInitials, useProfile } from '@/lib/store/profile';

export default function ProfileScreen() {
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();

  const profile = useProfile((s) => s.profile);
  const updateProfile = useProfile((s) => s.update);

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(profile.photoUri);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        t('profile.alert.permission.title'),
        t('profile.alert.permission.msg')
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const onSave = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      Alert.alert(t('alert.name.title'), t('profile.alert.nameRequired.msg'));
      return;
    }
    updateProfile({
      name: trimmedName,
      email: trimmedEmail,
      phone: phone.trim() || undefined,
      photoUri,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: palette.background }}
    >
      <Stack.Screen
        options={{
          title: t('profile.title'),
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}
      />
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarWrap}>
          <Pressable
            onPress={pickImage}
            style={({ pressed }) => [
              styles.avatar,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <ThemedText style={[styles.avatarInitials, { color: palette.tint }]}>
                {getInitials(name)}
              </ThemedText>
            )}
          </Pressable>
          <Pressable onPress={pickImage}>
            <ThemedText style={[styles.changePhoto, { color: palette.tint }]}>
              {photoUri ? t('profile.photo.change') : t('profile.photo.add')}
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: palette.textMuted }]}>
            {t('profile.personalData')}
          </ThemedText>
          <Input
            label={t('profile.name')}
            placeholder={t('profile.name.placeholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label={t('profile.email')}
            placeholder={t('profile.email.placeholder')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            label={t('profile.phone')}
            placeholder={t('profile.phone.placeholder')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: palette.textMuted }]}>
            {t('profile.settings')}
          </ThemedText>
          <Pressable
            onPress={() => router.push('/settings')}
            style={({ pressed }) => [
              styles.settingsRow,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <View style={[styles.settingsIcon, { backgroundColor: palette.surfaceAlt }]}>
              <IconSymbol name="gearshape" size={18} color={palette.text} />
            </View>
            <ThemedText style={[styles.settingsLabel, { color: palette.text }]}>
              {t('profile.appSettings')}
            </ThemedText>
            <IconSymbol name="chevron.right" size={16} color={palette.textMuted} />
          </Pressable>
        </View>

        <Button label={t('common.save')} onPress={onSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.xl,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl * 2,
  },
  avatarWrap: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%' },
  avatarInitials: { fontSize: FontSize.display, fontWeight: '700' },
  changePhoto: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    lineHeight: FontSize.sm * 1.4,
  },
  section: { gap: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    minHeight: 56,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    lineHeight: FontSize.md * 1.3,
  },
});
