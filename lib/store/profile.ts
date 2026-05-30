import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Profile {
  name: string;
  photoUri?: string;
}

interface State {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
}

const EMPTY: Profile = { name: '', photoUri: undefined };

export const useProfile = create<State>()(
  persist(
    (set) => ({
      profile: EMPTY,
      update: (patch) =>
        set((state) => ({ profile: { ...state.profile, ...patch } })),
    }),
    {
      name: 'zemoc-profile',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted: any) => {
        const prev = (persisted?.profile ?? {}) as Record<string, unknown>;
        return {
          profile: {
            name: typeof prev.name === 'string' ? prev.name : '',
            photoUri: typeof prev.photoUri === 'string' ? prev.photoUri : undefined,
          },
        } as State;
      },
    }
  )
);

export const PLACEHOLDER_AVATAR = '👤';

export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return PLACEHOLDER_AVATAR;
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
