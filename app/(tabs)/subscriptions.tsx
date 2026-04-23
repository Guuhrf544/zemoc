import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { FAB } from '@/components/fab';
import { Screen } from '@/components/screen';
import { SubscriptionItem } from '@/components/subscription-item';
import { ThemedText } from '@/components/themed-text';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMoney } from '@/lib/format';
import { useT } from '@/lib/i18n';
import { subscriptionsMonthlyTotal, useSubscriptions } from '@/lib/store/subscriptions';

export default function SubscriptionsScreen() {
  const items = useSubscriptions((s) => s.items);
  const scheme = useColorScheme() ?? 'dark';
  const palette = Colors[scheme];
  const t = useT();
  const money = useMoney();

  const total = subscriptionsMonthlyTotal(items);
  const sorted = [...items].sort((a, b) => a.billingDay - b.billingDay);

  return (
    <Screen title={t('subs.title')} subtitle={t('subs.subtitle')}>
      <View
        style={[
          styles.totalCard,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <ThemedText style={[styles.totalLabel, { color: palette.textMuted }]}>
          {t('subs.monthlyTotal')}
        </ThemedText>
        <ThemedText style={[styles.totalValue, { color: palette.text }]}>
          {money(total)}
        </ThemedText>
      </View>

      {items.length === 0 ? (
        <EmptyState
          title={t('subs.empty.title')}
          message={t('subs.empty.message')}
        />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <SubscriptionItem
              subscription={item}
              onPress={() => router.push(`/subscription/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB onPress={() => router.push('/subscription/new')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  totalCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    lineHeight: FontSize.sm * 1.4,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  totalValue: {
    fontSize: FontSize.xxl,
    fontWeight: '700',
    lineHeight: FontSize.xxl * 1.25,
    marginTop: Spacing.xs,
  },
  list: { paddingBottom: 120 },
});
