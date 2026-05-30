import { memo, useCallback } from 'react';

import { useDateFormat, useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import type { Subscription } from '@/types/models';

import { ListItemRow } from './list-item-row';

interface Props {
  subscription: Subscription;
  onPress: (id: string) => void;
}

function SubscriptionItemInner({ subscription, onPress }: Props) {
  const t = useT();
  const money = useMoney();
  const { billingSchedule, periodLabel } = useDateFormat();
  const handlePress = useCallback(
    () => onPress(subscription.id),
    [onPress, subscription.id]
  );

  const categoryText = subscription.category
    ? t(`category.${subscription.category}` as never)
    : '';

  return (
    <ListItemRow
      onPress={handlePress}
      title={subscription.name}
      meta={`${billingSchedule(subscription)}${categoryText ? ` · ${categoryText}` : ''}`}
      amount={money(subscription.amount)}
      trailingSublabel={periodLabel(subscription.billingPeriod)}
    />
  );
}

export const SubscriptionItem = memo(SubscriptionItemInner);
