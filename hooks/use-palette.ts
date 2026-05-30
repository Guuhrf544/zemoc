import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Resolved color palette for the active light/dark scheme. */
export type Palette = (typeof Colors)['light' | 'dark'];

/** Returns the theme palette for the current scheme (defaults to dark). */
export function usePalette(): Palette {
  return Colors[useColorScheme() ?? 'dark'];
}
