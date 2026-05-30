import { parseQuickExpense, type ParsedQuick } from '@/lib/categorize';
import { useT } from '@/lib/i18n';
import type { Category } from '@/types/models';

import { QuickEntryInput } from './quick-entry-input';

interface Props {
  onSubmit: (data: {
    amount: number;
    description: string;
    category: Category;
    day: number | null;
  }) => void;
  monthDate: Date;
}

export function QuickExpenseInput({ onSubmit, monthDate }: Props) {
  const t = useT();
  return (
    <QuickEntryInput<ParsedQuick>
      monthDate={monthDate}
      parse={parseQuickExpense}
      placeholder={t('quick.expense.placeholder')}
      incompleteText={t('quick.expense.incomplete')}
      renderLabel={(p) => p.description}
      renderCategory={(p) => t(`category.${p.category}` as never)}
      onSubmit={onSubmit}
    />
  );
}
