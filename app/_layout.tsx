import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { LockGate } from '@/components/lock-gate';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const NavThemeDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    border: Colors.dark.border,
    text: Colors.dark.text,
    primary: Colors.dark.tint,
  },
};

const NavThemeLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.surface,
    border: Colors.light.border,
    text: Colors.light.text,
    primary: Colors.light.tint,
  },
};

export default function RootLayout() {
  const scheme = useColorScheme() ?? 'dark';
  const navTheme = scheme === 'dark' ? NavThemeDark : NavThemeLight;

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="subscription/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="expense/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="income/[id]" options={{ presentation: 'modal' }} />
          <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="pin-setup" options={{ presentation: 'modal' }} />
          <Stack.Screen name="terms" options={{ presentation: 'modal' }} />
          <Stack.Screen name="privacy" options={{ presentation: 'modal' }} />
        </Stack>
        <LockGate />
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
