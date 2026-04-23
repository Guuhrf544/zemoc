import { useMemo } from 'react';
import { create } from 'zustand';

import { formatLongMonth } from '@/lib/format';
import { useSettings } from '@/lib/store/settings';

export interface MonthFilter {
  monthDate: Date;
  monthIso: string;
  monthLabel: string;
  offset: number;
  isCurrent: boolean;
  canGoForward: boolean;
  prev: () => void;
  next: () => void;
  reset: () => void;
  setOffset: (o: number) => void;
}

interface OffsetStore {
  offset: number;
  setOffset: (o: number) => void;
}

const useMonthOffset = create<OffsetStore>((set) => ({
  offset: 0,
  setOffset: (o) => set({ offset: o }),
}));

export function useMonthFilter(): MonthFilter {
  const offset = useMonthOffset((s) => s.offset);
  const setOffset = useMonthOffset((s) => s.setOffset);
  useSettings((s) => s.settings.language);

  const monthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1, 12, 0, 0, 0);
  }, [offset]);

  const monthIso = monthDate.toISOString();
  const monthLabel = formatLongMonth(monthDate);

  return {
    monthDate,
    monthIso,
    monthLabel,
    offset,
    isCurrent: offset === 0,
    canGoForward: true,
    prev: () => setOffset(offset - 1),
    next: () => setOffset(offset + 1),
    reset: () => setOffset(0),
    setOffset,
  };
}
