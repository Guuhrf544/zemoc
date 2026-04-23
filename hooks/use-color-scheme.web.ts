import { useColorScheme as useNativeColorScheme } from 'react-native';

import { useSettings } from '@/lib/store/settings';

export function useColorScheme(): 'light' | 'dark' {
  const appearance = useSettings((s) => s.settings.appearance);
  const native = useNativeColorScheme();

  if (appearance === 'light') return 'light';
  if (appearance === 'dark') return 'dark';
  return native === 'light' ? 'light' : 'dark';
}
