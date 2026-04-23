import { Platform } from 'react-native';

export const Brand = {
  primary: '#0E3B2E',
  primaryLight: '#10503F',
  accent: '#34D399',
  accentStrong: '#10B981',
} as const;

export const Colors = {
  light: {
    text: '#0A0F0D',
    textMuted: '#5C6B65',
    background: '#FFFFFF',
    surface: '#FAFCFB',
    surfaceAlt: '#E9F7EF',
    border: '#D9E7DF',
    tint: Brand.accentStrong,
    icon: '#5C6B65',
    tabIconDefault: '#A0ABA6',
    tabIconSelected: Brand.accentStrong,
    danger: '#DC2626',
    success: Brand.accentStrong,
    warning: '#D97706',
    hero: '#E9F7EF',
    heroBorder: '#C7E5D3',
    heroText: '#0A0F0D',
    heroMuted: '#5C6B65',
    heroPositive: '#059669',
    onAccent: '#FFFFFF',
  },
  dark: {
    text: '#ECFDF5',
    textMuted: '#9BA8A2',
    background: '#0A0F0D',
    surface: '#131916',
    surfaceAlt: '#1A2220',
    border: '#23302B',
    tint: Brand.accent,
    icon: '#9BA8A2',
    tabIconDefault: '#6B7672',
    tabIconSelected: Brand.accent,
    danger: '#F87171',
    success: Brand.accent,
    warning: '#FBBF24',
    hero: Brand.primary,
    heroBorder: Brand.primaryLight,
    heroText: '#ECFDF5',
    heroMuted: '#9BA8A2',
    heroPositive: Brand.accent,
    onAccent: '#0A0F0D',
  },
};

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const Radius = { sm: 6, md: 10, lg: 16, xl: 24, pill: 999 } as const;
export const FontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 22, xxl: 28, display: 36 } as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
