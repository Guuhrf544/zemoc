export interface DayExtraction {
  remaining: string;
  day: number | null;
}

export const extractDay = (raw: string): DayExtraction => {
  const patterns: RegExp[] = [
    /\s*\(\s*(?:day|dia|d)\s+(\d{1,2})\s*\)\s*$/i,
    /\s*\((\d{1,2})\)\s*$/,
    /\s+(?:day|dia|d)\s+(\d{1,2})\s*$/i,
  ];
  for (const pattern of patterns) {
    const match = raw.match(pattern);
    if (match && match.index !== undefined) {
      const day = parseInt(match[1], 10);
      if (day >= 1 && day <= 31) {
        return { remaining: raw.slice(0, match.index).trim(), day };
      }
    }
  }
  return { remaining: raw, day: null };
};

export const dateForDay = (
  referenceMonth: Date,
  day: number | null,
  isCurrentMonth: boolean
): Date => {
  const year = referenceMonth.getFullYear();
  const month = referenceMonth.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const resolvedDay =
    day !== null
      ? Math.max(1, Math.min(lastDay, day))
      : isCurrentMonth
        ? Math.min(lastDay, new Date().getDate())
        : 1;
  return new Date(year, month, resolvedDay, 12, 0, 0, 0);
};
