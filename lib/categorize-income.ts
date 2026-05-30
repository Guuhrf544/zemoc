import type { IncomeCategory } from '@/types/models';

import { guessFrom, parseQuickEntry } from './quick-parse';

const KEYWORDS: Record<IncomeCategory, string[]> = {
  Salary: [
    'salary', 'wage', 'paycheck', 'payday', 'payroll',
    'salário', 'pagamento', 'contracheque', 'holerite',
  ],
  Freelance: [
    'freelance', 'gig', 'contract', 'project', 'client', 'consulting',
    'commission', 'freela', 'projeto', 'cliente', 'bico',
  ],
  Bonus: ['bonus', 'tip', 'tips', '13th', 'thirteenth', 'bônus', 'gorjeta', 'décimo'],
  Investment: [
    'dividend', 'dividends', 'stocks', 'stock', 'interest', 'crypto', 'btc',
    'eth', 'investment', 'rental', 'rent income', 'yield',
    'dividendos', 'juros', 'rendimento', 'ações', 'investimento',
  ],
  Gift: ['gift', 'present', 'presente'],
  Refund: [
    'refund', 'reimbursement', 'chargeback', 'cashback',
    'reembolso', 'estorno', 'devolução',
  ],
  Other: [],
};

export const guessIncomeCategory = (source: string): IncomeCategory =>
  guessFrom(KEYWORDS, source, 'Other');

export interface ParsedQuickIncome {
  amount: number;
  source: string;
  category: IncomeCategory;
}

export const parseQuickIncome = (raw: string): ParsedQuickIncome | null => {
  const parsed = parseQuickEntry(raw);
  if (!parsed) return null;
  return {
    amount: parsed.amount,
    source: parsed.label,
    category: guessIncomeCategory(parsed.label),
  };
};
