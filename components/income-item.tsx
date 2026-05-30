import { memo, useCallback } from 'react';

import { formatShortDate, useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { INCOME_CATEGORY_COLOR, type Income } from '@/types/models';

import { ListItemRow } from './list-item-row';

interface Props {
  income: Income;
  onPress: (id: string) => void;
  planned?: boolean;
}

function IncomeItemInner({ income, onPress, planned }: Props) {
  const t = useT();
  const money = useMoney();
  const handlePress = useCallback(() => onPress(income.id), [onPress, income.id]);
  const category = t(`incomeCategory.${income.category}` as never);

  return (
    <ListItemRow
      onPress={handlePress}
      dotColor={INCOME_CATEGORY_COLOR[income.category]}
      title={income.source}
      badge={planned ? t('badge.planned') : undefined}
      meta={`${category} · ${formatShortDate(income.date)}`}
      amount={money(income.amount)}
      amountTone="positive"
      amountPrefix="+"
    />
  );
}

export const IncomeItem = memo(IncomeItemInner);
