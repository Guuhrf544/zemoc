import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'en' | 'pt';
export type CurrencyCode = 'EUR' | 'BRL' | 'USD';
export type Appearance = 'light' | 'dark' | 'auto';

export interface Settings {
  language: Language;
  currency: CurrencyCode;
  appearance: Appearance;
  notifications: boolean;
  securityPin: boolean;
  securityBiometric: boolean;
}

interface State {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
}

const DEFAULT: Settings = {
  language: 'en',
  currency: 'EUR',
  appearance: 'dark',
  notifications: true,
  securityPin: false,
  securityBiometric: false,
};

export const useSettings = create<State>()(
  persist(
    (set) => ({
      settings: DEFAULT,
      update: (patch) =>
        set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: 'zemoc-settings',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      partialize: (state) => ({ settings: state.settings }) as State,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      migrate: (persisted: any, version) => {
        const prev = (persisted?.settings ?? {}) as Record<string, unknown>;
        if (version < 2) {
          const migrated: Settings = {
            language: (prev.language as Language) ?? DEFAULT.language,
            currency: (prev.currency as CurrencyCode) ?? DEFAULT.currency,
            appearance: (prev.appearance as Appearance) ?? DEFAULT.appearance,
            notifications:
              typeof prev.notifications === 'boolean' ? prev.notifications : DEFAULT.notifications,
            securityPin:
              typeof prev.securityPin === 'boolean' ? prev.securityPin : DEFAULT.securityPin,
            securityBiometric:
              typeof prev.securityBiometric === 'boolean'
                ? prev.securityBiometric
                : DEFAULT.securityBiometric,
          };
          return { settings: migrated } as State;
        }
        return persisted as State;
      },
    }
  )
);

export const CURRENCY_SYMBOL: Record<CurrencyCode, string> = {
  EUR: '€',
  BRL: 'R$',
  USD: '$',
};

export const localeFor = (language: Language): string =>
  language === 'pt' ? 'pt-BR' : 'en-IE';
