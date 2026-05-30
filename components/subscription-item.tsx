import { memo, useCallback } from 'react';

import { formatBillingSchedule, formatPeriodLabel, useMoney } from '@/lib/format';
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
      meta={`${formatBillingSchedule(subscription)}${categoryText ? ` · ${categoryText}` : ''}`}
      amount={money(subscription.amount)}
      trailingSublabel={formatPeriodLabel(subscription.billingPeriod)}
    />
  );
}

export const SubscriptionItem = memo(SubscriptionItemInner);
