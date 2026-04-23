import { create } from 'zustand';

interface LockState {
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;
}

export const useLock = create<LockState>((set) => ({
  unlocked: false,
  setUnlocked: (v) => set({ unlocked: v }),
}));
