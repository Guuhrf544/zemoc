import { parseMoneyInput } from '@/lib/format';
import type { IncomeCategory } from '@/types/models';

const KEYWORDS: Record<IncomeCategory, string[]> = {
  Salary: ['salary', 'wage', 'paycheck', 'payday', 'payroll', 'salario', 'salário'],
  Freelance: [
    'freelance', 'gig', 'contract', 'project', 'client', 'consulting',
    'commission',
  ],
  Bonus: ['bonus', 'tip', 'tips', '13th', 'thirteenth'],
  Investment: [
    'dividend', 'dividends', 'stocks', 'stock', 'interest', 'crypto', 'btc',
    'eth', 'investment', 'rental', 'rent income', 'yield',
  ],
  Gift: ['gift', 'present'],
  Refund: ['refund', 'reimbursement', 'chargeback', 'cashback'],
  Other: [],
};

export const guessIncomeCategory = (source: string): IncomeCategory => {
  const lower = source.toLowerCase();
  for (const category of Object.keys(KEYWORDS) as IncomeCategory[]) {
    if (KEYWORDS[category].some((k) => lower.includes(k))) return category;
  }
  return 'Other';
};

export interface ParsedQuickIncome {
  amount: number;
  source: string;
  category: IncomeCategory;
}

export const parseQuickIncome = (raw: string): ParsedQuickIncome | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const leading = trimmed.match(/^([\d][\d.,]*)\s+(.+)$/);
  const trailing = trimmed.match(/^(.+?)\s+([\d][\d.,]*)$/);

  const match = leading ?? trailing;
  if (!match) return null;

  const amountStr = leading ? match[1] : match[2];
  const source = (leading ? match[2] : match[1]).trim();

  const amount = parseMoneyInput(amountStr);
  if (!Number.isFinite(amount) || amount <= 0 || !source) return null;

  return { amount, source, category: guessIncomeCategory(source) };
};
