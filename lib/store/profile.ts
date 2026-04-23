import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Profile {
  name: string;
  email: string;
  phone?: string;
  photoUri?: string;
}

interface State {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
}

const EMPTY: Profile = { name: '', email: '', phone: undefined, photoUri: undefined };

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
    }
  )
);

export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
