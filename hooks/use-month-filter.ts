import { useMemo, useState } from 'react';

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

export function useMonthFilter(): MonthFilter {
  const [offset, setOffset] = useState(0);
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
    prev: () => setOffset((o) => o - 1),
    next: () => setOffset((o) => o + 1),
    reset: () => setOffset(0),
    setOffset: (o: number) => setOffset(o),
  };
}
