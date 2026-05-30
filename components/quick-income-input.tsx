import { parseQuickIncome, type ParsedQuickIncome } from '@/lib/categorize-income';
import { useT } from '@/lib/i18n';
import type { IncomeCategory } from '@/types/models';

import { QuickEntryInput } from './quick-entry-input';

interface Props {
  onSubmit: (data: {
    amount: number;
    source: string;
    category: IncomeCategory;
    day: number | null;
  }) => void;
  monthDate: Date;
}

export function QuickIncomeInput({ onSubmit, monthDate }: Props) {
  const t = useT();
  return (
    <QuickEntryInput<ParsedQuickIncome>
      monthDate={monthDate}
      parse={parseQuickIncome}
      placeholder={t('quick.income.placeholder')}
      incompleteText={t('quick.income.incomplete')}
      renderLabel={(p) => p.source}
      renderCategory={(p) => t(`incomeCategory.${p.category}` as never)}
      amountPrefix="+"
      onSubmit={onSubmit}
    />
  );
}
