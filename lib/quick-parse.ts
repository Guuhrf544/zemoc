import { parseMoneyInput } from '@/lib/format';

// Lowercase + strip accents so "Café"/"cafe" and "salário"/"salario" match.
// NFD splits accented letters into base + combining mark; we drop the marks
// (U+0300–U+036F = combining diacritics).
export const normalize = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// First category whose keyword matches. Single-word keywords match a whole
// token (so "bar" won't hit "barbearia" nor "bus" hit "business"); multi-word
// keywords (e.g. "rent income") match as a normalized substring.
export function guessFrom<C extends string>(
  keywords: Record<C, string[]>,
  text: string,
  fallback: C
): C {
  const norm = normalize(text);
  const tokens = new Set(norm.split(/[^a-z0-9]+/).filter(Boolean));
  for (const category of Object.keys(keywords) as C[]) {
    const hit = keywords[category].some((k) => {
      const nk = normalize(k);
      return nk.includes(' ') ? norm.includes(nk) : tokens.has(nk);
    });
    if (hit) return category;
  }
  return fallback;
}

export interface ParsedAmount {
  amount: number;
  label: string;
}

// Parses "15 coffee" / "coffee 15" → { amount, label }. Uses parseMoneyInput so
// "1.234,56" and "1,5" are handled robustly and identically for expenses and
// incomes (the old expense parser mishandled multiple separators).
export const parseQuickEntry = (raw: string): ParsedAmount | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const leading = trimmed.match(/^([\d][\d.,]*)\s+(.+)$/);
  const trailing = trimmed.match(/^(.+?)\s+([\d][\d.,]*)$/);
  const match = leading ?? trailing;
  if (!match) return null;

  const amountStr = leading ? match[1] : match[2];
  const label = (leading ? match[2] : match[1]).trim();

  const amount = parseMoneyInput(amountStr);
  if (!Number.isFinite(amount) || amount <= 0 || !label) return null;

  return { amount, label };
};
