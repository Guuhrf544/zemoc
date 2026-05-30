import { memo, useCallback } from 'react';

import { formatShortDate, useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { CATEGORY_COLOR, type Expense } from '@/types/models';

import { ListItemRow } from './list-item-row';

interface Props {
  expense: Expense;
  onPress: (id: string) => void;
  planned?: boolean;
}

function ExpenseItemInner({ expense, onPress, planned }: Props) {
  const t = useT();
  const money = useMoney();
  const handlePress = useCallback(() => onPress(expense.id), [onPress, expense.id]);
  const category = t(`category.${expense.category}` as never);

  return (
    <ListItemRow
      onPress={handlePress}
      dotColor={CATEGORY_COLOR[expense.category]}
      title={expense.description}
      badge={planned ? t('badge.planned') : undefined}
      meta={`${category} · ${formatShortDate(expense.date)}`}
      amount={money(expense.amount)}
    />
  );
}

export const ExpenseItem = memo(ExpenseItemInner);
